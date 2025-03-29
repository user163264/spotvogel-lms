#!/bin/bash
# Made executable through file editing

# Navigate to the project directory
cd /Users/admin/Documents/lms-system

# Make sure we're on the main/master branch and up to date
git checkout master
git pull

# Create a new feature branch
git checkout -b feature/matching-words-exercise

# Verify the branch was created and we're now on it
git branch

echo "Successfully created and switched to feature/matching-words-exercise branch"
