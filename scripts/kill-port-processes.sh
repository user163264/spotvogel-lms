#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Aggressive Port Process Killer ====${NC}"

# Function to aggressively kill processes on a port
force_kill_port() {
    local port=$1
    echo -e "${YELLOW}Aggressively clearing port $port...${NC}"
    
    # Check if port is in use
    if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
        echo -e "${RED}Port $port is in use. Forcefully terminating all processes...${NC}"
        
        # Get all PIDs using this port
        local pids=$(lsof -i :$port -P -n | grep LISTEN | awk '{print $2}')
        
        if [ -n "$pids" ]; then
            for pid in $pids; do
                echo -e "${YELLOW}Process $pid is using port $port - Terminating...${NC}"
                
                # Show process info for debugging
                ps -f -p $pid
                
                # Try normal kill first
                kill -15 $pid 2>/dev/null
                sleep 1
                
                # Check if still running
                if ps -p $pid > /dev/null 2>&1; then
                    echo -e "${YELLOW}Process still running - Using force kill (SIGKILL)...${NC}"
                    kill -9 $pid 2>/dev/null
                    sleep 1
                    
                    # Final check
                    if ps -p $pid > /dev/null 2>&1; then
                        echo -e "${RED}WARNING: Process $pid could not be killed! This should not happen.${NC}"
                    else
                        echo -e "${GREEN}Process $pid terminated with SIGKILL${NC}"
                    fi
                else
                    echo -e "${GREEN}Process $pid terminated gracefully${NC}"
                fi
            done
            
            # Verify port is now free
            if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
                echo -e "${RED}Port $port is STILL in use! Using system-level cleanup...${NC}"
                
                # Last resort - find ALL processes related to this port, not just LISTEN state
                local all_pids=$(lsof -i :$port -P -n | awk '{print $2}' | sort | uniq)
                for pid in $all_pids; do
                    echo -e "${RED}Forcing kill on related process $pid${NC}"
                    kill -9 $pid 2>/dev/null
                    sleep 0.5
                done
                
                # Final verification
                if lsof -i :$port -P -n | grep LISTEN > /dev/null; then
                    echo -e "${RED}CRITICAL: Failed to clear port $port after aggressive cleanup!${NC}"
                    echo -e "${RED}Please manually terminate processes or reboot your system.${NC}"
                    return 1
                else
                    echo -e "${GREEN}Port $port cleared after aggressive cleanup${NC}"
                fi
            else
                echo -e "${GREEN}Port $port successfully cleared${NC}"
            fi
        fi
    else
        echo -e "${GREEN}Port $port is already free${NC}"
    fi
    
    return 0
}

# Execute for standard ports
echo -e "${YELLOW}Clearing standard ports for LMS system...${NC}"

# Frontend port (React default)
force_kill_port 3000

# Backend port
force_kill_port 8080

# Check any additional ports if needed
if [ "$1" = "all" ]; then
    echo -e "${YELLOW}Clearing additional development ports...${NC}"
    # Common alternative React ports
    force_kill_port 3001
    force_kill_port 3002
    force_kill_port 3003
fi

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}Port cleanup completed${NC}"
echo -e "${GREEN}=============================================${NC}"
