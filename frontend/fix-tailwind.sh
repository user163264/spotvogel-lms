#!/bin/bash
# Script to fix Tailwind CSS configuration

echo "Removing existing Tailwind CSS packages..."
npm uninstall tailwindcss postcss autoprefixer

echo "Installing compatible versions of Tailwind CSS and related packages..."
npm install --save-dev tailwindcss@3.3.2 postcss@8.4.24 autoprefixer@10.4.14

echo "Configuration complete. Please restart the development server with:"
echo "npm run dev"
