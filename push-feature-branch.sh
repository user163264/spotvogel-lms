#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

echo "Preparing to push feature/ai-json-structure branch to GitHub..."

# Run the API key removal script first
bash ./remove-api-keys.sh

# Check for any other sensitive files
echo "Checking for other sensitive files..."
find . -type f -name "*.env" -o -name "*secret*" -o -name "*password*" -o -name "*credential*"

# Ensure we're on the right branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "feature/ai-json-structure" ]; then
  echo "Currently on branch $current_branch, switching to feature/ai-json-structure"
  git checkout feature/ai-json-structure
fi

# Add all changes
git add .

# Commit changes
echo "Committing all changes..."
git commit -m "feat: update AI JSON structure implementation"

# Push to the feature branch
echo "Pushing to feature/ai-json-structure branch..."
git push -u origin feature/ai-json-structure

echo "Push completed! The feature/ai-json-structure branch has been updated on GitHub."
