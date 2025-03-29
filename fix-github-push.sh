#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Remove the incorrect remote
git remote remove origin

# Add the correct GitHub remote URL
git remote add origin https://github.com/user163264/lms-system.git

# Check what branch we're on
git branch

# Create and checkout main branch if needed
git checkout -b main

# Push to main branch
git push -u origin main

# Switch to develop branch
git checkout develop

# Push develop branch
git push -u origin develop

echo "Repository push fixed and completed!"
