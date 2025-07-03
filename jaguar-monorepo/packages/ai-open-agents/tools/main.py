from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

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

# Initialize GitHub client
github_client = GitHubClient(
    token=os.getenv("GITHUB_TOKEN")
)

# Models
class Project(BaseModel):
    id: str
    title: str
    location: Optional[str] = None
    description: Optional[str] = None
    property_status: str
    created_at: str
    updated_at: Optional[str] = None

class BusinessPlan(BaseModel):
    id: str
    project_id: str
    created_at: str
    content: Optional[str]
    update_at: Optional[str] = None

class BusinessPlanUpdate(BaseModel):
    content: str

class GitHubIssueCreate(BaseModel):
    owner: str
    repo: str
    title: str
    body: str
    labels: Optional[List[str]] = None
    assignees: Optional[List[str]] = None

class GitHubIssueUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    state: Optional[str] = None
    labels: Optional[List[str]] = None
    assignees: Optional[List[str]] = None

class SelfDevelopmentTask(BaseModel):
    owner: str
    repo: str
    task_type: str
    title: str
    description: str
    files: Optional[List[str]] = None
    priority: str = "medium"

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the AI Open Agents Tool Server"}

@app.get("/health")
async def health_check(operation_id="health_check"):
    # Check if Supabase and GitHub connections are working
    services = {}
    status = "healthy"
    
    try:
        supabase_client.health_check()
        services["supabase"] = "connected"
    except Exception as e:
        services["supabase"] = str(e)
        status = "unhealthy"
    
    try:
        github_client.health_check()
        services["github"] = "connected"
    except Exception as e:
        services["github"] = str(e)
        status = "unhealthy"
    
    return {"status": status, "services": services}

# Project endpoints
@app.get("/projects/{project_id}", response_model=Project, operation_id="get_project")
async def get_project(project_id: str):
    """
    Retrieve information about a specific project.
    """
    return supabase_client.get_project(project_id)

# Business plan endpoints
@app.get("/business_plans/{plan_id}", response_model=BusinessPlan, operation_id="get_business_plan")
async def get_business_plan(plan_id: str):
    """
    Retrieve a business plan by ID.
    """
    try:
        result = supabase_client.get_business_plan(plan_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Business plan not found: {str(e)}")

@app.patch("/business_plans/{plan_id}", response_model=BusinessPlan, operation_id="update_business_plan")
async def update_business_plan(plan_id: str, updates: BusinessPlanUpdate):
    """
    Update a business plan with new information.
    Only the provided fields will be updated.
    """
    try:
        result = supabase_client.update_business_plan(plan_id, updates.dict(exclude_unset=True))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update business plan: {str(e)}")

# GitHub endpoints
@app.get("/github/repo/{owner}/{repo}", operation_id="get_github_repository")
async def get_github_repository(owner: str, repo: str):
    """
    Get GitHub repository information and structure.
    """
    try:
        repo_info = github_client.get_repository(owner, repo)
        analysis = github_client.analyze_codebase(owner, repo)
        
        return {
            "repository": repo_info,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get repository: {str(e)}")

@app.get("/github/repo/{owner}/{repo}/files/{path:path}", operation_id="get_github_file")
async def get_github_file(owner: str, repo: str, path: str, ref: str = None):
    """
    Get file content from GitHub repository.
    """
    try:
        content = github_client.get_file_content(owner, repo, path, ref)
        return {"path": path, "content": content}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"File not found: {str(e)}")

@app.post("/github/repo/{owner}/{repo}/issues", operation_id="create_github_issue")
async def create_github_issue(owner: str, repo: str, issue: GitHubIssueCreate):
    """
    Create a new GitHub issue.
    """
    try:
        result = github_client.create_issue(
            owner, repo, issue.title, issue.body, issue.labels, issue.assignees
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create issue: {str(e)}")

@app.get("/github/repo/{owner}/{repo}/issues", operation_id="list_github_issues")
async def list_github_issues(
    owner: str, 
    repo: str, 
    state: str = "open", 
    labels: str = None, 
    assignee: str = None
):
    """
    List GitHub repository issues.
    """
    try:
        issues = github_client.list_issues(owner, repo, state, labels, assignee)
        return {"issues": issues}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list issues: {str(e)}")

@app.patch("/github/repo/{owner}/{repo}/issues/{issue_number}", operation_id="update_github_issue")
async def update_github_issue(
    owner: str, 
    repo: str, 
    issue_number: int, 
    updates: GitHubIssueUpdate
):
    """
    Update an existing GitHub issue.
    """
    try:
        result = github_client.update_issue(
            owner, repo, issue_number, 
            updates.title, updates.body, updates.state, 
            updates.labels, updates.assignees
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update issue: {str(e)}")

@app.post("/github/repo/{owner}/{repo}/workflow/{workflow_id}/dispatch", operation_id="trigger_github_workflow")
async def trigger_github_workflow(
    owner: str, 
    repo: str, 
    workflow_id: str, 
    ref: str = "main", 
    inputs: Dict[str, Any] = None
):
    """
    Trigger a GitHub Actions workflow.
    """
    try:
        github_client.trigger_workflow(owner, repo, workflow_id, ref, inputs)
        return {"message": "Workflow triggered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to trigger workflow: {str(e)}")

@app.post("/github/self-development/task", operation_id="create_self_development_task")
async def create_self_development_task(task: SelfDevelopmentTask):
    """
    Create a self-development task as a GitHub issue.
    This endpoint allows AI agents to create issues for self-improvement.
    """
    try:
        result = github_client.create_self_development_issue(
            task.owner, task.repo, task.task_type, 
            task.title, task.description, task.files, task.priority
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create self-development task: {str(e)}")

@app.get("/github/analyze/{owner}/{repo}", operation_id="analyze_github_codebase")
async def analyze_github_codebase(owner: str, repo: str):
    """
    Analyze GitHub repository codebase structure and provide insights.
    This is used by AI agents to understand the codebase before making changes.
    """
    try:
        analysis = github_client.analyze_codebase(owner, repo)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze codebase: {str(e)}")

# Add more endpoints as needed for NextCloud and WordPress integration

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
