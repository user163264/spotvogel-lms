#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== LMS System Health Check ====${NC}"

# Check for required commands
for cmd in lsof curl; do
    if ! command -v $cmd &> /dev/null; then
        echo -e "${RED}Error: '$cmd' command not found. Please install it.${NC}"
        exit 1
    fi
done

# Define ports
BACKEND_PORT=5000
FRONTEND_PORT=3000
MONGODB_PORT=27017

# Function to check if a port is in use
is_port_in_use() {
    local port=$1
    if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
        return 0 # Port is in use
    else
        return 1 # Port is not in use
    fi
}

# Check if services are running
check_service() {
    local port=$1
    local service_name=$2
    
    echo -e "${YELLOW}Checking if $service_name is running on port $port...${NC}"
    
    if is_port_in_use $port; then
        echo -e "${GREEN}✓ $service_name is running on port $port${NC}"
        return 0
    else
        echo -e "${RED}✗ $service_name is NOT running on port $port${NC}"
        return 1
    fi
}

# Test HTTP connection to a service
test_http_connection() {
    local url=$1
    local service_name=$2
    
    echo -e "${YELLOW}Testing HTTP connection to $service_name at $url...${NC}"
    
    if curl -s --head --connect-timeout 5 "$url" > /dev/null; then
        echo -e "${GREEN}✓ Successfully connected to $service_name at $url${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed to connect to $service_name at $url${NC}"
        return 1
    fi
}

# Check MongoDB connection using mongo client
check_mongodb_connection() {
    echo -e "${YELLOW}Testing MongoDB connection...${NC}"
    
    if command -v mongosh &> /dev/null; then
        # Try to connect using mongosh (MongoDB Shell)
        timeout_cmd=""
        if command -v timeout &> /dev/null; then
            timeout_cmd="timeout 5"
        fi
        if $timeout_cmd mongosh --eval "db.adminCommand('ping')" mongodb://localhost:$MONGODB_PORT/admin > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Successfully connected to MongoDB${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed to connect to MongoDB using mongosh${NC}"
            return 1
        fi
    elif command -v mongo &> /dev/null; then
        # Try to connect using legacy mongo shell
        timeout_cmd=""
        if command -v timeout &> /dev/null; then
            timeout_cmd="timeout 5"
        fi
        if $timeout_cmd mongo --eval "db.adminCommand('ping')" localhost:$MONGODB_PORT/admin > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Successfully connected to MongoDB${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed to connect to MongoDB using mongo shell${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}! MongoDB client not found. Cannot test direct MongoDB connection.${NC}"
        echo -e "${YELLOW}! Will rely on port check only.${NC}"
        if is_port_in_use $MONGODB_PORT; then
            echo -e "${GREEN}✓ MongoDB port $MONGODB_PORT is in use, assuming MongoDB is running${NC}"
            return 0
        else
            echo -e "${RED}✗ MongoDB port $MONGODB_PORT is not in use${NC}"
            return 1
        fi
    fi
}

# Check if backend API is responding
check_backend_api() {
    echo -e "${YELLOW}Testing Backend API response...${NC}"
    
    local api_url="http://localhost:$BACKEND_PORT/api/health"
    if curl -s --connect-timeout 5 "$api_url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend API is responding${NC}"
        return 0
    else
        echo -e "${RED}✗ Backend API is not responding at $api_url${NC}"
        echo -e "${YELLOW}! This might be OK if the health endpoint is not implemented${NC}"
        
        # Check if server is just running without health endpoint
        if is_port_in_use $BACKEND_PORT; then
            echo -e "${GREEN}✓ Backend server port $BACKEND_PORT is in use${NC}"
            return 0
        else
            return 1
        fi
    fi
}

echo -e "\n${YELLOW}=== Service Status Check ===${NC}"
backend_running=false
frontend_running=false
mongodb_running=false

# Check for running services
check_service $BACKEND_PORT "Backend server" && backend_running=true
check_service $FRONTEND_PORT "Frontend server" && frontend_running=true
check_service $MONGODB_PORT "MongoDB" && mongodb_running=true

echo -e "\n${YELLOW}=== Connection Tests ===${NC}"

# Only perform connection tests for running services
if $backend_running; then
    test_http_connection "http://localhost:$BACKEND_PORT" "Backend server"
    check_backend_api
fi

if $frontend_running; then
    test_http_connection "http://localhost:$FRONTEND_PORT" "Frontend server"
fi

if $mongodb_running; then
    check_mongodb_connection
fi

# Summary
echo -e "\n${YELLOW}=== System Health Summary ===${NC}"
if $backend_running && $frontend_running && $mongodb_running; then
    echo -e "${GREEN}All systems are running!${NC}"
    echo -e "${GREEN}✓ Frontend: http://localhost:$FRONTEND_PORT${NC}"
    echo -e "${GREEN}✓ Backend: http://localhost:$BACKEND_PORT${NC}"
    echo -e "${GREEN}✓ MongoDB: localhost:$MONGODB_PORT${NC}"
    exit 0
else
    echo -e "${RED}Some components are not running:${NC}"
    $frontend_running || echo -e "${RED}✗ Frontend server is not running${NC}"
    $backend_running || echo -e "${RED}✗ Backend server is not running${NC}"
    $mongodb_running || echo -e "${RED}✗ MongoDB is not running${NC}"
    
    echo -e "\n${YELLOW}Please run the start-lms.sh script to start all components${NC}"
    exit 1
fi