#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

# Create and checkout a new branch for JSON structure work
# This branch will be based on your current ai-component-integration branch
git checkout ai-component-integration
git checkout -b feature/ai-json-structure

# Show status to confirm we're on the right branch
git status

echo -e "\nJSON structure branch created!"
echo "You are now on branch: feature/ai-json-structure"
echo "Now you can start working on defining the JSON structures for AI exercise generation."
