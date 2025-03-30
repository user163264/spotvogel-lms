#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
check_nodejs() {
    echo -e "${YELLOW}Checking Node.js installation...${NC}"
    if command -v node &> /dev/null; then
        node_version=$(node -v)
        echo -e "${GREEN}Node.js is installed (Version: $node_version)${NC}"
        
        # Check if Node.js version is 14 or higher
        # Extract version number and major version
        version_number=${node_version:1}  # Remove the 'v' prefix
        major_version=$(echo $version_number | cut -d. -f1)
        
        if [[ $major_version -lt 14 ]]; then
            echo -e "${RED}Warning: Node.js version $node_version may be too old. Recommended: v14.x or higher.${NC}"
            return 1
        fi
        return 0
    else
        echo -e "${RED}Node.js is not installed. Please install Node.js version 14.x or higher.${NC}"
        return 1
    fi
}

# Check npm
check_npm() {
    echo -e "${YELLOW}Checking npm installation...${NC}"
    if command -v npm &> /dev/null; then
        npm_version=$(npm -v)
        echo -e "${GREEN}npm is installed (Version: $npm_version)${NC}"
        return 0
    else
        echo -e "${RED}npm is not installed. Please install npm.${NC}"
        return 1
    fi
}

# Check MongoDB
check_mongodb_installation() {
    echo -e "${YELLOW}Checking MongoDB installation...${NC}"
    
    if command -v mongod &> /dev/null; then
        mongod_version=$(mongod --version | grep "db version" | awk '{print $3}')
        echo -e "${GREEN}MongoDB is installed (Version: $mongod_version)${NC}"
        return 0
    elif command -v brew &> /dev/null && brew list | grep -q mongodb; then
        echo -e "${GREEN}MongoDB is installed via Homebrew${NC}"
        return 0
    elif [ -f "/usr/local/bin/mongod" ]; then
        echo -e "${GREEN}MongoDB is installed at /usr/local/bin/mongod${NC}"
        return 0
    elif command -v systemctl &> /dev/null && systemctl list-unit-files | grep -q mongodb; then
        echo -e "${GREEN}MongoDB is installed as a system service${NC}"
        return 0
    else
        echo -e "${RED}MongoDB does not appear to be installed. You need to install MongoDB to run this application.${NC}"
        echo -e "${YELLOW}Visit https://www.mongodb.com/try/download/community for installation instructions.${NC}"
        return 1
    fi
}

# Check port availability and kill process if needed
check_port_availability() {
    local port=$1
    echo -e "${YELLOW}Checking if port $port is available...${NC}"
    
    if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
        echo -e "${RED}Port $port is currently in use.${NC}"
        
        # Get the PID of the process using this port
        local pids=$(lsof -i :$port -P -n | grep LISTEN | awk '{print $2}')
        
        if [ -n "$pids" ]; then
            echo -e "${YELLOW}Found process(es) using port $port with PID(s): $pids${NC}"
            echo -e "${YELLOW}Attempting to kill the process(es)...${NC}"
            
            for pid in $pids; do
                # Try gentle kill first
                kill $pid 2>/dev/null
                sleep 1
                
                # Check if still running
                if ps -p $pid > /dev/null 2>&1; then
                    echo -e "${YELLOW}Process still running, using force kill...${NC}"
                    kill -9 $pid 2>/dev/null
                    sleep 1
                fi
                
                # Final check
                if ! ps -p $pid > /dev/null 2>&1; then
                    echo -e "${GREEN}Successfully killed process $pid${NC}"
                else
                    echo -e "${RED}Failed to kill process $pid. Please kill it manually.${NC}"
                    return 1
                fi
            done
            
            # After killing, check if port is free
            if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
                echo -e "${RED}Port $port is still in use after kill attempts.${NC}"
                return 1
            else
                echo -e "${GREEN}Port $port is now available${NC}"
                return 0
            fi
        fi
    else
        echo -e "${GREEN}Port $port is available${NC}"
        return 0
    fi
}

# Check required directories
check_directories() {
    local base_dir="/Users/admin/Documents/lms-system"
    echo -e "${YELLOW}Checking required directories...${NC}"
    
    if [ ! -d "$base_dir" ]; then
        echo -e "${RED}Base directory not found: $base_dir${NC}"
        return 1
    fi
    
    if [ ! -d "$base_dir/server" ]; then
        echo -e "${RED}Server directory not found: $base_dir/server${NC}"
        return 1
    fi
    
    if [ ! -d "$base_dir/frontend" ]; then
        echo -e "${RED}Frontend directory not found: $base_dir/frontend${NC}"
        return 1
    fi
    
    echo -e "${GREEN}All required directories exist${NC}"
    return 0
}

# Check package.json files
check_package_json_files() {
    local base_dir="/Users/admin/Documents/lms-system"
    echo -e "${YELLOW}Checking package.json files...${NC}"
    
    if [ ! -f "$base_dir/server/package.json" ]; then
        echo -e "${RED}Server package.json not found: $base_dir/server/package.json${NC}"
        return 1
    fi
    
    if [ ! -f "$base_dir/frontend/package.json" ]; then
        echo -e "${RED}Frontend package.json not found: $base_dir/frontend/package.json${NC}"
        return 1
    fi
    
    echo -e "${GREEN}All required package.json files exist${NC}"
    return 0
}

# Check if .env files exist
check_env_files() {
    local base_dir="/Users/admin/Documents/lms-system"
    echo -e "${YELLOW}Checking .env files...${NC}"
    
    if [ ! -f "$base_dir/server/.env" ]; then
        echo -e "${RED}Server .env file not found: $base_dir/server/.env${NC}"
        return 1
    fi
    
    # Check for OpenAI API key in server .env
    if grep -q "OPENAI_API_KEY=" "$base_dir/server/.env"; then
        api_key=$(grep "OPENAI_API_KEY=" "$base_dir/server/.env" | cut -d '=' -f2)
        if [[ "$api_key" == "your-valid-api-key-here" || "$api_key" == "sk_test_lms_local_api_testing_key" || "$api_key" == "" ]]; then
            echo -e "${RED}Invalid OpenAI API key found in server .env file${NC}"
            return 1
        else
            echo -e "${GREEN}OpenAI API key appears to be set in server .env file${NC}"
        fi
    else
        echo -e "${RED}OPENAI_API_KEY not found in server .env file${NC}"
        return 1
    fi
    
    echo -e "${GREEN}All required .env files exist${NC}"
    return 0
}

# Main function to run all checks
run_all_checks() {
    echo -e "${YELLOW}=======================================${NC}"
    echo -e "${YELLOW}Running environment checks for LMS System${NC}"
    echo -e "${YELLOW}=======================================${NC}"
    
    local errors=0
    
    check_nodejs || ((errors++))
    check_npm || ((errors++))
    check_mongodb_installation || ((errors++))
    check_port_availability 8080 || ((errors++))
    check_port_availability 3000 || ((errors++))
    check_directories || ((errors++))
    check_package_json_files || ((errors++))
    check_env_files || ((errors++))
    
    echo -e "${YELLOW}=======================================${NC}"
    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}All checks passed! The environment is ready for the LMS System.${NC}"
        return 0
    else
        echo -e "${RED}$errors check(s) failed. Please fix the issues before running the application.${NC}"
        return 1
    fi
}

# Run the checks
run_all_checks
