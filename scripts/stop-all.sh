#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Stopping All LMS Services ====${NC}"

LMS_DIR="/Users/admin/Documents/lms-system"

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
            fi
        fi
    else
        echo -e "${GREEN}Port $port is free${NC}"
    fi
}

# Function to kill process by PID
kill_process_by_pid() {
    local pid=$1
    local name=$2
    
    if [ -n "$pid" ] && ps -p $pid > /dev/null 2>&1; then
        echo -e "${YELLOW}Shutting down $name (PID: $pid)...${NC}"
        kill $pid 2>/dev/null
        
        # Wait up to 5 seconds for process to terminate gracefully
        for i in {1..5}; do
            if ! ps -p $pid > /dev/null 2>&1; then
                echo -e "${GREEN}$name terminated gracefully${NC}"
                return 0
            fi
            sleep 1
        done
        
        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${YELLOW}$name still running, using force kill...${NC}"
            kill -9 $pid 2>/dev/null
            sleep 1
            
            if ! ps -p $pid > /dev/null 2>&1; then
                echo -e "${GREEN}$name force-terminated successfully${NC}"
                return 0
            else
                echo -e "${RED}Failed to kill $name process (PID: $pid)${NC}"
                return 1
            fi
        fi
    else
        echo -e "${GREEN}$name is not running with PID $pid${NC}"
    fi
    return 0
}

# Read PIDs from files if they exist
if [ -f "$LMS_DIR/.pid.frontend" ]; then
    source "$LMS_DIR/.pid.frontend"
    echo -e "${YELLOW}Found frontend PID: $FRONTEND_PID${NC}"
fi

if [ -f "$LMS_DIR/.pid.backend" ]; then
    source "$LMS_DIR/.pid.backend"
    echo -e "${YELLOW}Found backend PID: $BACKEND_PID${NC}"
fi

# Read port information if available
if [ -f "$LMS_DIR/.env.ports" ]; then
    source "$LMS_DIR/.env.ports"
    echo -e "${YELLOW}Found port information: Frontend=$FRONTEND_PORT, Backend=$BACKEND_PORT${NC}"
else
    # Default ports if not found
    FRONTEND_PORT=3000
    BACKEND_PORT=8080
    echo -e "${YELLOW}Using default ports: Frontend=$FRONTEND_PORT, Backend=$BACKEND_PORT${NC}"
fi

# Kill processes by PID if we have them
if [ -n "$FRONTEND_PID" ]; then
    kill_process_by_pid "$FRONTEND_PID" "Frontend"
fi

if [ -n "$BACKEND_PID" ]; then
    kill_process_by_pid "$BACKEND_PID" "Backend"
fi

# Also attempt to kill by port to catch any process we don't have PIDs for
echo -e "${YELLOW}Checking for any remaining processes by port...${NC}"
kill_process_on_port $FRONTEND_PORT
kill_process_on_port $BACKEND_PORT

# Remove PID files
rm -f "$LMS_DIR/.pid.frontend" "$LMS_DIR/.pid.backend" "$LMS_DIR/.env.ports" "$LMS_DIR/.env.frontend"

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}All LMS services have been stopped${NC}"
echo -e "${GREEN}=============================================${NC}"
