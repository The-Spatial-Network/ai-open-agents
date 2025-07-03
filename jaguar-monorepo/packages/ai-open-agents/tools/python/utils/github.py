import os
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

class GitHubClient:
    """
    A client for interacting with GitHub API.
    This utility handles GitHub operations for the AI Open Agents platform.
    """
    
    def __init__(self, token: str = None):
        """
        Initialize the GitHub client with API token.
        
        Args:
            token: GitHub Personal Access Token
        """
        self.token = token or os.getenv("GITHUB_TOKEN")
        
        if not self.token:
            raise ValueError("GitHub token must be provided")
        
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "AI-Open-Agents/1.0"
        }
    
    def _make_request(self, method: str, endpoint: str, data: Dict = None) -> Dict[str, Any]:
        """
        Make a request to the GitHub API.
        
        Args:
            method: HTTP method (GET, POST, PUT, PATCH, DELETE)
            endpoint: API endpoint
            data: Request data for POST/PUT/PATCH requests
        
        Returns:
            Dict: API response data
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=self.headers)
            elif method.upper() == "POST":
                response = requests.post(url, headers=self.headers, json=data)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=self.headers, json=data)
            elif method.upper() == "PATCH":
                response = requests.patch(url, headers=self.headers, json=data)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=self.headers)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json() if response.content else {}
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"GitHub API request failed: {str(e)}")
    
    def get_repository(self, owner: str, repo: str) -> Dict[str, Any]:
        """
        Get repository information.
        
        Args:
            owner: Repository owner
            repo: Repository name
        
        Returns:
            Dict: Repository information
        """
        return self._make_request("GET", f"repos/{owner}/{repo}")
    
    def get_repository_tree(self, owner: str, repo: str, sha: str = "HEAD") -> List[Dict[str, Any]]:
        """
        Get repository file tree structure.
        
        Args:
            owner: Repository owner
            repo: Repository name
            sha: Tree SHA or branch name
        
        Returns:
            List: Repository tree structure
        """
        response = self._make_request("GET", f"repos/{owner}/{repo}/git/trees/{sha}?recursive=1")
        return response.get("tree", [])
    
    def get_file_content(self, owner: str, repo: str, path: str, ref: str = None) -> str:
        """
        Get file content from repository.
        
        Args:
            owner: Repository owner
            repo: Repository name
            path: File path
            ref: Branch or commit reference
        
        Returns:
            str: File content
        """
        endpoint = f"repos/{owner}/{repo}/contents/{path}"
        if ref:
            endpoint += f"?ref={ref}"
        
        response = self._make_request("GET", endpoint)
        
        if response.get("type") == "file" and response.get("content"):
            import base64
            return base64.b64decode(response["content"]).decode("utf-8")
        
        raise Exception("File content not found or is a directory")
    
    def create_issue(
        self,
        owner: str,
        repo: str,
        title: str,
        body: str,
        labels: List[str] = None,
        assignees: List[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new issue in the repository.
        
        Args:
            owner: Repository owner
            repo: Repository name
            title: Issue title
            body: Issue description
            labels: List of labels to apply
            assignees: List of users to assign
        
        Returns:
            Dict: Created issue information
        """
        data = {
            "title": title,
            "body": body
        }
        
        if labels:
            data["labels"] = labels
        
        if assignees:
            data["assignees"] = assignees
        
        return self._make_request("POST", f"repos/{owner}/{repo}/issues", data)
    
    def list_issues(
        self,
        owner: str,
        repo: str,
        state: str = "open",
        labels: str = None,
        assignee: str = None
    ) -> List[Dict[str, Any]]:
        """
        List repository issues.
        
        Args:
            owner: Repository owner
            repo: Repository name
            state: Issue state (open, closed, all)
            labels: Comma-separated list of labels
            assignee: Username of assignee
        
        Returns:
            List: List of issues
        """
        endpoint = f"repos/{owner}/{repo}/issues?state={state}"
        
        if labels:
            endpoint += f"&labels={labels}"
        
        if assignee:
            endpoint += f"&assignee={assignee}"
        
        return self._make_request("GET", endpoint)
    
    def update_issue(
        self,
        owner: str,
        repo: str,
        issue_number: int,
        title: str = None,
        body: str = None,
        state: str = None,
        labels: List[str] = None,
        assignees: List[str] = None
    ) -> Dict[str, Any]:
        """
        Update an existing issue.
        
        Args:
            owner: Repository owner
            repo: Repository name
            issue_number: Issue number
            title: New title
            body: New body
            state: New state (open, closed)
            labels: New labels
            assignees: New assignees
        
        Returns:
            Dict: Updated issue information
        """
        data = {}
        
        if title is not None:
            data["title"] = title
        
        if body is not None:
            data["body"] = body
        
        if state is not None:
            data["state"] = state
        
        if labels is not None:
            data["labels"] = labels
        
        if assignees is not None:
            data["assignees"] = assignees
        
        return self._make_request("PATCH", f"repos/{owner}/{repo}/issues/{issue_number}", data)
    
    def trigger_workflow(
        self,
        owner: str,
        repo: str,
        workflow_id: str,
        ref: str = "main",
        inputs: Dict[str, Any] = None
    ) -> None:
        """
        Trigger a GitHub Actions workflow.
        
        Args:
            owner: Repository owner
            repo: Repository name
            workflow_id: Workflow ID or filename
            ref: Branch or tag reference
            inputs: Workflow inputs
        """
        data = {
            "ref": ref
        }
        
        if inputs:
            data["inputs"] = inputs
        
        self._make_request("POST", f"repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", data)
    
    def analyze_codebase(self, owner: str, repo: str) -> Dict[str, Any]:
        """
        Analyze repository codebase structure.
        
        Args:
            owner: Repository owner
            repo: Repository name
        
        Returns:
            Dict: Codebase analysis
        """
        tree = self.get_repository_tree(owner, repo)
        files = [item for item in tree if item.get("type") == "blob"]
        
        # Group files by extension
        files_by_extension = {}
        directories = set()
        
        for file in files:
            path = file.get("path", "")
            extension = path.split(".")[-1] if "." in path else "no-extension"
            files_by_extension[extension] = files_by_extension.get(extension, 0) + 1
            
            # Extract directory
            dir_path = "/".join(path.split("/")[:-1])
            if dir_path:
                directories.add(dir_path)
        
        # Get main languages
        main_languages = sorted(
            files_by_extension.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]
        
        return {
            "total_files": len(files),
            "total_directories": len(directories),
            "files_by_extension": files_by_extension,
            "main_languages": [{"extension": ext, "count": count} for ext, count in main_languages],
            "structure": sorted(list(directories))
        }
    
    def create_self_development_issue(
        self,
        owner: str,
        repo: str,
        task_type: str,
        title: str,
        description: str,
        files: List[str] = None,
        priority: str = "medium"
    ) -> Dict[str, Any]:
        """
        Create a self-development issue with structured format.
        
        Args:
            owner: Repository owner
            repo: Repository name
            task_type: Type of task (bug_fix, feature, improvement, documentation, test)
            title: Issue title
            description: Detailed description
            files: List of files involved
            priority: Task priority (low, medium, high, critical)
        
        Returns:
            Dict: Created issue information
        """
        # Create structured issue body
        body = f"""## 🤖 Self-Development Task

**Type:** {task_type}
**Priority:** {priority}

### Description
{description}

### Files Involved
"""
        
        if files:
            for file in files:
                body += f"- `{file}`\n"
        else:
            body += "- No specific files identified\n"
        
        body += f"""
### AI Agent Instructions
This issue was created by the AI development team for self-improvement purposes.

**Acceptance Criteria:**
- [ ] Task completed successfully
- [ ] Code quality maintained or improved
- [ ] Tests updated if necessary
- [ ] Documentation updated if necessary

**Created:** {datetime.now().isoformat()}
**Agent:** Self-Development System
"""
        
        # Create labels based on task type and priority
        labels = [f"ai-generated", f"type:{task_type}", f"priority:{priority}"]
        
        return self.create_issue(owner, repo, title, body, labels)
    
    def health_check(self) -> bool:
        """
        Check if the GitHub API connection is working.
        
        Returns:
            bool: True if connection is successful
        """
        try:
            self._make_request("GET", "user")
            return True
        except Exception as e:
            raise Exception(f"GitHub API connection failed: {str(e)}")
