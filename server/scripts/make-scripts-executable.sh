#!/bin/bash

# Make all scripts in the scripts directory executable
# Run this with: sh make-scripts-executable.sh

# Change to the script's directory
cd "$(dirname "$0")"

# Make JS files executable
chmod +x openai-diagnostic.js
chmod +x verify-config.js
chmod +x verify-openai-key.js
chmod +x improved-aiService.js

echo "Scripts are now executable!"
echo "You can run them directly:"
echo "  ./openai-diagnostic.js"
echo "  ./verify-config.js"
echo "  ./verify-openai-key.js"
echo ""
echo "Note: You may need to add the node shebang to the scripts:"
echo "Add this as the first line of each .js file: #!/usr/bin/env node"
