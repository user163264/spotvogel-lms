#!/bin/bash

# Make scripts executable
chmod +x create-tailwind-branch.sh
chmod +x start-json-structure.sh
chmod +x create-backup-branch.sh
chmod +x get-git-status.sh
chmod +x push-branches-to-github.sh

echo "All scripts are now executable."
echo "Run ./create-tailwind-branch.sh to create the tailwind branch and commit all changes."
echo "After that, run ./start-json-structure.sh to create a new branch for the JSON structure work."
echo "You can use ./get-git-status.sh anytime to check your Git status."
echo "To push branches to GitHub, use ./push-branches-to-github.sh"
