#!/bin/bash

# Script to remove problematic configuration files
# Run with: bash scripts/clean-config.sh

echo "Cleaning up problematic configuration files..."

# Remove .babelrc if it exists
if [ -f ".babelrc" ]; then
  echo "Found .babelrc file. Removing..."
  rm .babelrc
  echo ".babelrc removed."
else
  echo ".babelrc not found, no action needed."
fi

# Clean Next.js cache
if [ -d ".next" ]; then
  echo "Cleaning Next.js cache..."
  rm -rf .next
  echo "Next.js cache cleaned."
fi

echo "Cleanup complete."
echo "Please restart your development server with: npm run dev"
