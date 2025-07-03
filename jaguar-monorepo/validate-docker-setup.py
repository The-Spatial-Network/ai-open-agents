#!/usr/bin/env python3
"""
Jaguar Monorepo Docker Setup Validator

This script validates the Docker configuration without requiring Docker to be running.
It checks Dockerfiles, docker-compose files, and environment configurations.
"""

import os
import sys
import yaml
import json
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and return status"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} (NOT FOUND)")
        return False

def validate_dockerfile(dockerfile_path, service_name):
    """Validate Dockerfile content"""
    print(f"\n🔍 Validating {service_name} Dockerfile...")
    
    if not check_file_exists(dockerfile_path, f"{service_name} Dockerfile"):
        return False
    
    with open(dockerfile_path, 'r') as f:
        content = f.read()
    
    # Check for essential Dockerfile components
    checks = [
        ("FROM", "Base image specified"),
        ("WORKDIR", "Working directory set"),
        ("COPY", "Files copied to container"),
        ("EXPOSE", "Port exposed"),
        ("CMD", "Start command specified")
    ]
    
    for keyword, description in checks:
        if keyword in content:
            print(f"  ✅ {description}")
        else:
            print(f"  ⚠️  {description} (missing {keyword})")
    
    return True

def validate_docker_compose():
    """Validate docker-compose.yml configuration"""
    print(f"\n🔍 Validating Docker Compose configuration...")
    
    compose_file = "jaguar-monorepo/docker-compose.yml"
    if not check_file_exists(compose_file, "Docker Compose file"):
        return False
    
    try:
        with open(compose_file, 'r') as f:
            compose_config = yaml.safe_load(f)
        
        services = compose_config.get('services', {})
        expected_services = ['jaguar-sdk', 'open-web-ui', 'tool-server', 'redis']
        
        print(f"  📋 Found {len(services)} services:")
        for service_name in services:
            print(f"    ✅ {service_name}")
        
        # Check for expected services
        missing_services = [s for s in expected_services if s not in services]
        if missing_services:
            print(f"  ⚠️  Missing services: {missing_services}")
        
        # Check port mappings
        print(f"  🔌 Port mappings:")
        for service_name, config in services.items():
            ports = config.get('ports', [])
            if ports:
                for port in ports:
                    print(f"    ✅ {service_name}: {port}")
            else:
                print(f"    ⚠️  {service_name}: No ports exposed")
        
        # Check networks
        if 'networks' in compose_config:
            print(f"  🌐 Networks configured: ✅")
        else:
            print(f"  🌐 Networks configured: ⚠️  No custom networks")
        
        return True
        
    except yaml.YAMLError as e:
        print(f"  ❌ Invalid YAML: {e}")
        return False

def validate_environment():
    """Validate environment configuration"""
    print(f"\n🔍 Validating Environment configuration...")
    
    env_file = "jaguar-monorepo/.env"
    if not check_file_exists(env_file, "Environment file"):
        return False
    
    # Read environment variables
    env_vars = {}
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
    
    # Check essential environment variables
    essential_vars = [
        'OPEN_ROUTER_API_KEY',
        'TOOL_SERVER_API_KEY',
        'JAGUAR_BASE_URL',
        'NEXTAUTH_URL',
        'AUTH_SECRET'
    ]
    
    print(f"  📋 Environment variables:")
    for var in essential_vars:
        if var in env_vars:
            value = env_vars[var]
            if value and not value.startswith('your-'):
                print(f"    ✅ {var}: configured")
            else:
                print(f"    ⚠️  {var}: needs configuration")
        else:
            print(f"    ❌ {var}: missing")
    
    # Check port configuration
    jaguar_url = env_vars.get('JAGUAR_BASE_URL', '')
    nextauth_url = env_vars.get('NEXTAUTH_URL', '')
    
    if 'localhost:3002' in jaguar_url:
        print(f"    ✅ JAGUAR_BASE_URL points to OpenWebUI (3002)")
    else:
        print(f"    ⚠️  JAGUAR_BASE_URL should point to localhost:3002")
    
    if 'localhost:3000' in nextauth_url:
        print(f"    ✅ NEXTAUTH_URL points to Jaguar SDK (3000)")
    else:
        print(f"    ⚠️  NEXTAUTH_URL should point to localhost:3000")
    
    return True

