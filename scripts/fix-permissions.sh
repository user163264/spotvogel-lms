#!/bin/bash

# Apply executable permissions to all shell scripts
chmod +x /Users/admin/Documents/lms-system/scripts/*.sh

# Specifically ensure our new scripts are executable
chmod +x /Users/admin/Documents/lms-system/scripts/kill-port-processes.sh
chmod +x /Users/admin/Documents/lms-system/scripts/start-lms-fixed.sh
chmod +x /Users/admin/Documents/lms-system/scripts/start-frontend-fixed.sh

echo "All scripts in the scripts directory are now executable."
echo "Key scripts:"
echo "  - kill-port-processes.sh (Aggressively clears port processes)"
echo "  - start-lms-fixed.sh (Starts full LMS with fixed ports)"
echo "  - start-frontend-fixed.sh (Starts frontend only with fixed port)"
