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
    
    def get_business_plan(self, project_id: str) -> Dict[str, Any]:
        """
        Retrieve a business plan from the database.
        
        Args:
            project_id: The ID of the business plan to retrieve
        
        Returns:
            Dict: Business plan data including all sections and metadata
        """
        try:
            # Query the business_plans table for the specific plan
            result = self.client.table("business_plans").select("*").eq("project_id", project_id).execute()
            
            # Check if business plan exists
            if not result.data or len(result.data) == 0:
                # Create default business plan
                default_content = {
                    "executiveSummary": {
                        "overview": "",
                        "mission": "",
                        "vision": "",
                        "objectives": [],
                        "completed": False
                    },
                    "projectDescription": {
                        "background": "",
                        "permaculturePrinciples": "",
                        "keyFeatures": [],
                        "completed": False
                    },
                    "marketAnalysis": {
                        "targetMarket": "",
                        "competition": "",
                        "trends": "",
                        "opportunities": "",
                        "completed": False
                    },
                    "productsAndServices": {
                        "description": "",
                        "pricing": "",
                        "uniqueSellingPoints": "",
                        "completed": False
                    },
                    "operatingPlan": {
                        "location": "",
                        "facilities": "",
                        "equipment": "",
                        "timeline": "",
                        "completed": False
                    },
                    "marketingStrategy": {
                        "overview": "",
                        "channels": [],
                        "partnerships": "",
                        "promotions": "",
                        "completed": False
                    },
                    "financialPlan": {
                        "startupCosts": "",
                        "operatingExpenses": "",
                        "revenueProjections": "",
                        "fundingSources": "",
                        "breakEvenAnalysis": "",
                        "completed": False
                    },
                    "implementationTimeline": {
                        "phases": [],
                        "milestones": [],
                        "completed": False
                    },
                    "riskAnalysis": {
                        "potentialRisks": [],
                        "mitigationStrategies": "",
                        "contingencyPlans": "",
                        "completed": False
                    },
                    "conclusion": {
                        "summary": "",
                        "nextSteps": "",
                        "completed": False
                    }
                }
                
                # Insert the new business plan into the database
                new_plan = {
                    "project_id": project_id,
                    "content": default_content
                }
                
                result = self.client.table("business_plans").insert(new_plan).execute()
                
            return result.data[0]
        except Exception as e:
            raise Exception(f"Failed to retrieve business plan: {str(e)}")
    
    def update_business_plan(self, plan_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a business plan in the database.
        
        Args:
            plan_id: The ID of the business plan to update
            content: The new content of the business plan
        
        Returns:
            Dict: The updated business plan data
        """
        try:
            # Update the business plan in the database
            result = self.client.table("business_plans").update(updates).eq("id", plan_id).execute()
            
            # Check if update was successful
            if not result.data or len(result.data) == 0:
                raise Exception(f"Business plan with ID {plan_id} not found or update failed")
            
            # Return the updated business plan
            return result.data[0]
        except Exception as e:
            raise Exception(f"Failed to update business plan: {str(e)}")
