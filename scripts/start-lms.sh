#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== LMS System Startup Script ====${NC}"

# Define the main directory
LMS_DIR="/Users/admin/Documents/lms-system"
SERVER_DIR="$LMS_DIR/server"
CLIENT_DIR="$LMS_DIR/client"

# Create logs directory
LOGS_DIR="/Users/admin/Documents/lms-system/logs"
mkdir -p "$LOGS_DIR"

# Define default ports
BACKEND_PORT=8080
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
                # Try a gentle kill first
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
                # Don't exit - just warn
            fi
        fi
    else
        echo -e "${GREEN}Port $port is free${NC}"
    fi
}

# Check if MongoDB is running
check_mongodb() {
    echo -e "${YELLOW}Checking if MongoDB is running...${NC}"
    
    if is_port_in_use $MONGODB_PORT; then
        echo -e "${GREEN}MongoDB is running on port $MONGODB_PORT${NC}"
    else
        echo -e "${RED}MongoDB is not running on port $MONGODB_PORT. Starting MongoDB...${NC}"
        
        # Different ways to start MongoDB based on OS/installation
        if command -v mongod &> /dev/null; then
            mongod --fork --logpath "$LOGS_DIR/mongodb.log"
        elif [ -d "/usr/local/opt/mongodb-community" ]; then
            # macOS with Homebrew
            brew services start mongodb-community
        elif [ -f "/etc/init.d/mongodb" ]; then
            # Some Linux distros
            sudo service mongodb start
        else
            echo -e "${RED}Could not start MongoDB. Please start it manually and run this script again.${NC}"
            exit 1
        fi
        
        # Wait for MongoDB to start
        sleep 2
        if is_port_in_use $MONGODB_PORT; then
            echo -e "${GREEN}MongoDB started successfully${NC}"
        else
            echo -e "${RED}Failed to start MongoDB. Please start it manually and run this script again.${NC}"
            exit 1
        fi
    fi
}

# Kill any processes on required ports
kill_process_on_port $BACKEND_PORT
kill_process_on_port $FRONTEND_PORT

# Additional sleep to ensure ports are fully released
sleep 3

# Double-check ports are really free
if is_port_in_use $BACKEND_PORT; then
    echo -e "${RED}Port $BACKEND_PORT is still in use after kill attempts. Please manually check and kill processes.${NC}"
    echo -e "${YELLOW}Use: sudo lsof -i :$BACKEND_PORT -P -n${NC}"
    echo -e "${YELLOW}Then: sudo kill -9 <PID>${NC}"
    exit 1
fi

if is_port_in_use $FRONTEND_PORT; then
    echo -e "${RED}Port $FRONTEND_PORT is still in use after kill attempts. Please manually check and kill processes.${NC}"
    echo -e "${YELLOW}Use: sudo lsof -i :$FRONTEND_PORT -P -n${NC}"
    echo -e "${YELLOW}Then: sudo kill -9 <PID>${NC}"
    exit 1
fi

# Check if MongoDB is running
check_mongodb

# Define paths
SCRIPT_DIR=$(pwd)

# Make sure we're in the right directory
if [[ "$SCRIPT_DIR" != *"lms-system"* ]]; then
    # If not in the lms-system directory, navigate to it
    if [ -d "$LMS_DIR" ]; then
        cd "$LMS_DIR"
        echo -e "${GREEN}Changed to directory: $(pwd)${NC}"
    else
        echo -e "${RED}Error: Could not find lms-system directory at $LMS_DIR${NC}"
        exit 1
    fi
fi

# Verify server and client directories exist
if [ ! -d "$SERVER_DIR" ]; then
    echo -e "${RED}Error: Server directory not found at $SERVER_DIR${NC}"
    exit 1
fi

if [ ! -d "$CLIENT_DIR" ]; then
    echo -e "${RED}Error: Client directory not found at $CLIENT_DIR${NC}"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm command not found. Please install Node.js and npm.${NC}"
    exit 1
fi

# Start backend server
echo -e "${YELLOW}Starting backend server...${NC}"
if [ -d "$SERVER_DIR" ]; then
    cd "$SERVER_DIR"
    if [ -f "package.json" ]; then
        npm start > "$LOGS_DIR/backend.log" 2>&1 &
        BACKEND_PID=$!
        cd "$LMS_DIR"
    else
        echo -e "${RED}Error: No package.json found in server directory${NC}"
        exit 1
    fi
else
    echo -e "${RED}Error: Server directory not found at $SERVER_DIR${NC}"
    exit 1
fi

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 3

# Check if backend is running
if is_port_in_use $BACKEND_PORT; then
    echo -e "${GREEN}Backend server started successfully on port $BACKEND_PORT${NC}"
else
    echo -e "${RED}Failed to start backend server. Check logs for errors.${NC}"
    exit 1
fi

# Start frontend server
echo -e "${YELLOW}Starting frontend server...${NC}"
if [ -d "$CLIENT_DIR" ]; then
    cd "$CLIENT_DIR"
    if [ -f "package.json" ]; then
        npm start > "$LOGS_DIR/frontend.log" 2>&1 &
        FRONTEND_PID=$!
        cd "$LMS_DIR"
    else
        echo -e "${RED}Error: No package.json found in client directory${NC}"
        exit 1
    fi
else
    echo -e "${RED}Error: Client directory not found at $CLIENT_DIR${NC}"
    exit 1
fi

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
sleep 5

# Check if frontend is running
if is_port_in_use $FRONTEND_PORT; then
    echo -e "${GREEN}Frontend server started successfully on port $FRONTEND_PORT${NC}"
else
    echo -e "${RED}Failed to start frontend server. Check logs for errors.${NC}"
    exit 1
fi

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}LMS System started successfully!${NC}"
echo -e "${GREEN}Frontend running on: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}Backend running on: http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}MongoDB running on: localhost:$MONGODB_PORT${NC}"
echo -e "${GREEN}=============================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Handle script termination
cleanup() {
    echo -e "${YELLOW}Shutting down servers...${NC}"
    
    # Try to kill by PIDs first
    if [ -n "$BACKEND_PID" ]; then
        echo -e "${YELLOW}Shutting down backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null
    fi
    
    if [ -n "$FRONTEND_PID" ]; then
        echo -e "${YELLOW}Shutting down frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    # Wait for processes to terminate
    sleep 3
    
    # Force kill any remaining processes by port
    echo -e "${YELLOW}Checking for any remaining processes...${NC}"
    kill_process_on_port $BACKEND_PORT
    kill_process_on_port $FRONTEND_PORT
    
    echo -e "${GREEN}Servers shut down${NC}"
    echo -e "${YELLOW}Logs available at: $LOGS_DIR${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Keep script running
wait