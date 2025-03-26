#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== MongoDB Check and Installation Script ====${NC}"

# Check for required commands
if ! command -v lsof &> /dev/null; then
    echo -e "${RED}Error: 'lsof' command not found. Please install it.${NC}"
    exit 1
fi

# Define MongoDB port
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

# Function to check if MongoDB is installed
check_mongodb_installed() {
    if command -v mongod &> /dev/null; then
        echo -e "${GREEN}MongoDB is installed (mongod found in PATH)${NC}"
        return 0
    elif [ -d "/usr/local/opt/mongodb-community" ]; then
        echo -e "${GREEN}MongoDB is installed (Homebrew installation found)${NC}"
        return 0
    elif [ -f "/etc/init.d/mongodb" ]; then
        echo -e "${GREEN}MongoDB is installed (service found)${NC}"
        return 0
    elif [ -d "/var/lib/mongodb" ]; then
        echo -e "${GREEN}MongoDB is installed (data directory found)${NC}"
        return 0
    else
        echo -e "${RED}MongoDB installation not found${NC}"
        return 1
    fi
}

# Function to check if MongoDB is running
check_mongodb_running() {
    if is_port_in_use $MONGODB_PORT; then
        echo -e "${GREEN}MongoDB is running on port $MONGODB_PORT${NC}"
        return 0
    else
        echo -e "${RED}MongoDB is not running on port $MONGODB_PORT${NC}"
        return 1
    fi
}

# Check if MongoDB is installed
check_mongodb_installed
MONGODB_INSTALLED=$?

# Check if MongoDB is running
check_mongodb_running
MONGODB_RUNNING=$?

# If MongoDB is installed but not running, try to start it
if [ $MONGODB_INSTALLED -eq 0 ] && [ $MONGODB_RUNNING -eq 1 ]; then
    echo -e "${YELLOW}Attempting to start MongoDB...${NC}"
    
    if command -v mongod &> /dev/null; then
        # Create log directory
        mkdir -p /Users/admin/Documents/lms-system/logs
        mongod --fork --logpath /Users/admin/Documents/lms-system/logs/mongodb.log
    elif [ -d "/usr/local/opt/mongodb-community" ]; then
        # macOS with Homebrew
        brew services start mongodb-community
    elif [ -f "/etc/init.d/mongodb" ]; then
        # Some Linux distros
        sudo service mongodb start
    else
        echo -e "${RED}Could not determine how to start MongoDB${NC}"
        exit 1
    fi
    
    # Wait for MongoDB to start
    sleep 5
    if is_port_in_use $MONGODB_PORT; then
        echo -e "${GREEN}MongoDB started successfully${NC}"
    else
        echo -e "${RED}Failed to start MongoDB${NC}"
        exit 1
    fi
