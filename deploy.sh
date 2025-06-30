#!/bin/bash

# Deploy script for Nordisk Tekstredigering
# Uploads essential files to fix API and icon issues

echo "🚀 Deploying fixes for Nordisk Tekstredigering..."

# Check if config.js exists
if [ ! -f "config.js" ]; then
    echo "❌ config.js not found! Creating from .env..."
    if [ -f ".env" ]; then
        # Create config.js from .env
        echo "// Application Configuration" > config.js
        echo "// This file is generated from .env" >> config.js
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

echo "📁 Files to upload:"
echo "  - index.html (updated with fallback config)"
echo "  - config.js (API key configuration)"
echo "  - js/googleTranslate.js (improved error handling)"
echo "  - js/envLoader.js (robust config loading)"
echo "  - browserconfig.xml (fixed icon references)"
echo "  - og-image.jpg (social media image)"

echo ""
echo "🔧 Manual upload instructions:"
echo "1. Upload all files listed above to your server"
echo "2. Ensure config.js is accessible at https://nordisk.exlo.no/config.js"
echo "3. Test translation functionality"
echo ""
echo "🆘 If config.js still returns 404:"
echo "   Don't worry! The fallback configuration in index.html will work."

echo "✅ Deployment preparation complete!"
