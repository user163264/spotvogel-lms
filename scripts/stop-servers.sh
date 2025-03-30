#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Stopping LMS System Servers ====${NC}"

# Kill backend server process (port 8080)
echo -e "${YELLOW}Stopping backend server on port 8080...${NC}"
PID=$(lsof -t -i:8080)
if [ -n "$PID" ]; then
    echo -e "${YELLOW}Killing process $PID on port 8080${NC}"
    kill -9 $PID 2>/dev/null
    echo -e "${GREEN}Successfully stopped backend server${NC}"
else
    echo -e "${GREEN}No backend server running on port 8080${NC}"
fi

# Kill frontend server process (port 3000)
echo -e "${YELLOW}Stopping frontend server on port 3000...${NC}"
PID=$(lsof -t -i:3000)
if [ -n "$PID" ]; then
    echo -e "${YELLOW}Killing process $PID on port 3000${NC}"
    kill -9 $PID 2>/dev/null
    echo -e "${GREEN}Successfully stopped frontend server${NC}"
else
    echo -e "${GREEN}No frontend server running on port 3000${NC}"
fi

echo -e "${GREEN}All servers stopped successfully${NC}"
