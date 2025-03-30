#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== LMS System Installation and Startup Script ====${NC}"

# Define the main directory
LMS_DIR="/Users/admin/Documents/lms-system"
SERVER_DIR="$LMS_DIR/server"
FRONTEND_DIR="$LMS_DIR/frontend"

# Create logs directory
LOGS_DIR="/Users/admin/Documents/lms-system/logs"
mkdir -p "$LOGS_DIR"

# Install server dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
if [ -d "$SERVER_DIR" ]; then
    cd "$SERVER_DIR"
    if [ -f "package.json" ]; then
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install backend dependencies.${NC}"
            exit 1
        fi
        echo -e "${GREEN}Backend dependencies installed successfully.${NC}"
        cd "$LMS_DIR"
    else
        echo -e "${RED}Error: No package.json found in server directory${NC}"
        exit 1
    fi
else
    echo -e "${RED}Error: Server directory not found at $SERVER_DIR${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR"
    if [ -f "package.json" ]; then
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install frontend dependencies.${NC}"
            exit 1
        fi
        echo -e "${GREEN}Frontend dependencies installed successfully.${NC}"
        cd "$LMS_DIR"
    else
        echo -e "${RED}Error: No package.json found in frontend directory${NC}"
        exit 1
    fi
else
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Now that we've installed dependencies, run the regular start script
echo -e "${YELLOW}Starting the LMS system...${NC}"
"$LMS_DIR/scripts/start-lms.sh"
