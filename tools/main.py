from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional, Union

# Import utility modules
from python.utils.supabase import SupabaseClient
from python.utils.github import GitHubClient

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Open Agents Tool Server",
    description="Custom OpenAPI Tool Server for The Spatial Network's AI platform",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase_client = SupabaseClient(
    api_url=os.getenv("SUPABASE_API_URL"),
    api_key=os.getenv("SUPABASE_API_KEY")
)

# Initialize GitHub client (optional, only if token is provided)
github_client = None
github_token = os.getenv("GITHUB_TOKEN")
if github_token:
    try:
        github_client = GitHubClient(github_token)
    except Exception as e:
        print(f"Warning: Failed to initialize GitHub client: {e}")

# Models
class Project(BaseModel):
    id: str
    title: str
    category: Optional[str] = None
    created_at: Optional[str] = None
    created_by: str
    funding_needs: Optional[str] = None
    guilds: Optional[List[str]] = None
    latitude: Optional[float] = None
    location: Optional[str] = None
    longitude: Optional[float] = None
    power: Optional[str] = None
    property_status: str
    soil: Optional[str] = None
    structures: Optional[List[str]] = None
    team: Optional[List[str]] = None
    updated_at: Optional[str] = None
    values_mission_goals: Optional[str] = None
    water: Optional[str] = None
    zone_0: Optional[str] = None
    zone_1: Optional[str] = None
    zone_2: Optional[str] = None
    zone_3: Optional[str] = None
    zone_4: Optional[str] = None

class DocumentSubsection(BaseModel):
    id: str
    document_section_id: str
    name: str
    order: int
    priority: int
    content_type: str
    created_at: str
    updated_at: Optional[str] = None

class DocumentSection(BaseModel):
    id: str
    document_type_id: str
    name: str
    order: int
    created_at: str
    updated_at: Optional[str] = None
    document_subsections: Optional[List[DocumentSubsection]] = None

class DocumentType(BaseModel):
    id: str
    name: str
    created_at: str
    updated_at: Optional[str] = None
    document_sections: Optional[List[DocumentSection]]

class DocumentContent(BaseModel):
    id: str
    document_id: str
    document_subsection_id: str
    content: str
    created_at: str
    updated_at: Optional[str] = None

class Document(BaseModel):
    id: str
    title: str
    document_type_id: str
    project_id: str
    chat_id: Optional[str] = None
    status: str
    created_at: str
    updated_at: Optional[str] = None
    contents: Optional[List[DocumentContent]]

class DocumentContentItem(BaseModel):
    subsection_id: str
    content: Dict[str, Any]

class ContentUpdate(BaseModel):
    content_items: List[DocumentContentItem]

# GitHub Models
class GitHubIssueRequest(BaseModel):
    owner: str
    repo: str
    title: str
    body: Optional[str] = None
    labels: Optional[List[str]] = None
    assignees: Optional[List[str]] = None
    milestone: Optional[int] = None

class GitHubSimpleIssueRequest(BaseModel):
    owner: str
    repo: str
    title: str
    body: Optional[str] = None

class GitHubRepository(BaseModel):
    owner: str
    name: str
    full_name: str

class GitHubIssueResponse(BaseModel):
    id: int
    number: int
    title: str
    body: str
    state: str
    url: str
    api_url: str
    labels: List[str]
    assignees: List[str]
    milestone: Optional[str] = None
    created_at: str
    updated_at: str
    author: str
    repository: GitHubRepository

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the AI Open Agents Tool Server"}

@app.get("/health")
async def health_check(operation_id="health_check"):
    # Check if Supabase connection is working
    services = {}
    overall_status = "healthy"
    
    try:
        supabase_client.health_check()
        services["supabase"] = "connected"
    except Exception as e:
        services["supabase"] = str(e)
        overall_status = "unhealthy"
    
    # Check GitHub connection if client is available
    if github_client:
        try:
            github_status = github_client.health_check()
            services["github"] = github_status
        except Exception as e:
            services["github"] = {"status": "error", "error": str(e)}
            overall_status = "unhealthy"
    else:
        services["github"] = "not configured"
    
    return {"status": overall_status, "services": services}

# Project endpoints
@app.get("/projects/{project_id}", response_model=Project, operation_id="get_project")
async def get_project(project_id: str):
    """
    Retrieve information about a specific project.
    """
    return supabase_client.get_project(project_id)

# Document endpoints
@app.get("/document_types/{doc_type_name}", response_model=DocumentType, operation_id="get_document_type")
async def get_document_type(doc_type_name: str):
    """
    Retrieve document type information including all sections and metadata.
    """
    try:
        result = supabase_client.get_document_type(doc_type_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Document type not found: {str(e)}")

@app.get("/documents/{project_id}/{doc_type_id}", response_model=Document, operation_id="get_document_contents")
async def get_document_contents(project_id: str, doc_type_id: str):
    """
    Retrieve all existing contents of a document.
    """
    try:
        result = supabase_client.get_document_contents(project_id, doc_type_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Document not found: {str(e)}")

@app.post("/documents/{project_id}/{doc_type_id}", response_model=Document, operation_id="create_document")
async def create_document(project_id: str, doc_type_id: str):
    """
    Create a new document.
    """
    try:
        result = supabase_client.create_document(
            project_id=project_id,
            doc_type_id=doc_type_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create document: {str(e)}")

@app.put("/documents/{document_id}", response_model=Document, operation_id="update_document_content")
async def update_document_content(document_id: str, content_updates: ContentUpdate):
    """
    Update an existing document.
    """
    try:
        result = supabase_client.update_document_content(
            document_id=document_id,
            content_items=content_updates.content_items
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update document: {str(e)}")

# GitHub endpoints
@app.post("/github/issues", response_model=GitHubIssueResponse, operation_id="create_github_issue")
async def create_github_issue(issue_request: GitHubIssueRequest):
    """
    Create a new issue in a GitHub repository.
    """
    if not github_client:
        raise HTTPException(
            status_code=503, 
            detail="GitHub integration not configured. Please set GITHUB_TOKEN environment variable."
        )
    
    try:
        result = github_client.create_issue(
            owner=issue_request.owner,
            repo=issue_request.repo,
            title=issue_request.title,
            body=issue_request.body,
            labels=issue_request.labels,
            assignees=issue_request.assignees,
            milestone=issue_request.milestone
        )
        return GitHubIssueResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create GitHub issue: {str(e)}")

@app.post("/github/issues/simple", response_model=GitHubIssueResponse, operation_id="create_simple_github_issue")
async def create_simple_github_issue(issue_request: GitHubSimpleIssueRequest):
    """
    Create a simple GitHub issue with just owner, repo, title, and optional body.
    This is a simplified endpoint for basic issue creation that avoids URL length constraints.
    """
    if not github_client:
        raise HTTPException(
            status_code=503, 
            detail="GitHub integration not configured. Please set GITHUB_TOKEN environment variable."
        )
    
    try:
        result = github_client.create_issue(
            owner=issue_request.owner,
            repo=issue_request.repo,
            title=issue_request.title,
            body=issue_request.body
        )
        return GitHubIssueResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create GitHub issue: {str(e)}")

# Add more endpoints as needed for NextCloud and WordPress integration

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
