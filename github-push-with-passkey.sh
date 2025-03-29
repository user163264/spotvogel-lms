#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Remove any existing remote
git remote remove origin 2>/dev/null

# Add the correct GitHub remote URL
git remote add origin https://github.com/user163264/lms-system.git

# Ensure we have a main branch (convert from master if needed)
git branch -m master main 2>/dev/null || git checkout -b main 2>/dev/null

# Push to main branch - passkey should be used automatically
echo "Pushing to main branch. Use your spotvogel-lms passkey when prompted."
git push -u origin main

# Switch to develop branch
git checkout develop

# Push develop branch - passkey should be remembered from previous prompt
echo "Pushing to develop branch."
git push -u origin develop

echo "Repository push completed!"
