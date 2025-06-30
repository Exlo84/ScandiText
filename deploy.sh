#!/bin/bash

# Deploy script for Nordisk Tekstredigering
# Secure deployment that keeps API keys out of public code

echo "🚀 Deploying Nordisk Tekstredigering..."

# Check if config.js exists
if [ ! -f "config.js" ]; then
    echo "❌ config.js not found! Creating from .env..."
    if [ -f ".env" ]; then
        # Create config.js from .env
        echo "// Application Configuration" > config.js
        echo "// This file is generated from .env and should not be committed to git" >> config.js
        echo "window.APP_CONFIG = {" >> config.js
        
        # Extract API key from .env
        API_KEY=$(grep "GOOGLE_TRANSLATE_API_KEY=" .env | cut -d'=' -f2)
        NODE_ENV=$(grep "NODE_ENV=" .env | cut -d'=' -f2 | sed 's/development/production/')
        
        echo "    \"GOOGLE_TRANSLATE_API_KEY\": \"$API_KEY\"," >> config.js
        echo "    \"NODE_ENV\": \"${NODE_ENV:-production}\"" >> config.js
        echo "};" >> config.js
        echo "✅ config.js created from .env"
    else
        echo "❌ .env file not found! Cannot create config.js"
        exit 1
    fi
fi

echo ""
echo "� SECURITY REMINDER:"
echo "  - config.js contains sensitive API keys"
echo "  - Upload config.js separately to server (not via git)"
echo "  - Ensure config.js is in .gitignore"
echo ""

echo "�📁 Files to upload:"
echo "  - index.html (secure version without embedded keys)"
echo "  - config.js (upload separately - contains API key)"
echo "  - js/googleTranslate.js (improved error handling)"
echo "  - js/envLoader.js (secure config loading)"
echo "  - browserconfig.xml (fixed icon references)"
echo "  - og-image.jpg (social media image)"

echo ""
echo "🔧 Manual upload instructions:"
echo "1. Upload all files listed above to your server"
echo "2. Ensure config.js is accessible at https://nordisk.exlo.no/config.js"
echo "3. Test translation functionality"
echo ""
echo "⚠️  IMPORTANT: Never commit config.js to git repository!"

echo "✅ Secure deployment preparation complete!"
