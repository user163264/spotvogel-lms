#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Check for API key files and warn about them
echo "Checking for API key files..."
api_files=$(find . -type f -name "*API_key*" -o -name "*apikey*" -o -name "openAI_API_key.txt")

if [ ! -z "$api_files" ]; then
  echo "Warning: Found potential API key files that should be gitignored:"
  echo "$api_files"
  echo ""
  echo "These files will be excluded from Git based on the .gitignore rules."
fi

# Remove any existing remote
git remote remove origin 2>/dev/null

# Add the correct GitHub remote URL for spotvogel-lms repository
git remote add origin https://github.com/user163264/spotvogel-lms.git

# Ensure we have a main branch (convert from master if needed)
git branch -m master main 2>/dev/null || git checkout -b main 2>/dev/null

# Create .gitignore file if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore file..."
  touch .gitignore
fi

# Commit .gitignore first to make sure it takes effect
git add .gitignore
git commit -m "chore: update .gitignore to exclude API keys and sensitive files"

# Now add remaining files
git add .

# Commit 
git commit -m "Initial commit: Project structure and GitHub configuration"

# Push to main branch - passkey should be used automatically
echo "Pushing to main branch. Use your spotvogel-lms passkey when prompted."
git push -u origin main

# Switch to develop branch
git checkout develop

# Push develop branch - passkey should be remembered from previous prompt
echo "Pushing to develop branch."
git push -u origin develop

echo "Repository push to spotvogel-lms completed!"
echo ""
echo "IMPORTANT: If you need to add API keys in the future, please:"
echo "1. Add them to environment variables (.env files)"
echo "2. Never commit API keys directly to the repository"
echo "3. Use a secrets management service for production environments"
