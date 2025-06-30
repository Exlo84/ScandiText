/**
 * Environment Configuration Loader
 * Loads configuration from .env file for client-side usage
 */

class EnvLoader {
    constructor() {
        this.config = {};
        this.isLoaded = false;
    }

    /**
     * Load environment configuration
     * For client-side apps, we'll use a different approach since we can't read .env directly
     */
    async load() {
        if (this.isLoaded) {
            return this.config;
        }

        try {
            // First check if config is already loaded in window.APP_CONFIG
            if (window.APP_CONFIG) {
                this.config = window.APP_CONFIG;
                console.log('✅ Config loaded from window.APP_CONFIG');
                this.isLoaded = true;
                return this.config;
            }

            // Try to load from a config.js file that should be created on the server
            const response = await fetch('./config.js');
            if (response.ok) {
                const configText = await response.text();
                // Extract the config object from the JavaScript file
                const configMatch = configText.match(/window\.APP_CONFIG\s*=\s*({[^}]+})/);
                if (configMatch) {
                    this.config = JSON.parse(configMatch[1]);
                    console.log('✅ Config loaded successfully from config.js');
                }
            }
        } catch (error) {
            console.warn('Could not load config.js, using fallback configuration');
        }

        // Fallback: check for environment variables in the global scope
        if (!this.config.GOOGLE_TRANSLATE_API_KEY) {
            this.config = {
                GOOGLE_TRANSLATE_API_KEY: window.GOOGLE_TRANSLATE_API_KEY || window.APP_CONFIG?.GOOGLE_TRANSLATE_API_KEY || null,
                NODE_ENV: window.NODE_ENV || window.APP_CONFIG?.NODE_ENV || 'development'
            };
            console.log('📋 Using fallback configuration:', { 
                hasApiKey: !!this.config.GOOGLE_TRANSLATE_API_KEY,
                nodeEnv: this.config.NODE_ENV 
            });
        }

        this.isLoaded = true;
        return this.config;
    }

    /**
     * Get configuration value
     * @param {string} key - Configuration key
     * @param {string} defaultValue - Default value if key not found
     * @returns {string} Configuration value
     */
    get(key, defaultValue = null) {
        if (!this.isLoaded) {
            console.warn('Environment not loaded yet. Call load() first.');
            return defaultValue;
        }
        return this.config[key] || defaultValue;
    }
}

export const envLoader = new EnvLoader();
