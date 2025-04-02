#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Create and checkout a new tailwind branch
git checkout -b feature/tailwind-implementation

# Note about sensitive files
echo "Note: API keys and sensitive files in .gitignore won't be committed."
echo "This is usually what you want for security reasons."

# Stage all changes (tracked and untracked files)
git add -A

# Commit all changes
git commit -m "Complete Tailwind CSS implementation and migration"

# Show the status after commit
git status

echo -e "\nTailwind branch created and all changes committed!"
echo "You are now on branch: feature/tailwind-implementation"
echo "To push this branch to GitHub, use: git push -u origin feature/tailwind-implementation"
