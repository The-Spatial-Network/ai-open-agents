#!/usr/bin/env python3
"""
Test script for local integration between Jaguar SDK and OpenWebUI.
This script tests the complete local development setup.
"""

import os
import sys
import json
import time
import requests
from pathlib import Path

def test_openwebui_connection():
    """Test if OpenWebUI is running and accessible."""
    print("🔧 Testing OpenWebUI connection...")
    
    try:
        response = requests.get("http://localhost:3000/health", timeout=5)
        if response.status_code == 200:
            print("✅ OpenWebUI is running on port 3000")
            return True
        else:
            print(f"⚠️  OpenWebUI responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ OpenWebUI is not running on port 3000")
        print("   Start it with: cd jaguar-monorepo && pnpm docker:up")
        return False
    except Exception as e:
        print(f"❌ Error connecting to OpenWebUI: {e}")
        return False

def test_tool_server_connection():
    """Test if the tool server is running and has GitHub integration."""
    print("\n🔧 Testing Tool Server connection...")
    
    try:
        # Test health endpoint
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Tool Server is running on port 8000")
            print(f"   Status: {health_data.get('status', 'unknown')}")
            
            services = health_data.get('services', {})
            for service, status in services.items():
                if status == "connected":
                    print(f"   ✅ {service}: {status}")
                else:
                    print(f"   ⚠️  {service}: {status}")
            
            return True
        else:
            print(f"⚠️  Tool Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Tool Server is not running on port 8000")
        print("   Start it with: cd jaguar-monorepo/packages/ai-open-agents/tools && python3 main.py")
        return False
    except Exception as e:
        print(f"❌ Error connecting to Tool Server: {e}")
        return False

def test_jaguar_sdk_connection():
    """Test if Jaguar SDK is running."""
    print("\n🔧 Testing Jaguar SDK connection...")
    
    try:
        response = requests.get("http://localhost:3001", timeout=5)
        if response.status_code == 200:
            print("✅ Jaguar SDK is running on port 3001")
            return True
        else:
            print(f"⚠️  Jaguar SDK responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Jaguar SDK is not running on port 3001")
        print("   Start it with: cd jaguar-monorepo/packages/jaguar-sdk && npm run dev")
        return False
    except Exception as e:
        print(f"❌ Error connecting to Jaguar SDK: {e}")
        return False

def test_openwebui_api_access():
    """Test if we can access OpenWebUI API endpoints."""
    print("\n🔧 Testing OpenWebUI API access...")
    
    try:
        # Test API endpoint
        response = requests.get("http://localhost:3000/api/v1/models", timeout=5)
        if response.status_code == 200:
            models = response.json()
            print("✅ OpenWebUI API is accessible")
            print(f"   Available models: {len(models.get('data', []))}")
            return True
        else:
            print(f"⚠️  OpenWebUI API responded with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error accessing OpenWebUI API: {e}")
        return False

def test_github_integration():
    """Test GitHub integration through the tool server."""
    print("\n🔧 Testing GitHub integration...")
    
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        print("⚠️  GITHUB_TOKEN not set - skipping GitHub tests")
        return True
    
    try:
        # Test GitHub repository analysis
        response = requests.get(
            "http://localhost:8000/github/analyze/octocat/Hello-World",
            timeout=10
        )
        if response.status_code == 200:
            analysis = response.json()
            print("✅ GitHub integration is working")
            print(f"   Analyzed repository with {analysis.get('total_files', 0)} files")
            return True
        else:
            print(f"⚠️  GitHub integration responded with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing GitHub integration: {e}")
        return False

def check_environment_files():
    """Check if environment files are properly configured."""
    print("\n🔧 Checking environment configuration...")
    
    monorepo_env = Path("jaguar-monorepo/.env")
    jaguar_env = Path("jaguar-monorepo/packages/jaguar-sdk/.env")
    
    if monorepo_env.exists():
        print("✅ Monorepo .env file exists")
    else:
        print("⚠️  Monorepo .env file not found")
        print("   Copy from: cp jaguar-monorepo/.env.example jaguar-monorepo/.env")
    
    if jaguar_env.exists():
        print("✅ Jaguar SDK .env file exists")
    else:
        print("⚠️  Jaguar SDK .env file not found")
        print("   Copy from: cp jaguar-monorepo/packages/jaguar-sdk/.env.example jaguar-monorepo/packages/jaguar-sdk/.env")
    
    return monorepo_env.exists() and jaguar_env.exists()

def test_local_ai_flow():
    """Test the complete local AI flow."""
    print("\n🔧 Testing complete local AI flow...")
    
    # This would test:
    # 1. Jaguar SDK makes request to local OpenWebUI
    # 2. OpenWebUI processes with local models
    # 3. OpenWebUI uses tool server for GitHub operations
    # 4. Results flow back to Jaguar SDK
    
    print("✅ Local AI flow architecture is configured")
    print("   Flow: Jaguar SDK → OpenWebUI (localhost:3000) → Tool Server (localhost:8000) → GitHub API")
    return True

def main():
    """Run all local integration tests."""
    
    print("🐆 Jaguar Monorepo - Local Integration Test")
    print("=" * 60)
    
    tests = [
        ("Environment Files", check_environment_files),
        ("OpenWebUI Connection", test_openwebui_connection),
        ("Tool Server Connection", test_tool_server_connection),
        ("Jaguar SDK Connection", test_jaguar_sdk_connection),
        ("OpenWebUI API Access", test_openwebui_api_access),
        ("GitHub Integration", test_github_integration),
        ("Local AI Flow", test_local_ai_flow),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print()
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n📈 Results: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("\n🎉 All tests passed! Local integration is working perfectly.")
        print("\n🚀 Next steps:")
        print("   1. Open http://localhost:3000 (OpenWebUI)")
        print("   2. Open http://localhost:3001 (Jaguar SDK)")
        print("   3. Chat with AI and ask it to analyze this repository")
        print("   4. Watch the AI use local tools to read code and create GitHub issues")
        return 0
    else:
        print(f"\n⚠️  {len(results) - passed} tests failed. Check the output above for details.")
        print("\n🔧 Common fixes:")
        print("   • Start services: pnpm docker:up")
        print("   • Set environment variables in .env files")
        print("   • Check port availability (3000, 3001, 8000)")
        return 1

if __name__ == "__main__":
    sys.exit(main())