def validate_project_structure():
    """Validate project structure"""
    print(f"\n🔍 Validating Project structure...")
    
    required_files = [
        ("jaguar-monorepo/packages/jaguar-sdk/package.json", "Jaguar SDK package.json"),
        ("jaguar-monorepo/packages/jaguar-sdk/next.config.ts", "Next.js config"),
        ("jaguar-monorepo/packages/ai-open-agents/tools/main.py", "Tool server main"),
        ("jaguar-monorepo/packages/ai-open-agents/tools/requirements.txt", "Tool server requirements"),
        ("jaguar-monorepo/pnpm-workspace.yaml", "PNPM workspace config"),
        ("jaguar-monorepo/.github/workflows/deploy.yml", "GitHub Actions workflow")
    ]
    
    all_exist = True
    for filepath, description in required_files:
        if not check_file_exists(filepath, description):
            all_exist = False
    
    return all_exist

def check_docker_availability():
    """Check if Docker is available"""
    print(f"\n🐳 Checking Docker availability...")
    
    try:
        import subprocess
        result = subprocess.run(['docker', '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print(f"  ✅ Docker installed: {result.stdout.strip()}")
            
            # Check if Docker daemon is running
            result = subprocess.run(['docker', 'ps'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                print(f"  ✅ Docker daemon running")
                return True
            else:
                print(f"  ⚠️  Docker daemon not running")
                print(f"      Start Docker Desktop to test deployment")
                return False
        else:
            print(f"  ❌ Docker not found")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print(f"  ❌ Docker not available")
        return False

def main():
    """Main validation function"""
    print("🐆 Jaguar Monorepo Docker Setup Validator")
    print("=" * 50)
    
    # Change to the correct directory
    if os.path.exists('jaguar-monorepo'):
        os.chdir('.')
    elif os.path.basename(os.getcwd()) != 'ai-open-agents':
        print("❌ Please run this script from the ai-open-agents directory")
        sys.exit(1)
    
    # Run all validations
    validations = [
        validate_project_structure,
        validate_docker_compose,
        validate_environment,
        lambda: validate_dockerfile("jaguar-monorepo/packages/jaguar-sdk/Dockerfile", "Jaguar SDK"),
        lambda: validate_dockerfile("jaguar-monorepo/packages/ai-open-agents/tools/Dockerfile", "Tool Server"),
        check_docker_availability
    ]
    
    results = []
    for validation in validations:
        try:
            result = validation()
            results.append(result)
        except Exception as e:
            print(f"❌ Validation error: {e}")
            results.append(False)
    
    # Summary
    print(f"\n📊 Validation Summary")
    print("=" * 30)
    
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print(f"🎉 All validations passed! ({passed}/{total})")
        print(f"\n✅ Ready for Docker deployment!")
        print(f"   Run: cd jaguar-monorepo && docker-compose up --build")
    else:
        print(f"⚠️  {passed}/{total} validations passed")
        print(f"\n🔧 Fix the issues above before deploying")
    
    # Next steps
    print(f"\n📝 Next Steps:")
    if check_docker_availability():
        print(f"1. cd jaguar-monorepo")
        print(f"2. docker-compose build --no-cache")
        print(f"3. docker-compose up -d")
        print(f"4. Test endpoints:")
        print(f"   - http://localhost:3000 (Jaguar SDK)")
        print(f"   - http://localhost:3002 (OpenWebUI)")
        print(f"   - http://localhost:8000/docs (Tool Server)")
    else:
        print(f"1. Start Docker Desktop")
        print(f"2. Run this script again to verify Docker")
        print(f"3. Follow the Docker testing guide")

if __name__ == "__main__":
    main()
