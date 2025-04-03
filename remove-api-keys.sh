#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

echo "Removing API keys from files..."

# Replace API keys with placeholders in the files
if [ -f openAI_API_key.txt ]; then
  echo "REPLACE_WITH_YOUR_OPENAI_API_KEY" > openAI_API_key.txt
  echo "Replaced API key in openAI_API_key.txt"
fi

if [ -f standalone-test.html ]; then
  # Replace API keys with placeholder in standalone-test.html
  sed -i '' 's/sk-[a-zA-Z0-9]\{48\}/YOUR_OPENAI_API_KEY_HERE/g' standalone-test.html
  echo "Replaced API keys in standalone-test.html"
fi

# Add changes
git add openAI_API_key.txt standalone-test.html

# Commit the sanitized files
git commit -m "chore: replace API keys with placeholders for security"

echo "API keys have been replaced with placeholders."
echo "Now you can safely push to GitHub."
echo ""
echo "To push to GitHub, run:"
echo "./github-push-secure.sh"
