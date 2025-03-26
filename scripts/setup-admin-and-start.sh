#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== LMS System Admin Setup and Startup ====${NC}"

# Define paths
LMS_DIR="/Users/admin/Documents/lms-system"
SERVER_DIR="$LMS_DIR/server"
SCRIPTS_DIR="$LMS_DIR/scripts"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Navigate to server directory
cd "$SERVER_DIR" || {
    echo -e "${RED}Error: Could not change to server directory ${SERVER_DIR}${NC}"
    exit 1
}

# Run the admin setup script
echo -e "${YELLOW}Setting up admin account...${NC}"
node create-admin-simple.js

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create admin account${NC}"
    exit 1
fi

# Start the system
echo -e "${YELLOW}Starting LMS system...${NC}"
bash "$SCRIPTS_DIR/start-lms.sh"
