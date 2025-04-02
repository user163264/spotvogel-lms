#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Get current branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Check status
echo -e "\nGit status:"
git status -s

# List all branches
echo -e "\nAll branches:"
git branch -a

# List remote
echo -e "\nRemote repositories:"
git remote -v
