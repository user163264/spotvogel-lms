#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Make the scripts executable
chmod +x create-backup-branch.sh
chmod +x get-git-status.sh

# Run the git status script
./get-git-status.sh

echo -e "\n\nTo create a backup branch, run: ./create-backup-branch.sh"
