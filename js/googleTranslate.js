/**
 * Google Translate Module for Nordisk Tekstredigering
 * Handles translation between Nordic languages using Google Translate API
 */

import { envLoader } from './envLoader.js';

export class GoogleTranslate {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
        this.supportedLanguages = {
            'no': 'nb',  // Norwegian Bokmål
            'se': 'sv',  // Swedish
            'dk': 'da'   // Danish
        };
        this.cache = new Map(); // Simple translation cache
        this.isInitialized = false;
        this.initializationPromise = null; // To prevent multiple simultaneous initializations
    }

    /**
     * Initialize the Google Translate service
     * Loads API key from environment configuration
     */
    async initialize() {
        // Prevent multiple simultaneous initializations
        if (this.initializationPromise) {
            return await this.initializationPromise;
        }
        
        if (this.isInitialized) {
            return true;
        }

        this.initializationPromise = this._doInitialize();
        const result = await this.initializationPromise;
        this.initializationPromise = null;
        return result;
    }

    async _doInitialize() {
        try {
            // Wait a bit to ensure window.APP_CONFIG is fully loaded
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Try direct access to window.APP_CONFIG first
            if (window.APP_CONFIG && window.APP_CONFIG.GOOGLE_TRANSLATE_API_KEY) {
                this.apiKey = window.APP_CONFIG.GOOGLE_TRANSLATE_API_KEY;
            } else {
                // Fallback to envLoader
                const config = await envLoader.load();
                this.apiKey = envLoader.get('GOOGLE_TRANSLATE_API_KEY');
            }
            
            if (!this.apiKey || this.apiKey === 'null') {
                console.warn('⚠️ Google Translate API key not configured - translation disabled');
                this.isInitialized = false;
                return false;
            }
            
            console.log('✅ Google Translate initialized successfully');
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize Google Translate:', error.message);
            this.isInitialized = false;
            return false;
        }
    }

    /**
     * Translate text to target language
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code (no, se, dk)
     * @param {string} sourceLang - Source language code (optional, auto-detect if not provided)
     * @returns {Promise<Object>} Translation result
     */
    async translateText(text, targetLang, sourceLang = null) {
        // Always re-check initialization before translation
        if (!this.isInitialized || !this.apiKey) {
            await this.initialize();
        }

        if (!text || !text.trim()) {
            throw new Error('Ingen tekst å oversette');
        }

        if (!this.supportedLanguages[targetLang]) {
            throw new Error(`Språket "${targetLang}" støttes ikke`);
        }

        // Double-check API key right before making the request
        let currentApiKey = this.apiKey;
        if (!currentApiKey && window.APP_CONFIG && window.APP_CONFIG.GOOGLE_TRANSLATE_API_KEY) {
            currentApiKey = window.APP_CONFIG.GOOGLE_TRANSLATE_API_KEY;
            this.apiKey = currentApiKey;
        }

        if (!currentApiKey) {
            throw new Error('Google Translate API key ikke konfigurert');
        }

        // Check cache first
        const cacheKey = `${text}_${sourceLang || 'auto'}_${targetLang}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const params = new URLSearchParams({
                key: currentApiKey,
                q: text,
                target: this.supportedLanguages[targetLang],
                format: 'text'
            });

            if (sourceLang && this.supportedLanguages[sourceLang]) {
                params.append('source', this.supportedLanguages[sourceLang]);
            }

            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Oversettingsfeil: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.data || !data.data.translations || !data.data.translations[0]) {
                throw new Error('Ugyldig respons fra oversettingstjenesten');
            }

            const translation = data.data.translations[0];
            const result = {
                originalText: text,
                translatedText: translation.translatedText,
                sourceLang: this.getLanguageCode(translation.detectedSourceLanguage) || sourceLang,
                targetLang: targetLang,
                confidence: 1.0 // Google Translate doesn't provide confidence scores
            };

            // Cache the result
            this.cache.set(cacheKey, result);
            
            return result;

        } catch (error) {
            console.error('Translation error:', error);
            throw new Error(`Oversettelse mislyktes: ${error.message}`);
        }
    }

    /**
     * Batch translate multiple texts
     * @param {Array<string>} texts - Array of texts to translate
     * @param {string} targetLang - Target language code
     * @param {string} sourceLang - Source language code (optional)
     * @returns {Promise<Array>} Array of translation results
     */
    async batchTranslate(texts, targetLang, sourceLang = null) {
        // Ensure API is initialized
        await this.initialize();

        if (!Array.isArray(texts) || texts.length === 0) {
            throw new Error('Ingen tekster å oversette');
        }

        // Filter out empty texts
        const validTexts = texts.filter(text => text && text.trim());
        if (validTexts.length === 0) {
            throw new Error('Ingen gyldige tekster å oversette');
        }

        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                target: this.supportedLanguages[targetLang],
                format: 'text'
            });

            // Add all texts as separate q parameters
            validTexts.forEach(text => {
                params.append('q', text);
            });

            if (sourceLang && this.supportedLanguages[sourceLang]) {
                params.append('source', this.supportedLanguages[sourceLang]);
            }

            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Batch oversettingsfeil: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.data || !data.data.translations) {
                throw new Error('Ugyldig respons fra oversettingstjenesten');
            }

            return data.data.translations.map((translation, index) => ({
                originalText: validTexts[index],
                translatedText: translation.translatedText,
                sourceLang: this.getLanguageCode(translation.detectedSourceLanguage) || sourceLang,
                targetLang: targetLang,
                confidence: 1.0
            }));

        } catch (error) {
            console.error('Batch translation error:', error);
            throw new Error(`Batch oversettelse mislyktes: ${error.message}`);
        }
    }

    /**
     * Detect language of text
     * @param {string} text - Text to analyze
     * @returns {Promise<Object>} Language detection result
     */
    async detectLanguage(text) {
        // Ensure API is initialized
        await this.initialize();

        if (!text || !text.trim()) {
            throw new Error('Ingen tekst å analysere');
        }

        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                q: text
            });

            const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Språkdeteksjonsfeil: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.data || !data.data.detections || !data.data.detections[0]) {
                throw new Error('Ugyldig respons fra språkdeteksjonstjenesten');
            }

            const detection = data.data.detections[0][0];
            return {
                language: this.getLanguageCode(detection.language),
                confidence: detection.confidence || 0.5,
                isReliable: detection.isReliable || false
            };

        } catch (error) {
            console.error('Language detection error:', error);
            throw new Error(`Språkdeteksjon mislyktes: ${error.message}`);
        }
    }

    /**
     * Convert Google language code to our internal codes
     * @param {string} googleCode - Google language code
     * @returns {string} Internal language code
     */
    getLanguageCode(googleCode) {
        const mapping = {
            'nb': 'no',
            'no': 'no',
            'sv': 'se',
            'da': 'dk'
        };
        return mapping[googleCode] || null;
    }

    /**
     * Get language name for display
     * @param {string} code - Language code
     * @returns {string} Language name
     */
    getLanguageName(code) {
        const names = {
            'no': 'Norsk',
            'se': 'Svenska',
            'dk': 'Dansk'
        };
        return names[code] || code;
    }

    /**
     * Check if translation is available
     * @returns {boolean} True if API key is configured
     */
    isAvailable() {
        return this.isInitialized && !!this.apiKey;
    }

    /**
     * Clear translation cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: 100 // Simple limit
        };
    }
}
