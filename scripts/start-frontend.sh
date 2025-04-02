#!/bin/bash

# Exit on any error
set -e

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Frontend Startup Script ====${NC}"

# Define the main directory
LMS_DIR="/Users/admin/Documents/lms-system"
FRONTEND_DIR="$LMS_DIR/frontend"
LOGS_DIR="$LMS_DIR/logs"
mkdir -p "$LOGS_DIR"

# Allow configurable frontend port with default fallback
if [ -n "$1" ]; then
    FRONTEND_PORT=$1
    echo -e "${YELLOW}Using specified frontend port: $FRONTEND_PORT${NC}"
else
    FRONTEND_PORT=3001
    echo -e "${YELLOW}Using default frontend port: $FRONTEND_PORT (to avoid conflicts)${NC}"
fi

# Function to check if a port is in use
is_port_in_use() {
    local port=$1
    if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
        return 0 # Port is in use
    else
        return 1 # Port is not in use
    fi
}

# Function to kill processes using a specific port
kill_process_on_port() {
    local port=$1
    echo -e "${YELLOW}Checking for processes on port $port...${NC}"
    
    if is_port_in_use $port; then
        echo -e "${RED}Port $port is in use. Attempting to kill the process...${NC}"
        local pids=$(lsof -i :$port -P -n | grep LISTEN | awk '{print $2}')
        if [ -n "$pids" ]; then
            for pid in $pids; do
                echo -e "${YELLOW}Killing process $pid on port $port${NC}"
                kill $pid 2>/dev/null
                sleep 1
                
                # If still running, force kill
                if ps -p $pid > /dev/null 2>&1; then
                    echo -e "${YELLOW}Process still running, using force kill...${NC}"
                    kill -9 $pid 2>/dev/null
                    sleep 1
                fi
            done
            
            if ! is_port_in_use $port; then
                echo -e "${GREEN}Successfully killed processes on port $port${NC}"
            else
                echo -e "${RED}Warning: Port $port may still be in use.${NC}"
                return 1
            fi
        fi
    else
        echo -e "${GREEN}Port $port is free${NC}"
    fi
    return 0
}

# Kill any processes on the requested port
if ! kill_process_on_port $FRONTEND_PORT; then
    echo -e "${YELLOW}Finding another available port...${NC}"
    ORIGINAL_PORT=$FRONTEND_PORT
    
    # Try to find an available port starting from FRONTEND_PORT + 1
    for ((port=FRONTEND_PORT+1; port<FRONTEND_PORT+20; port++)); do
        if ! is_port_in_use $port; then
            FRONTEND_PORT=$port
            echo -e "${GREEN}Found available port: $FRONTEND_PORT${NC}"
            break
        fi
    done
    
    if [ $FRONTEND_PORT -eq $ORIGINAL_PORT ]; then
        echo -e "${RED}Could not find an available port. Please free up some ports manually.${NC}"
        exit 1
    fi
fi

# Verify frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm command not found. Please install Node.js and npm.${NC}"
    exit 1
fi

# Start frontend server with specified port
echo -e "${YELLOW}Starting frontend server on port $FRONTEND_PORT...${NC}"
cd "$FRONTEND_DIR"
if [ -f "package.json" ]; then
    # Set PORT environment variable for React to use our specific port
    echo -e "${GREEN}Starting frontend with command: PORT=$FRONTEND_PORT npm start${NC}"
    PORT=$FRONTEND_PORT npm start > "$LOGS_DIR/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}Frontend process started with PID: $FRONTEND_PID${NC}"
else
    echo -e "${RED}Error: No package.json found in frontend directory${NC}"
    exit 1
fi

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to start on port $FRONTEND_PORT...${NC}"
FRONTEND_START_WAIT=45 # seconds to wait (React can take longer)
FRONTEND_STARTED=false
for i in $(seq 1 $FRONTEND_START_WAIT); do
    if is_port_in_use $FRONTEND_PORT; then
        echo -e "${GREEN}Frontend server started successfully on port $FRONTEND_PORT${NC}"
        FRONTEND_STARTED=true
        break
    fi
    sleep 1
    echo -e "${YELLOW}Still waiting for frontend... ($i/$FRONTEND_START_WAIT)${NC}"
    
    # Check if process is still running
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo -e "${RED}Frontend process terminated unexpectedly. Check logs for errors.${NC}"
        echo -e "${YELLOW}Last 20 lines of frontend.log:${NC}"
        tail -n 20 "$LOGS_DIR/frontend.log"
        exit 1
    fi
done

# If frontend didn't start in the expected time
if [ "$FRONTEND_STARTED" != "true" ]; then
    echo -e "${RED}Failed to start frontend server within $FRONTEND_START_WAIT seconds.${NC}"
    echo -e "${YELLOW}Last 20 lines of frontend.log:${NC}"
    tail -n 20 "$LOGS_DIR/frontend.log"
    exit 1
fi

# Save PID to file for easy cleanup
echo "FRONTEND_PID=$FRONTEND_PID" > "$LMS_DIR/.pid.frontend"
echo "FRONTEND_PORT=$FRONTEND_PORT" > "$LMS_DIR/.env.frontend"

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}Frontend started successfully!${NC}"
echo -e "${GREEN}Frontend running on: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}=============================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the service${NC}"

# Handle script termination
cleanup() {
    echo -e "${YELLOW}\nShutting down frontend server...${NC}"
    
    if [ -n "$FRONTEND_PID" ]; then
        echo -e "${YELLOW}Shutting down frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null
        
        # Wait up to 5 seconds for frontend to terminate gracefully
        for i in {1..5}; do
            if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
                echo -e "${GREEN}Frontend terminated gracefully${NC}"
                break
            fi
            sleep 1
        done
        
        # Force kill if still running
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo -e "${YELLOW}Frontend still running, using force kill...${NC}"
            kill -9 $FRONTEND_PID 2>/dev/null
        fi
    fi
    
    # Force kill any remaining processes by port
    kill_process_on_port $FRONTEND_PORT
    
    # Clean up PID files
    rm -f "$LMS_DIR/.pid.frontend" "$LMS_DIR/.env.frontend"
    
    echo -e "${GREEN}Frontend server shut down${NC}"
    echo -e "${YELLOW}Logs available at: $LOGS_DIR/frontend.log${NC}"
    
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Keep script running
wait $FRONTEND_PID
