#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Service Status Check ====${NC}"

# Define ports to check
MONGODB_PORT=27017
BACKEND_PORT=8080
FRONTEND_PORT=3000

# Function to check if a port is in use
check_port() {
    local port=$1
    local service=$2
    
    echo -e "${YELLOW}Checking $service on port $port...${NC}"
    
    if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
        local pid=$(lsof -i :$port -P -n | grep LISTEN | awk '{print $2}' | head -1)
        local process=$(ps -p $pid -o comm= 2>/dev/null)
        
        echo -e "${GREEN}✓ $service is running on port $port${NC}"
        echo -e "  Process: $process (PID: $pid)"
    else
        echo -e "${RED}✗ $service is NOT running on port $port${NC}"
    fi
}

# Check MongoDB
check_port $MONGODB_PORT "MongoDB"

# Check Backend Server
check_port $BACKEND_PORT "Backend Server"

# Check Frontend Server
check_port $FRONTEND_PORT "Frontend Server"

# Attempt to make a simple HTTP request to backend
echo -e "\n${YELLOW}Testing backend API connection...${NC}"
if curl -s http://localhost:$BACKEND_PORT/ > /dev/null; then
    echo -e "${GREEN}✓ Backend API is responding${NC}"
    
    # Get the response for more info
    echo -e "${YELLOW}API Response:${NC}"
    curl -s http://localhost:$BACKEND_PORT/ | json_pp
else
    echo -e "${RED}✗ Backend API is not responding${NC}"
fi

echo -e "\n${YELLOW}==== Check Complete ====${NC}"
