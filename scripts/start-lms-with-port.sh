#!/bin/bash

# Debug mode - uncomment to see all commands executed
# set -x

# Exit on any error
set -e

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== LMS System Startup Script (Fixed Port Version) ====${NC}"

# Define the main directory
LMS_DIR="/Users/admin/Documents/lms-system"
SCRIPTS_DIR="$LMS_DIR/scripts"
SERVER_DIR="$LMS_DIR/server"
FRONTEND_DIR="$LMS_DIR/frontend"

# Create logs directory
LOGS_DIR="/Users/admin/Documents/lms-system/logs"
mkdir -p "$LOGS_DIR"

# Define default ports
BACKEND_PORT=8080

# Allow configurable frontend port with default fallback
if [ -n "$1" ]; then
    FRONTEND_PORT=$1
    echo -e "${YELLOW}Using specified frontend port: $FRONTEND_PORT${NC}"
else
    FRONTEND_PORT=3000
    echo -e "${YELLOW}Using default frontend port: $FRONTEND_PORT${NC}"
fi

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
        return 0
    else
        echo -e "${RED}MongoDB is not running on port $MONGODB_PORT. Attempting to start MongoDB...${NC}"
        
        # Different ways to start MongoDB based on OS/installation
        MONGO_STARTED=false
        
        # Try homebrew service first (common on macOS)
        if command -v brew &> /dev/null && brew services list | grep -q mongodb; then
            echo -e "${YELLOW}Starting MongoDB using Homebrew services...${NC}"
            brew services start mongodb-community && MONGO_STARTED=true
        # Try mongod command
        elif command -v mongod &> /dev/null; then
            echo -e "${YELLOW}Starting MongoDB using mongod command...${NC}"
            mongod --fork --logpath "$LOGS_DIR/mongodb.log" && MONGO_STARTED=true
        # Try mongod in common locations
        elif [ -f "/usr/local/bin/mongod" ]; then
            echo -e "${YELLOW}Starting MongoDB from /usr/local/bin/mongod...${NC}"
            /usr/local/bin/mongod --fork --logpath "$LOGS_DIR/mongodb.log" && MONGO_STARTED=true
        # Try system service
        elif [ -f "/etc/init.d/mongodb" ]; then
            echo -e "${YELLOW}Starting MongoDB using system service...${NC}"
            sudo service mongodb start && MONGO_STARTED=true
        # Try systemctl
        elif command -v systemctl &> /dev/null && systemctl list-unit-files | grep -q mongodb; then
            echo -e "${YELLOW}Starting MongoDB using systemctl...${NC}"
            sudo systemctl start mongodb && MONGO_STARTED=true
        else
            echo -e "${RED}Could not find a way to start MongoDB automatically.${NC}"
            echo -e "${YELLOW}Please start MongoDB manually using one of these commands:${NC}"
            echo -e "${YELLOW}  - brew services start mongodb-community${NC}"
            echo -e "${YELLOW}  - mongod --fork --logpath /tmp/mongodb.log${NC}"
            echo -e "${YELLOW}  - sudo service mongodb start${NC}"
            echo -e "${YELLOW}Or connect to a remote MongoDB instance by modifying the connection string in server/.env${NC}"
            
            # Ask user if they want to continue without MongoDB
            read -p "Do you want to continue without MongoDB? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                echo -e "${YELLOW}Continuing without MongoDB. The application may not function correctly.${NC}"
                return 0
            else
                echo -e "${RED}Exiting. Please start MongoDB manually and run this script again.${NC}"
                exit 1
            fi
        fi
        
        # Wait for MongoDB to start
        if [ "$MONGO_STARTED" = true ]; then
            echo -e "${YELLOW}Waiting for MongoDB to start...${NC}"
            for i in {1..10}; do
                if is_port_in_use $MONGODB_PORT; then
                    echo -e "${GREEN}MongoDB started successfully on port $MONGODB_PORT${NC}"
                    return 0
                fi
                sleep 1
                echo -e "${YELLOW}Still waiting for MongoDB... ($i/10)${NC}"
            done
            
            echo -e "${RED}MongoDB did not start in the expected time. Check mongo logs for errors.${NC}"
            echo -e "${YELLOW}Continuing anyway, but the application may not function correctly.${NC}"
        fi
    fi
}

# Kill any processes on required ports
kill_process_on_port $BACKEND_PORT
kill_process_on_port $FRONTEND_PORT

# Additional sleep to ensure ports are fully released
sleep 2

# Double-check ports are really free
if is_port_in_use $BACKEND_PORT; then
    echo -e "${RED}Port $BACKEND_PORT is still in use after kill attempts. Please manually check and kill processes.${NC}"
    echo -e "${YELLOW}Use: sudo lsof -i :$BACKEND_PORT -P -n${NC}"
    echo -e "${YELLOW}Then: sudo kill -9 <PID>${NC}"
    exit 1
fi

if is_port_in_use $FRONTEND_PORT; then
    echo -e "${RED}Port $FRONTEND_PORT is still in use after kill attempts. Trying another port...${NC}"
    
    # Try to find an available port starting from FRONTEND_PORT + 1
    ORIGINAL_PORT=$FRONTEND_PORT
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

