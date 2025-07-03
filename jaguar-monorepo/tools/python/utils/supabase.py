import os
from typing import Dict, List, Any, Optional
from datetime import datetime
from supabase import create_client, Client

class SupabaseClient:
    """
    A client for interacting with Supabase database.
    This utility handles all database operations for the AI Open Agents platform.
    """
    
    def __init__(self, api_url: str = None, api_key: str = None):
        """
        Initialize the Supabase client with API credentials.
        
        Args:
            api_url: Supabase API URL
            api_key: Supabase API Key
        """
        self.api_url = api_url or os.getenv("SUPABASE_API_URL")
        self.api_key = api_key or os.getenv("SUPABASE_API_KEY")
        
        if not self.api_url or not self.api_key:
            raise ValueError("Supabase API URL and API Key must be provided")
        
        self.client = create_client(self.api_url, self.api_key)
    
    def health_check(self) -> bool:
        """
        Check if the Supabase connection is working.
        
        Returns:
            bool: True if connection is successful
        """
        try:
            # Simple query to check connection
            self.client.table("projects").select("id").limit(1).execute()
            return True
        except Exception as e:
            raise Exception(f"Supabase connection failed: {str(e)}")
    
    def get_project(self, project_id: str) -> Dict[str, Any]:
        """
        Retrieve project information from the database.
        
        Args:
            project_id: The ID of the project to retrieve
        
        Returns:
            Dict: Project information including details, status, and metadata
        """
        try:
            # Query the projects table for the specific project
            result = self.client.table("projects").select("*").eq("id", project_id).execute()
            
            # Check if project exists
            if not result.data or len(result.data) == 0:
                raise Exception(f"Project with ID {project_id} not found")

            # Return the project data
            return result.data[0]
        except Exception as e:
            raise Exception(f"Failed to retrieve project: {str(e)}")
    
    def get_document_type(self, doc_type_name: str) -> Dict[str, Any]:
        """
        Retrieve document type information including all sections and metadata.
        
        Args:
            doc_type_name: The name of the document type to retrieve
        
        Returns:
            Dict: Document type data including all sections, subsections, and metadata
        """
        try:
            # Query the document_types table for the specific document type
            doc_type_result = self.client.table("document_types").select("*").eq("name", doc_type_name).execute()
            
            # Check if document type exists
            if not doc_type_result.data or len(doc_type_result.data) == 0:
                raise Exception(f"Document type '{doc_type_name}' not found")
            
            doc_type = doc_type_result.data[0]
            doc_type_id = doc_type["id"]
            
            # Get all sections and subsections in a single query with joins
            # First get all sections with their document type info
            sections_result = self.client.from_("document_sections") \
                .select("""
                    *,
                    document_subsections(*)
                """) \
                .eq("document_type_id", doc_type_id) \
                .order("order") \
                .execute()
            
            # Organize the data
            sections = sections_result.data
            
            # Combine all data
            doc_type['document_sections'] = sections
            
            return doc_type
        except Exception as e:
            raise Exception(f"Failed to retrieve document type: {str(e)}")
    
    def get_document_contents(self, project_id: str, doc_type_id: str) -> Dict[str, Any]:
        """
        Retrieve all existing contents of a document.
        
        Args:
            project_id: The ID of the project
            doc_type_id: The ID of the document type
        
        Returns:
            Dict: Document data including all content organized by sections and subsections
        """
        try:
            # Get document and all its content in a single query with joins
            doc_result = self.client.from_("documents") \
                .select("""
                    *,
                    document_content(
                        *,
                        document_subsections(
                            id, name, document_section_id, order, priority, content_type,
                            document_sections(id, name, document_type_id, order)
                        )
                    )
                """) \
                .eq("project_id", project_id) \
                .eq("document_type_id", doc_type_id) \
                .execute()
            
            # If document doesn't exist, return empty structure
            if not doc_result.data or len(doc_result.data) == 0:
                return {
                    "document": None,
                    "content": {}
                }
            
            document = doc_result.data[0]
            content_items = document.get("document_content", [])
            
            # Organize content by subsection
            organized_content = {}
            for content_item in content_items:
                subsection = content_item["document_subsections"]
                subsection_id = subsection["id"]
                
                organized_content[subsection_id] = {
                    "subsection": subsection,
                    "content": content_item["content"]
                }
            
            # Remove the content items from the document object to avoid duplication
            if "document_content" in document:
                del document["document_content"]
            
            return {
                "document": document,
                "content": organized_content
            }
        except Exception as e:
            raise Exception(f"Failed to retrieve document contents: {str(e)}")
    
    def create_document(self, project_id: str, doc_type_id: str) -> Dict[str, Any]:
        """
        Create a new document.
        
        Args:
            project_id: The ID of the project
            doc_type_id: The ID of the document type
            title: The title of the document
            content_items: List of content items, each containing subsection_id and content
        
        Returns:
            Dict: The created document data
        """
        try:
            
            doc_type_result = self.client.from_("document_types") \
                .select("*") \
                .eq("id", doc_type_id) \
                .execute()
            
            if not doc_type_result.data or len(doc_type_result.data) < 1:
                raise Exception(f"No Document Type found for id: {doc_type_id}")
            
            doc_type = doc_type_result.data[0]

            # Check if document already exists
            doc_result = self.client.from_("documents") \
                .select("*") \
                .eq("project_id", project_id) \
                .eq("document_type_id", doc_type_id) \
                .execute()

            # If document already exists, return it
            if doc_result.data and len(doc_result.data) > 0:
                return self.get_document_contents(project_id, doc_type_id)
            
            # Create new document
            new_doc = {
                "title": doc_type['name'],
                "project_id": project_id,
                "document_type_id": doc_type_id,
                "status": "draft"
            }
            doc_result = self.client.table("documents").insert(new_doc).execute()
            document = doc_result.data[0]
            document_id = document["id"]

            sections_result = self.client.from_("document_sections") \
                .select("""
                    *,
                    document_subsections(*)
                """) \
                .eq("document_type_id", doc_type_id) \
                .order("order") \
                .execute()
            
            # Add empty contents placeholders
            section_inserts = []
            for section in sections_result.data:
                for subsection in section['document_subsections']:
                    new_content = {
                        "document_id": document_id,
                        "document_subsection_id": subsection['id'],
                        "content": ""
                    }
                    section_inserts.append(new_content)
            
            self.client.table("document_content").insert(section_inserts).execute()
            
            return self.get_document_contents(project_id, doc_type_id)
        except Exception as e:
            raise Exception(f"Failed to create document: {str(e)}")
    
    def update_document_content(self, document_id: str, content_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Update an existing document's content.
        
        Args:
            document_id: The ID of the document to update
            content_items: List of content items, each containing subsection_id and content
        
        Returns:
            Dict: The updated document data
        """
        try:
            # Check if document exists
            doc_result = self.client.from_("documents") \
                .select("*") \
                .eq("id", document_id) \
                .execute()
            
            # If document doesn't exist, raise an exception
            if not doc_result.data or len(doc_result.data) == 0:
                raise Exception(f"Document with ID {document_id} not found")
            
            document = doc_result.data[0]
            project_id = document["project_id"]
            doc_type_id = document["document_type_id"]
            
            # Process each content item
            content_updates = []
            for item in content_items:
                subsection_id = item["subsection_id"]
                content = item["content"]

                content_update = {
                    "document_id": document_id,
                    "document_subsection_id": subsection_id,
                    "content": content
                }
                content_updates.append(content_update)
            
            self.client.table("document_content").upsert(content_updates).execute()
            
            return self.get_document_contents(project_id, doc_type_id)
        except Exception as e:
            raise Exception(f"Failed to update document: {str(e)}")
