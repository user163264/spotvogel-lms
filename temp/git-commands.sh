#!/bin/bash

# Navigate to the project directory
cd /Users/admin/Documents/lms-system

# Check git status
echo "Checking Git status..."
git status

# Verify remote repositories
echo "Checking remote repositories..."
git remote -v

# Add GitHub remote
echo "Adding GitHub remote repository..."
git remote add origin https://github.com/user163264/SPOTVOGEL/lms-system.git

# In case remote already exists, update it
git remote set-url origin https://github.com/user163264/SPOTVOGEL/lms-system.git

# Verify remote was added
echo "Verifying remote repositories after update..."
git remote -v

# Add all files to Git
echo "Adding files to Git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit: Project structure and GitHub configuration"

# Push to GitHub main branch
echo "Pushing to GitHub main branch..."
git push -u origin main

# Create and push develop branch
echo "Creating and pushing develop branch..."
git checkout -b develop
git push -u origin develop

echo "Git setup completed!"
