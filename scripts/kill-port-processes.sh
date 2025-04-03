#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Frontend port to clear
PORT=3000

echo -e "${YELLOW}===== Aggressive Port Process Killer =====${NC}"
echo -e "${YELLOW}Targeting processes on port $PORT...${NC}"

# Function to check if a port is in use
is_port_in_use() {
    local port=$1
    if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
        return 0 # Port is in use
    else
        return 1 # Port is not in use
    fi
}

# Kill function with multiple approaches
kill_port_processes() {
    local port=$1
    
    if ! is_port_in_use $port; then
        echo -e "${GREEN}Port $port is already free. Nothing to do.${NC}"
        return 0
    fi
    
    echo -e "${YELLOW}Port $port is in use. Starting aggressive cleanup...${NC}"
    
    # Approach 1: Standard lsof and kill
    echo -e "${YELLOW}Approach 1: Using lsof and kill...${NC}"
    local pids=$(lsof -i :$port -P -n | grep LISTEN | awk '{print $2}')
    
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Found processes: $pids${NC}"
        for pid in $pids; do
            echo -e "${YELLOW}Killing process $pid...${NC}"
            kill $pid 2>/dev/null
            sleep 1
            
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${YELLOW}Process still running, using force kill...${NC}"
                kill -9 $pid 2>/dev/null
            fi
        done
    fi
    
    # Check if port is free after approach 1
    if ! is_port_in_use $port; then
        echo -e "${GREEN}Port $port freed successfully using approach 1.${NC}"
        return 0
    fi
    
    # Approach 2: More direct with pkill
    echo -e "${YELLOW}Approach 2: Using pkill...${NC}"
    pkill -f "node.*$port" 2>/dev/null
    sleep 1
    
    # Check if port is free after approach 2
    if ! is_port_in_use $port; then
        echo -e "${GREEN}Port $port freed successfully using approach 2.${NC}"
        return 0
    fi
    
    # Approach 3: Even more aggressive with lsof and sudo
    echo -e "${YELLOW}Approach 3: Using sudo lsof and kill -9...${NC}"
    pids=$(sudo lsof -i :$port -P -n 2>/dev/null | grep LISTEN | awk '{print $2}')
    
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Found processes (with sudo): $pids${NC}"
        for pid in $pids; do
            echo -e "${YELLOW}Force killing process $pid with sudo...${NC}"
            sudo kill -9 $pid 2>/dev/null
        done
    fi
    
    # Check if port is free after approach 3
    if ! is_port_in_use $port; then
        echo -e "${GREEN}Port $port freed successfully using approach 3.${NC}"
        return 0
    fi
    
    # Approach 4: Nuclear option with npx kill-port
    echo -e "${YELLOW}Approach 4: Using npx kill-port...${NC}"
    if command -v npx &> /dev/null; then
        npx kill-port $port
        sleep 1
    else
        echo -e "${RED}npx not available for approach 4.${NC}"
    fi
    
    # Final check
    if ! is_port_in_use $port; then
        echo -e "${GREEN}Port $port freed successfully.${NC}"
        return 0
    else
        echo -e "${RED}FAILED TO FREE PORT $port AFTER ALL APPROACHES!${NC}"
        echo -e "${RED}You may need to reboot your computer to free this port.${NC}"
        return 1
    fi
}

# Run the kill function for the specified port
kill_port_processes $PORT

# Additional sleep to let system resources fully release
sleep 2

# Final verification
if ! is_port_in_use $PORT; then
    echo -e "${GREEN}CONFIRMED: Port $PORT is now free and available.${NC}"
    exit 0
else
    echo -e "${RED}CRITICAL FAILURE: Port $PORT is still in use despite all efforts.${NC}"
    echo -e "${RED}Consider rebooting your system.${NC}"
    exit 1
fi