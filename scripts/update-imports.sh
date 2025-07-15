#!/bin/bash

# Script to update import paths for Next.js project structure refactoring

echo "Updating import paths from old aliases to @/* pattern..."

# Cross-platform sed function
# Uses temp file for portability between macOS and Linux
portable_sed() {
    local pattern="$1"
    local file="$2"
    sed "$pattern" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
}

# Update @components/* to @/components/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
    portable_sed 's/@components\//@\/components\//g' "$file"
done

# Update @lib/* to @/utils/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
    portable_sed 's/@lib\//@\/utils\//g' "$file"
done

# Update @hooks/* to @/hooks/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
    portable_sed 's/@hooks\//@\/hooks\//g' "$file"
done

# Update @contexts/* to @/contexts/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
    portable_sed 's/@contexts\//@\/contexts\//g' "$file"
done

# Also update files in __tests__ directories
find __tests__ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
    portable_sed 's/@components\//@\/components\//g' "$file"
    portable_sed 's/@lib\//@\/utils\//g' "$file"
    portable_sed 's/@hooks\//@\/hooks\//g' "$file"
    portable_sed 's/@contexts\//@\/contexts\//g' "$file"
done

echo "Import path updates completed."
