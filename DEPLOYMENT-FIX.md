# Deployment Fix for API Key Issues

## Problem
The Google Translate API is not working on the live server because:
1. `config.js` file is returning 404 (not found on server)
2. Icon references to non-existent files are causing browser errors

## Solutions Implemented

### 1. Fixed Icon References
- ✅ Updated structured data screenshot URL from `icons/og-image.png` to `og-image.jpg`
- ✅ Simplified `browserconfig.xml` to remove icon references
- ✅ Manifest.json already uses `og-image.jpg` as fallback

### 2. Fixed API Key Loading
- ✅ Added fallback configuration directly in HTML before config.js script
- ✅ Added error handler to config.js script tag
- ✅ Improved envLoader.js and googleTranslate.js robustness
- ✅ API key now embedded as fallback in HTML, so translation works even if config.js is missing

## Deployment Instructions

### Option 1: Upload config.js (Recommended)
1. Upload the `config.js` file to the server root directory
2. Ensure the server can serve .js files (check MIME types)
3. Test that `https://nordisk.exlo.no/config.js` returns the content

### Option 2: Use Embedded Fallback (Current)
The API key is now embedded directly in the HTML as a fallback.
This means translation should work immediately without uploading config.js.

## Files Modified
- `index.html` - Added fallback config and error handler
- `js/googleTranslate.js` - Improved API key loading robustness
- `browserconfig.xml` - Removed icon references

## Testing
After deployment, test:
1. Translation functionality works
2. No 404 errors in browser console for icons
3. Google Translate API calls succeed

## Current Status
✅ **Ready to deploy** - Translation should work with embedded fallback API key