elif [ $MONGODB_INSTALLED -eq 1 ]; then
    echo -e "${YELLOW}MongoDB is not installed. Would you like to install it? (y/n)${NC}"
    read -r INSTALL_MONGODB
    
    if [[ "$INSTALL_MONGODB" =~ ^[Yy]$ ]]; then
        OS=$(uname)
        
        if [ "$OS" == "Darwin" ]; then
            # macOS installation
            echo -e "${YELLOW}Installing MongoDB on macOS using Homebrew...${NC}"
            if command -v brew &> /dev/null; then
                brew tap mongodb/brew
                brew install mongodb-community
                brew services start mongodb-community
            else
                echo -e "${RED}Homebrew is not installed. Please install Homebrew first:${NC}"
                echo -e "${YELLOW}https://brew.sh/${NC}"
                exit 1
            fi
        elif [ "$OS" == "Linux" ]; then
            # Linux installation
            echo -e "${YELLOW}Installing MongoDB on Linux...${NC}"
            if command -v apt-get &> /dev/null; then
                # Debian/Ubuntu
                echo -e "${YELLOW}Detected Debian/Ubuntu system${NC}"
                echo -e "${YELLOW}Adding MongoDB GPG key...${NC}"
                wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
                echo -e "${YELLOW}Adding MongoDB repository...${NC}"
                echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
                echo -e "${YELLOW}Updating package list...${NC}"
                sudo apt-get update
                echo -e "${YELLOW}Installing MongoDB...${NC}"
                sudo apt-get install -y mongodb-org
                echo -e "${YELLOW}Starting MongoDB...${NC}"
                sudo systemctl start mongod
                echo -e "${YELLOW}Enabling MongoDB to start on boot...${NC}"
                sudo systemctl enable mongod
            elif command -v yum &> /dev/null; then
                # RHEL/CentOS/Fedora
                echo -e "${YELLOW}Detected RHEL/CentOS/Fedora system${NC}"
                echo -e "${YELLOW}Adding MongoDB repository...${NC}"
                cat << EOF | sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
                echo -e "${YELLOW}Installing MongoDB...${NC}"
                sudo yum install -y mongodb-org
                echo -e "${YELLOW}Starting MongoDB...${NC}"
                sudo systemctl start mongod
                echo -e "${YELLOW}Enabling MongoDB to start on boot...${NC}"
                sudo systemctl enable mongod
            else
                echo -e "${RED}Unsupported Linux distribution${NC}"
                echo -e "${YELLOW}Please install MongoDB manually:${NC}"
                echo -e "${YELLOW}https://docs.mongodb.com/manual/administration/install-on-linux/${NC}"
                exit 1
            fi
        else
            echo -e "${RED}Unsupported operating system: $OS${NC}"
            echo -e "${YELLOW}Please install MongoDB manually:${NC}"
            echo -e "${YELLOW}https://docs.mongodb.com/manual/installation/${NC}"
            exit 1
        fi
        
        # Verify installation
        echo -e "${YELLOW}Verifying MongoDB installation...${NC}"
        sleep 3
        check_mongodb_installed
        check_mongodb_running
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}MongoDB installation and startup successful!${NC}"
        else
            echo -e "${RED}MongoDB installation or startup failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}MongoDB installation skipped${NC}"
    fi
fi

# Test MongoDB connection
echo -e "${YELLOW}Testing MongoDB connection...${NC}"
if command -v mongosh &> /dev/null; then
    # Use newer MongoDB Shell if available
    timeout_cmd=""
    if command -v timeout &> /dev/null; then
        timeout_cmd="timeout 5"
    fi
    if $timeout_cmd mongosh --eval "db.adminCommand('ping')" mongodb://localhost:$MONGODB_PORT/admin > /dev/null 2>&1; then
        echo -e "${GREEN}Successfully connected to MongoDB!${NC}"
    else
        echo -e "${RED}Failed to connect to MongoDB using mongosh${NC}"
        exit 1
    fi
elif command -v mongo &> /dev/null; then
    # Use legacy mongo shell
    timeout_cmd=""
    if command -v timeout &> /dev/null; then
        timeout_cmd="timeout 5"
    fi
    if $timeout_cmd mongo --eval "db.adminCommand('ping')" localhost:$MONGODB_PORT/admin > /dev/null 2>&1; then
        echo -e "${GREEN}Successfully connected to MongoDB!${NC}"
    else
        echo -e "${RED}Failed to connect to MongoDB using mongo shell${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}MongoDB client not found. Cannot test connection.${NC}"
    echo -e "${YELLOW}Assuming MongoDB is running based on port check.${NC}"
fi

echo -e "\n${GREEN}==== MongoDB Check Complete ====${NC}"
if [ $MONGODB_RUNNING -eq 0 ]; then
    echo -e "${GREEN}MongoDB is installed and running correctly.${NC}"
    echo -e "${GREEN}Database server ready for the LMS system!${NC}"
    exit 0
else
    echo -e "${RED}MongoDB setup incomplete. Please resolve issues before starting the LMS system.${NC}"
    exit 1
fi