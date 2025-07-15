#!/bin/bash

# Script to update import paths for Next.js project structure refactoring

echo "Updating import paths from old aliases to @/* pattern..."

# Update @components/* to @/components/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@components\//@\/components\//g'

# Update @lib/* to @/utils/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@lib\//@\/utils\//g'

# Update @hooks/* to @/hooks/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@hooks\//@\/hooks\//g'

# Update @contexts/* to @/contexts/*
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@contexts\//@\/contexts\//g'

# Also update files in __tests__ directories
find __tests__ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@components\//@\/components\//g'
find __tests__ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@lib\//@\/utils\//g'
find __tests__ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@hooks\//@\/hooks\//g'
find __tests__ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/@contexts\//@\/contexts\//g'

echo "Import path updates completed."
