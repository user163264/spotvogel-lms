#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Starting AI Matching Test ====${NC}"

# Define paths
LMS_DIR="/Users/admin/Documents/lms-system"
FRONTEND_DIR="$LMS_DIR/frontend"
LOGS_DIR="$LMS_DIR/logs"

# Create logs directory if it doesn't exist
mkdir -p "$LOGS_DIR"

# Define frontend port
FRONTEND_PORT=3000

# Function to check if a port is in use
is_port_in_use() {
    if lsof -i :$1 -P -n | grep LISTEN > /dev/null; then
        return 0 # Port is in use
    else
        return 1 # Port is not in use
    fi
}

# Kill any process using the frontend port
kill_process_on_port() {
    local port=$1
    echo -e "${YELLOW}Checking for processes on port $port...${NC}"
    
    if is_port_in_use $port; then
        echo -e "${RED}Port $port is in use. Killing the process...${NC}"
        lsof -i :$port -P -n | grep LISTEN | awk '{print $2}' | xargs kill -9
        sleep 2
        
        if is_port_in_use $port; then
            echo -e "${RED}Failed to free port $port. Please check manually.${NC}"
            exit 1
        else
            echo -e "${GREEN}Successfully freed port $port${NC}"
        fi
    else
        echo -e "${GREEN}Port $port is free${NC}"
    fi
}

# Kill any existing process on the frontend port
kill_process_on_port $FRONTEND_PORT

# Navigate to the frontend directory
if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR"
    echo -e "${GREEN}Changed to directory: $(pwd)${NC}"
else
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
}

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: No package.json found in frontend directory${NC}"
    exit 1
fi

# Start the frontend application
echo -e "${YELLOW}Starting frontend application...${NC}"
REACT_APP_DEBUG_MODE=true npm start > "$LOGS_DIR/frontend-test.log" 2>&1 &
FRONTEND_PID=$!

# Wait for the frontend to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
sleep 10

# Check if frontend is running
if is_port_in_use $FRONTEND_PORT; then
    echo -e "${GREEN}Frontend application started successfully on port $FRONTEND_PORT${NC}"
    echo -e "${GREEN}=============================================${NC}"
    echo -e "${GREEN}Access the AI Matching Test at:${NC}"
    echo -e "${GREEN}http://localhost:$FRONTEND_PORT/test/ai-matching${NC}"
    echo -e "${GREEN}=============================================${NC}"
else
    echo -e "${RED}Failed to start frontend application. Check logs at $LOGS_DIR/frontend-test.log${NC}"
    # Show the last few lines of the log
    if [ -f "$LOGS_DIR/frontend-test.log" ]; then
        echo -e "${YELLOW}Last 20 lines of frontend log:${NC}"
        tail -n 20 "$LOGS_DIR/frontend-test.log"
    fi
    exit 1
fi

# Handle script termination
cleanup() {
    echo -e "${YELLOW}Shutting down frontend...${NC}"
    
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        sleep 2
        
        # Force kill if still running
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill -9 $FRONTEND_PID 2>/dev/null
        fi
    fi
    
    # Make sure the port is free
    kill_process_on_port $FRONTEND_PORT
    
    echo -e "${GREEN}Frontend shut down${NC}"
    echo -e "${YELLOW}Logs available at: $LOGS_DIR/frontend-test.log${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Keep script running
echo -e "${YELLOW}Press Ctrl+C to stop the frontend server${NC}"
wait $FRONTEND_PID