# Check if MongoDB is running
check_mongodb

# Verify server and client directories exist
if [ ! -d "$SERVER_DIR" ]; then
    echo -e "${RED}Error: Server directory not found at $SERVER_DIR${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
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
        # Start the server with enhanced logging
        echo -e "${GREEN}Starting backend with command: npm start${NC}"
        npm start > "$LOGS_DIR/backend.log" 2>&1 &
        BACKEND_PID=$!
        echo -e "${GREEN}Backend process started with PID: $BACKEND_PID${NC}"
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
BACKEND_START_WAIT=30 # seconds to wait
BACKEND_STARTED=false
for i in $(seq 1 $BACKEND_START_WAIT); do
    if is_port_in_use $BACKEND_PORT; then
        echo -e "${GREEN}Backend server started successfully on port $BACKEND_PORT${NC}"
        BACKEND_STARTED=true
        break
    fi
    sleep 1
    echo -e "${YELLOW}Still waiting for backend... ($i/$BACKEND_START_WAIT)${NC}"
    
    # Check if process is still running
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo -e "${RED}Backend process terminated unexpectedly. Check logs for errors.${NC}"
        echo -e "${YELLOW}Last 20 lines of backend.log:${NC}"
        tail -n 20 "$LOGS_DIR/backend.log"
        exit 1
    fi
done

# If backend didn't start in the expected time
if [ "$BACKEND_STARTED" != "true" ]; then
    echo -e "${RED}Failed to start backend server within $BACKEND_START_WAIT seconds.${NC}"
    echo -e "${YELLOW}Last 20 lines of backend.log:${NC}"
    tail -n 20 "$LOGS_DIR/backend.log"
    
    # Ask user if they want to continue anyway
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Exiting. Please check the backend logs for errors.${NC}"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    echo -e "${YELLOW}Continuing despite backend issues...${NC}"
fi

# Start frontend server with specified port
echo -e "${YELLOW}Starting frontend server on port $FRONTEND_PORT...${NC}"
if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR"
    if [ -f "package.json" ]; then
        # Set PORT environment variable for React to use our specific port
        echo -e "${GREEN}Starting frontend with command: PORT=$FRONTEND_PORT npm start${NC}"
        PORT=$FRONTEND_PORT npm start > "$LOGS_DIR/frontend.log" 2>&1 &
        FRONTEND_PID=$!
        echo -e "${GREEN}Frontend process started with PID: $FRONTEND_PID${NC}"
        cd "$LMS_DIR"
    else
        echo -e "${RED}Error: No package.json found in frontend directory${NC}"
        exit 1
    fi
else
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
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
    
    # Ask user if they want to continue anyway
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Exiting. Please check the frontend logs for errors.${NC}"
        kill $BACKEND_PID 2>/dev/null
        kill $FRONTEND_PID 2>/dev/null
        exit 1
    fi
    echo -e "${YELLOW}Continuing despite frontend issues...${NC}"
fi

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}LMS System started successfully!${NC}"
echo -e "${GREEN}Frontend running on: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}Backend running on: http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}MongoDB running on: localhost:$MONGODB_PORT${NC}"
echo -e "${GREEN}=============================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Store ports in a file for other scripts to use
echo "FRONTEND_PORT=$FRONTEND_PORT" > "$LMS_DIR/.env.ports"
echo "BACKEND_PORT=$BACKEND_PORT" >> "$LMS_DIR/.env.ports"
echo "MONGODB_PORT=$MONGODB_PORT" >> "$LMS_DIR/.env.ports"

# Save PIDs to file for easy cleanup
echo "FRONTEND_PID=$FRONTEND_PID" > "$LMS_DIR/.pid.frontend"
echo "BACKEND_PID=$BACKEND_PID" > "$LMS_DIR/.pid.backend"

# Handle script termination
cleanup() {
    echo -e "${YELLOW}\nShutting down servers...${NC}"
    
    # Try to kill by PIDs first
    if [ -n "$BACKEND_PID" ]; then
        echo -e "${YELLOW}Shutting down backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null
        
        # Wait up to 5 seconds for backend to terminate gracefully
        for i in {1..5}; do
            if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
                echo -e "${GREEN}Backend terminated gracefully${NC}"
                break
            fi
            sleep 1
        done
        
        # Force kill if still running
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo -e "${YELLOW}Backend still running, using force kill...${NC}"
            kill -9 $BACKEND_PID 2>/dev/null
        fi
    fi
    
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
    echo -e "${YELLOW}Checking for any remaining processes...${NC}"
    kill_process_on_port $BACKEND_PORT
    kill_process_on_port $FRONTEND_PORT
    
    # Clean up PID files
    rm -f "$LMS_DIR/.pid.frontend" "$LMS_DIR/.pid.backend" "$LMS_DIR/.env.ports"
    
    echo -e "${GREEN}Servers shut down${NC}"
    echo -e "${YELLOW}Logs available at: $LOGS_DIR${NC}"
    echo -e "${GREEN}Backend log: $LOGS_DIR/backend.log${NC}"
    echo -e "${GREEN}Frontend log: $LOGS_DIR/frontend.log${NC}"
    
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Keep script running
wait
