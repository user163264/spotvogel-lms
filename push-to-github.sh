#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Add GitHub as remote origin
git remote add origin https://github.com/user163264/SPOTVOGEL/lms-system.git

# Stage all files
git add .

# Commit changes
git commit -m "Initial commit: Project structure and GitHub configuration"

# Push to main branch
git push -u origin main

# Create and switch to develop branch
git checkout -b develop

# Push develop branch
git push -u origin develop

echo "Repository successfully pushed to GitHub!"
