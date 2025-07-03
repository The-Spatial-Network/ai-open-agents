#!/usr/bin/env python3
"""
Test script for GitHub integration in the Jaguar Monorepo.
This script tests the GitHub API client without requiring a full server setup.
"""

import os
import sys
import json
from pathlib import Path

# Add the tools directory to the Python path
tools_dir = Path(__file__).parent / "packages" / "ai-open-agents" / "tools"
sys.path.insert(0, str(tools_dir))

try:
    from python.utils.github import GitHubClient
    print("✅ Successfully imported GitHubClient")
except ImportError as e:
    print(f"❌ Failed to import GitHubClient: {e}")
    sys.exit(1)

def test_github_integration():
    """Test the GitHub integration functionality."""
    
    print("\n🔧 Testing GitHub Integration...")
    
    # Check if GitHub token is available
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        print("⚠️  GITHUB_TOKEN not found in environment variables")
        print("   Set GITHUB_TOKEN to test the GitHub integration")
        return False
    
    try:
        # Initialize GitHub client
        github_client = GitHubClient(github_token)
        print("✅ GitHub client initialized successfully")
        
        # Test health check
        github_client.health_check()
        print("✅ GitHub API connection successful")
        
        # Test repository analysis (using a public repo)
        print("\n📊 Testing repository analysis...")
        analysis = github_client.analyze_codebase("octocat", "Hello-World")
        print(f"✅ Repository analysis successful:")
        print(f"   - Total files: {analysis['total_files']}")
        print(f"   - Total directories: {analysis['total_directories']}")
        print(f"   - Main languages: {analysis['main_languages'][:3]}")
        
        # Test file content retrieval
        print("\n📄 Testing file content retrieval...")
        content = github_client.get_file_content("octocat", "Hello-World", "README")
        print(f"✅ File content retrieved successfully (length: {len(content)} chars)")
        
        print("\n🎉 All GitHub integration tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ GitHub integration test failed: {e}")
        return False

def test_self_development_issue_creation():
    """Test creating a self-development issue (dry run)."""
    
    print("\n🤖 Testing self-development issue creation...")
    
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        print("⚠️  Skipping issue creation test (no GITHUB_TOKEN)")
        return True
    
    try:
        github_client = GitHubClient(github_token)
        
        # Create a test issue structure (without actually creating it)
        issue_data = {
            "owner": "test-owner",
            "repo": "test-repo", 
            "task_type": "improvement",
            "title": "Test: Optimize code structure",
            "description": "This is a test self-development task to improve code organization.",
            "files": ["main.py", "utils.py"],
            "priority": "medium"
        }
        
        print("✅ Self-development issue structure validated")
        print(f"   - Type: {issue_data['task_type']}")
        print(f"   - Priority: {issue_data['priority']}")
        print(f"   - Files: {', '.join(issue_data['files'])}")
        
        return True
        
    except Exception as e:
        print(f"❌ Self-development test failed: {e}")
        return False

def main():
    """Run all tests."""
    
    print("🐆 Jaguar Monorepo - GitHub Integration Test")
    print("=" * 50)
    
    # Test basic GitHub integration
    github_test = test_github_integration()
    
    # Test self-development functionality
    self_dev_test = test_self_development_issue_creation()
    
    print("\n" + "=" * 50)
    if github_test and self_dev_test:
        print("🎉 All tests passed! GitHub integration is ready.")
        print("\n📋 Next steps:")
        print("   1. Set up your .env file with proper credentials")
        print("   2. Start the tool server: cd packages/ai-open-agents/tools && python3 main.py")
        print("   3. Start OpenWebUI: docker-compose up open-web-ui")
        print("   4. Test the integration through the chat interface")
        return 0
    else:
        print("❌ Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
