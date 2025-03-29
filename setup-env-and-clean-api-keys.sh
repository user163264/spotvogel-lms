#!/bin/bash

# Navigate to project directory
cd /Users/admin/Documents/lms-system

echo "Setting up environment variables and cleaning API keys..."

# Create server .env file from example if it doesn't exist
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  echo "Created server/.env file from example."
fi

# Create client .env file from example if it doesn't exist
if [ ! -f client/.env ]; then
  cp client/.env.example client/.env
  echo "Created client/.env file from example."
fi

# If OpenAI API key file exists, extract the key and add to .env
if [ -f openAI_API_key.txt ]; then
  # Get API key from file (assuming it's on the first line)
  API_KEY=$(head -n 1 openAI_API_key.txt)
  
  # Update the server .env file with the API key
  sed -i '' "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$API_KEY/" server/.env
  
  # Replace the actual key in the file with a placeholder
  echo "REPLACE_WITH_YOUR_OPENAI_API_KEY" > openAI_API_key.txt
  
  echo "Moved API key from openAI_API_key.txt to server/.env"
fi

# Look for and clean any API keys in standalone-test.html
if [ -f standalone-test.html ]; then
  # Replace API keys with placeholder in standalone-test.html
  sed -i '' 's/sk-[a-zA-Z0-9]\{48\}/YOUR_OPENAI_API_KEY_HERE/g' standalone-test.html
  echo "Replaced API keys in standalone-test.html with placeholders"
fi

# Add the changes to git
git add openAI_API_key.txt standalone-test.html

# Commit the changes with a clean message
git commit -m "chore: replace API keys with placeholders and move to environment variables"

echo ""
echo "Environment variables have been set up and API keys have been cleaned."
echo "API keys are now stored securely in .env files which are excluded from Git."
echo ""
echo "To push to GitHub, run:"
echo "./github-push-secure.sh"
