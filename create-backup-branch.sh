#!/bin/bash

# Get current date for branch name
CURRENT_DATE=$(date +"%Y%m%d")
BACKUP_BRANCH="backup-before-json-structure-$CURRENT_DATE"

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo "Uncommitted changes detected. Stashing changes..."
  git stash save "Automatic stash before creating backup branch"
  STASHED=true
fi

# Create a new backup branch from the current state
echo "Creating backup branch: $BACKUP_BRANCH"
git branch $BACKUP_BRANCH

# If changes were stashed, pop them back
if [[ "$STASHED" == true ]]; then
  echo "Restoring uncommitted changes..."
  git stash pop
fi

echo "Backup complete! Branch '$BACKUP_BRANCH' now contains a snapshot of the current state."
echo "To switch to this branch in the future, use: git checkout $BACKUP_BRANCH"
echo "To push this branch to GitHub, use: git push origin $BACKUP_BRANCH"
