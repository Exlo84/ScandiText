#!/bin/bash

# Build script for ScandiText
# Generates config.js from .env file for client-side usage

echo "🔧 Building ScandiText..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env from .env.example"
        echo "⚠️  Please update .env with your actual API keys"
    else
        echo "❌ No .env.example found either. Please create .env manually."
        exit 1
    fi
fi

# Generate config.js from .env
echo "📝 Generating config.js from .env..."

# Start the config.js file
cat > config.js << 'EOF'
// Application Configuration
// This file is generated from .env and should not be committed to version control
window.APP_CONFIG = {
EOF

# Parse .env and add to config.js
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ $key =~ ^[[:space:]]*# ]] || [[ -z "$key" ]]; then
        continue
    fi
    
    # Remove quotes from value if present
    value=$(echo "$value" | sed 's/^"//;s/"$//')
    
    # Add to config.js
    echo "    \"$key\": \"$value\"," >> config.js
done < .env

# Remove trailing comma and close the object
sed -i '$ s/,$//' config.js
echo "};" >> config.js

echo "✅ config.js generated successfully"
echo "⚠️  Remember: config.js contains sensitive data and should not be committed to version control"

# Verify the generated file
if [ -f "config.js" ]; then
    echo "📄 Generated config.js contents:"
    cat config.js
else
    echo "❌ Failed to generate config.js"
    exit 1
fi

echo "🎉 Build completed successfully!"
