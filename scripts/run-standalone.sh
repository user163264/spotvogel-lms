#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Running Standalone Server ====${NC}"

# Define the paths
SERVER_DIR="/Users/admin/Documents/lms-system/server"
STANDALONE_FILE="$SERVER_DIR/standalone-server.js"
LOGS_DIR="/Users/admin/Documents/lms-system/logs"
mkdir -p "$LOGS_DIR"

# Define the port
PORT=8080

# Kill any process using port 5000
echo -e "${YELLOW}Checking if port $PORT is in use...${NC}"
if lsof -i :$PORT | grep LISTEN > /dev/null; then
    echo -e "${RED}Port $PORT is in use. Killing processes...${NC}"
    lsof -i :$PORT | grep LISTEN | awk '{print $2}' | xargs -r kill -9
    sleep 2
    
    if lsof -i :$PORT | grep LISTEN > /dev/null; then
        echo -e "${RED}Failed to free port $PORT. Please check manually.${NC}"
        echo -e "${YELLOW}Run: sudo lsof -i :$PORT${NC}"
        exit 1
    else
        echo -e "${GREEN}Port $PORT is now free${NC}"
    fi
else
    echo -e "${GREEN}Port $PORT is free${NC}"
fi

# Run the standalone server
echo -e "${YELLOW}Starting standalone server...${NC}"
cd "$SERVER_DIR"
node standalone-server.js > "$LOGS_DIR/standalone.log" 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo -e "${GREEN}Standalone server started with PID $SERVER_PID${NC}"
    echo -e "${GREEN}Server running at: http://localhost:$PORT${NC}"
    echo -e "${YELLOW}Log file: $LOGS_DIR/standalone.log${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    
    # Test the server
    echo -e "\n${YELLOW}Testing server connection...${NC}"
    if curl -s http://localhost:$PORT/ > /dev/null; then
        echo -e "${GREEN}✓ Server is responding${NC}"
        
        # Show API response
        echo -e "${YELLOW}Server response:${NC}"
        curl -s http://localhost:$PORT/ | cat
    else
        echo -e "${RED}✗ Server is not responding${NC}"
    fi
    
    # Keep script running and handle Ctrl+C
    trap "kill $SERVER_PID; echo -e '${GREEN}Server stopped${NC}'; exit 0" INT
    wait $SERVER_PID
else
    echo -e "${RED}Failed to start standalone server${NC}"
    echo -e "${YELLOW}Check log file: $LOGS_DIR/standalone.log${NC}"
    cat "$LOGS_DIR/standalone.log"
    exit 1
fi
