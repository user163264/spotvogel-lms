#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== LMS System Debug Script ====${NC}"

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

# More thorough port killing function
kill_process_on_port() {
    local port=$1
    echo -e "${YELLOW}Checking for processes on port $port...${NC}"
    
    if is_port_in_use $port; then
        echo -e "${RED}Port $port is in use. Attempting to kill the process...${NC}"
        
        # Get all PIDs using this port (could be multiple)
        local pids=$(lsof -i :$port -P -n | grep LISTEN | awk '{print $2}')
        
        if [ -n "$pids" ]; then
            echo -e "${YELLOW}Found processes on port $port: $pids${NC}"
            
            # Kill each process with escalating force
            for pid in $pids; do
                echo -e "${YELLOW}Killing process $pid...${NC}"
                
                # Try gentle SIGTERM first
                kill $pid 2>/dev/null
                sleep 2
                
                # Check if still running
                if ps -p $pid > /dev/null 2>&1; then
                    echo -e "${YELLOW}Process still running, trying SIGKILL...${NC}"
                    kill -9 $pid 2>/dev/null
                    sleep 2
                    
                    # Final check
                    if ps -p $pid > /dev/null 2>&1; then
                        echo -e "${RED}Failed to kill process $pid${NC}"
                    else
                        echo -e "${GREEN}Process $pid terminated${NC}"
                    fi
                else
                    echo -e "${GREEN}Process $pid terminated${NC}"
                fi
            done
            
            # Final verification
            if is_port_in_use $port; then
                echo -e "${RED}Warning: Port $port is still in use. Will try more aggressive methods...${NC}"
                
                # Last resort - more aggressive killing
                sudo lsof -i :$port -P -n | grep LISTEN | awk '{print $2}' | xargs -r sudo kill -9
                sleep 2
                
                if is_port_in_use $port; then
                    echo -e "${RED}Failed to free port $port. Please check manually with:${NC}"
                    echo -e "${YELLOW}sudo lsof -i :$port -P -n${NC}"
                    exit 1
                else
                    echo -e "${GREEN}Successfully freed port $port${NC}"
                fi
            else
                echo -e "${GREEN}Successfully freed port $port${NC}"
            fi
        fi
    else
        echo -e "${GREEN}Port $port is already free${NC}"
    fi
    
    # Additional sleep to ensure system resources are fully released
    sleep 2
}

# Kill processes on required ports
kill_process_on_port $BACKEND_PORT
kill_process_on_port $FRONTEND_PORT

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB connection...${NC}"
cd "$SERVER_DIR"
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
console.log('MongoDB URI: ' + (process.env.MONGODB_URI || 'Not set in .env'));
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
" > "$LOGS_DIR/mongodb-check.log" 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}MongoDB connection check failed. See $LOGS_DIR/mongodb-check.log for details.${NC}"
    echo -e "${YELLOW}Continuing anyway with simplified server...${NC}"
fi

# Create a simplified server file if it doesn't exist
SIMPLIFIED_SERVER="$SERVER_DIR/simplified-main.js"
if [ ! -f "$SIMPLIFIED_SERVER" ]; then
    echo -e "${YELLOW}Creating simplified server file...${NC}"
    cat > "$SIMPLIFIED_SERVER" << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Basic CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Basic parsing middleware
app.use(express.json());

// Public test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route is working' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Main server root is working' });
});

// Authentication route - very simplified
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Hard-coded admin check
  if (email === 'admin@example.com' && password === 'Admin123!') {
    res.json({
      _id: '123456789',
      name: 'Admin User',
      email: email,
      role: 'admin',
      token: 'dummy-token-for-testing'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Simplified server running on http://localhost:${PORT}`);
});
EOF
    echo -e "${GREEN}Simplified server file created at $SIMPLIFIED_SERVER${NC}"
fi

# Start the simplified server
echo -e "${YELLOW}Starting simplified backend server...${NC}"
cd "$SERVER_DIR"
node simplified-main.js > "$LOGS_DIR/simplified-backend.log" 2>&1 &
BACKEND_PID=$!
cd "$LMS_DIR"

# Wait for backend to start
echo -e "${YELLOW}Waiting for simplified backend to start...${NC}"
sleep 3

# Check if backend is running
if is_port_in_use $BACKEND_PORT; then
    echo -e "${GREEN}Simplified backend server started successfully on port $BACKEND_PORT${NC}"
else
    echo -e "${RED}Failed to start simplified backend server. Check logs at $LOGS_DIR/simplified-backend.log${NC}"
    # Show last few lines of the log
    if [ -f "$LOGS_DIR/simplified-backend.log" ]; then
        echo -e "${YELLOW}Last 10 lines of backend log:${NC}"
        tail -n 10 "$LOGS_DIR/simplified-backend.log"
    fi
    exit 1
fi

# Start frontend server
echo -e "${YELLOW}Starting frontend...${NC}"
cd "$CLIENT_DIR"
npm start > "$LOGS_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
cd "$LMS_DIR"

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
sleep 5

# Check if frontend is running
if is_port_in_use $FRONTEND_PORT; then
    echo -e "${GREEN}Frontend server started successfully on port $FRONTEND_PORT${NC}"
else
    echo -e "${RED}Failed to start frontend server. Check logs at $LOGS_DIR/frontend.log${NC}"
    exit 1
fi

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}Debug System started successfully!${NC}"
echo -e "${GREEN}Frontend running on: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}Simplified Backend running on: http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}=============================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo -e "${GREEN}=============================================${NC}"
echo -e "${YELLOW}IMPORTANT: This is running a simplified debug server.${NC}"
echo -e "${YELLOW}The backend has been replaced with a minimal version for testing.${NC}"
echo -e "${YELLOW}Use admin@example.com / Admin123! to log in${NC}"
echo -e "${GREEN}=============================================${NC}"

# Handle script termination
cleanup() {
    echo -e "${YELLOW}Shutting down servers...${NC}"
    
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