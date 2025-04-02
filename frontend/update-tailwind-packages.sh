#!/bin/bash
# Script to install a compatible version of Tailwind CSS and related packages

echo "Removing existing Tailwind CSS packages..."
npm uninstall tailwindcss postcss autoprefixer

echo "Installing compatible versions of Tailwind CSS and related packages..."
npm install --save-dev tailwindcss@3.3.2 postcss@8.4.24 autoprefixer@10.4.14 @tailwindcss/postcss@0.1.1

echo "Updating PostCSS configuration..."
# This will be done manually if needed

echo "Installation complete. Please restart the development server."
