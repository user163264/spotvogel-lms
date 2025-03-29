#!/bin/bash

# Script to install the improved AI service into the application
# Run with: sh scripts/install-ai-service.sh

echo "=== Installing Improved OpenAI Integration ==="

# Create services directory if it doesn't exist
if [ ! -d "./services" ]; then
  echo "Creating services directory..."
  mkdir -p ./services
fi

# Backup existing service if it exists
if [ -f "./services/aiService.js" ]; then
  echo "Backing up existing aiService.js to aiService.js.backup"
  cp ./services/aiService.js ./services/aiService.js.backup
fi

# Copy improved service
echo "Installing improved aiService.js..."
cp ./scripts/improved-aiService.js ./services/aiService.js

echo "=== Installation Complete ==="
echo "The enhanced OpenAI integration has been installed."
echo "You can now restart your server to apply the changes."
echo ""
echo "To verify the installation, run:"
echo "  ./scripts/verify-openai-key.js"
