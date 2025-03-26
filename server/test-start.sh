#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== LMS System Test Script ====${NC}"

# Define default ports
BACKEND_PORT=5000

# More thorough port checking and process killing
echo -e "${YELLOW}Ensuring port $BACKEND_PORT is completely free...${NC}"
lsof -i :$BACKEND_PORT | grep LISTEN | awk '{print $2}' | xargs -r kill -9

# Wait a moment to ensure port is freed
sleep 2

# Check if the port is free
if lsof -i :$BACKEND_PORT -P -n | grep LISTEN > /dev/null; then
    echo -e "${RED}Port $BACKEND_PORT is still in use. Please check manually with 'lsof -i :$BACKEND_PORT'${NC}"
    exit 1
else
    echo -e "${GREEN}Port $BACKEND_PORT is free${NC}"
fi

# Navigate to server directory
cd /Users/admin/Documents/lms-system/server

# Start our simplified test server
echo -e "${YELLOW}Starting simplified test server...${NC}"
node simplified-main.js
