import os
from typing import List, Optional, Dict, Any
from github import Github, GithubException
from github.Repository import Repository
from github.Issue import Issue


class GitHubClient:
    """
    GitHub API client for creating and managing issues.
    """
    
    def __init__(self, token: str):
        """
        Initialize GitHub client with authentication token.
        
        Args:
            token: GitHub personal access token
        """
        if not token:
            raise ValueError("GitHub token is required")
        
        self.github = Github(token)
        self.user = None
        
        # Verify token is valid
        try:
            self.user = self.github.get_user()
        except GithubException as e:
            raise ValueError(f"Invalid GitHub token: {e}")
    
    def get_repository(self, owner: str, repo: str) -> Repository:
        """
        Get a repository object.
        
        Args:
            owner: Repository owner username
            repo: Repository name
            
        Returns:
            Repository object
            
        Raises:
            ValueError: If repository not found or access denied
        """
        try:
            return self.github.get_repo(f"{owner}/{repo}")
        except GithubException as e:
            if e.status == 404:
                raise ValueError(f"Repository {owner}/{repo} not found or access denied")
            else:
                raise ValueError(f"Error accessing repository: {e}")
    
    def create_issue(
        self,
        owner: str,
        repo: str,
        title: str,
        body: Optional[str] = None,
        labels: Optional[List[str]] = None,
        assignees: Optional[List[str]] = None,
        milestone: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Create a new issue in the specified repository.
        
        Args:
            owner: Repository owner username
            repo: Repository name
            title: Issue title
            body: Issue description/body
            labels: List of label names to apply
            assignees: List of usernames to assign
            milestone: Milestone number
            
        Returns:
            Dictionary containing issue information
            
        Raises:
            ValueError: If issue creation fails
        """
        try:
            repository = self.get_repository(owner, repo)
            
            # Prepare kwargs for issue creation
            issue_kwargs = {
                "title": title,
                "body": body or "",
            }
            
            # Add labels if provided
            if labels:
                # Validate labels exist in the repository
                repo_labels = [label.name for label in repository.get_labels()]
                invalid_labels = [label for label in labels if label not in repo_labels]
                if invalid_labels:
                    raise ValueError(f"Invalid labels: {invalid_labels}. Available labels: {repo_labels}")
                issue_kwargs["labels"] = labels
            
            # Add assignees if provided
            if assignees:
                issue_kwargs["assignees"] = assignees
            
            # Add milestone if provided
            if milestone:
                try:
                    milestone_obj = repository.get_milestone(milestone)
                    issue_kwargs["milestone"] = milestone_obj
                except GithubException:
                    raise ValueError(f"Milestone {milestone} not found in repository")
            
            # Create the issue
            issue: Issue = repository.create_issue(**issue_kwargs)
            
            return {
                "id": issue.id,
                "number": issue.number,
                "title": issue.title,
                "body": issue.body,
                "state": issue.state,
                "url": issue.html_url,
                "api_url": issue.url,
                "labels": [label.name for label in issue.labels],
                "assignees": [assignee.login for assignee in issue.assignees],
                "milestone": issue.milestone.title if issue.milestone else None,
                "created_at": issue.created_at.isoformat(),
                "updated_at": issue.updated_at.isoformat(),
                "author": issue.user.login,
                "repository": {
                    "owner": owner,
                    "name": repo,
                    "full_name": f"{owner}/{repo}"
                }
            }
            
        except GithubException as e:
            if e.status == 403:
                raise ValueError("Insufficient permissions to create issue in this repository")
            elif e.status == 422:
                raise ValueError(f"Invalid issue data: {e}")
            else:
                raise ValueError(f"GitHub API error: {e}")
        except Exception as e:
            raise ValueError(f"Unexpected error creating issue: {e}")
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check if GitHub API connection is working.
        
        Returns:
            Dictionary with connection status
        """
        try:
            user = self.github.get_user()
            rate_limit = self.github.get_rate_limit()
            
            return {
                "status": "connected",
                "user": user.login,
                "rate_limit": {
                    "remaining": rate_limit.core.remaining,
                    "limit": rate_limit.core.limit,
                    "reset": rate_limit.core.reset.isoformat()
                }
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
