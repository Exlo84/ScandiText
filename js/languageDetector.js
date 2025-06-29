/**
 * Language Detection Module for Nordisk Tekstredigering
 * Detects Norwegian, Swedish, and Danish languages with confidence scoring
 * @author GitHub Copilot
 */

/**
 * Detects Nordic languages (Norwegian, Swedish, Danish) with confidence scoring
 */
export class LanguageDetector {
    constructor() {
        this.initializeWordLists();
        this.initializeCharacterPatterns();
        this.initializeEndingPatterns();
    }

    /**
     * Initialize common word lists for each language
     */
    initializeWordLists() {
        this.commonWords = {
            'no': [
                'og', 'i', 'det', 'til', 'en', 'er', 'som', 'på', 'med', 'av',
                'for', 'ikke', 'var', 'skal', 'kan', 'jeg', 'vi', 'du', 'har',
                'den', 'de', 'et', 'å', 'om', 'han', 'hun', 'men', 'eller',
                'også', 'bare', 'noe', 'alle', 'ingen', 'første', 'skulle',
                'måtte', 'kunne', 'ville', 'siden', 'etter', 'før', 'under'
            ],
            'se': [
                'och', 'i', 'det', 'till', 'en', 'är', 'som', 'på', 'med', 'av',
                'för', 'inte', 'var', 'ska', 'kan', 'jag', 'vi', 'du', 'har',
                'den', 'de', 'ett', 'att', 'om', 'han', 'hon', 'men', 'eller',
                'också', 'bara', 'något', 'alla', 'inga', 'första', 'skulle',
                'måste', 'kunde', 'ville', 'sedan', 'efter', 'före', 'under'
            ],
            'dk': [
                'og', 'i', 'det', 'til', 'en', 'er', 'som', 'på', 'med', 'af',
                'for', 'ikke', 'var', 'skal', 'kan', 'jeg', 'vi', 'du', 'har',
                'den', 'de', 'et', 'at', 'om', 'han', 'hun', 'men', 'eller',
                'også', 'bare', 'noget', 'alle', 'ingen', 'første', 'skulle',
                'måtte', 'kunne', 'ville', 'siden', 'efter', 'før', 'under'
            ]
        };

        // Language-specific words that are strong indicators
        this.uniqueWords = {
            'no': ['ikke', 'noe', 'skal', 'etter', 'jeg', 'hun', 'han'],
            'se': ['inte', 'något', 'ska', 'efter', 'jag', 'hon', 'han'],
            'dk': ['ikke', 'noget', 'skal', 'efter', 'jeg', 'hun', 'han', 'af']
        };
    }

    /**
     * Initialize character patterns specific to each language
     */
    initializeCharacterPatterns() {
        this.characterPatterns = {
            'no': {
                specific: ['æ', 'ø', 'å'],
                common: /[æøå]/g,
                weight: 1.5
            },
            'se': {
                specific: ['ä', 'ö', 'å'],
                common: /[äöå]/g,
                weight: 1.5
            },
            'dk': {
                specific: ['æ', 'ø', 'å'],
                common: /[æøå]/g,
                weight: 1.5
            }
        };
    }

    /**
     * Initialize word ending patterns for each language
     */
    initializeEndingPatterns() {
        this.endingPatterns = {
            'no': [
                /\w+ing$/, /\w+het$/, /\w+skap$/, /\w+else$/, /\w+ning$/,
                /\w+tion$/, /\w+sjon$/, /\w+dom$/, /\w+full$/
            ],
            'se': [
                /\w+ning$/, /\w+het$/, /\w+skap$/, /\w+else$/, /\w+tion$/,
                /\w+sion$/, /\w+dom$/, /\w+full$/, /\w+ligt$/
            ],
            'dk': [
                /\w+ing$/, /\w+hed$/, /\w+skab$/, /\w+else$/, /\w+ning$/,
                /\w+tion$/, /\w+sion$/, /\w+dom$/, /\w+fuld$/
            ]
        };
    }

    /**
     * Detects the language of the given text with confidence scoring
     * @param {string} text - Text to analyze
     * @returns {Object} Detection result with language, confidence, and scores
     */
    detect(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return {
                language: 'unknown',
                confidence: 0,
                scores: { no: 0, se: 0, dk: 0 },
                detectedLanguage: this.getLanguageLabel('unknown')
            };
        }

        const cleanText = text.toLowerCase().trim();
        const words = cleanText.split(/\s+/).filter(word => word.length > 0);
        
        if (words.length === 0) {
            return this.getUnknownResult();
        }

        const scores = {
            no: this.calculateLanguageScore(cleanText, words, 'no'),
            se: this.calculateLanguageScore(cleanText, words, 'se'),
            dk: this.calculateLanguageScore(cleanText, words, 'dk')
        };

        const detectedLanguage = this.determineLanguage(scores);
        const confidence = this.calculateConfidence(scores, detectedLanguage);

        return {
            language: detectedLanguage,
            confidence: Math.round(confidence),
            scores: {
                no: Math.round(scores.no),
                se: Math.round(scores.se),
                dk: Math.round(scores.dk)
            },
            detectedLanguage: this.getLanguageLabel(detectedLanguage)
        };
    }

    /**
     * Calculates language score for a specific language
     * @param {string} text - Clean text
     * @param {Array} words - Array of words
     * @param {string} language - Language code
     * @returns {number} Language score
     */
    calculateLanguageScore(text, words, language) {
        let score = 0;
        const totalWords = words.length;

        // Score based on common words
        const commonWordMatches = words.filter(word => 
            this.commonWords[language].includes(word.replace(/[^\w\u00C0-\u017F]/g, ''))
        ).length;
        score += (commonWordMatches / totalWords) * 40;

        // Score based on unique words (stronger indicators)
        const uniqueWordMatches = words.filter(word => 
            this.uniqueWords[language].includes(word.replace(/[^\w\u00C0-\u017F]/g, ''))
        ).length;
        score += uniqueWordMatches * 10;

        // Score based on character patterns
        const characterMatches = (text.match(this.characterPatterns[language].common) || []).length;
        const characterScore = (characterMatches / text.length) * 100 * this.characterPatterns[language].weight;
        score += characterScore;

        // Score based on word endings
        const endingMatches = words.filter(word => {
            const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
            return this.endingPatterns[language].some(pattern => pattern.test(cleanWord));
        }).length;
        score += (endingMatches / totalWords) * 20;

        // Penalty for conflicting character patterns
        if (language === 'no' || language === 'dk') {
            // Penalize if Swedish characters are found
            const swedishChars = (text.match(/[äö]/g) || []).length;
            score -= swedishChars * 5;
        } else if (language === 'se') {
            // Penalize if Norwegian/Danish characters are found
            const nordicChars = (text.match(/[æø]/g) || []).length;
            score -= nordicChars * 5;
        }

        return Math.max(0, score);
    }

    /**
     * Determines the most likely language based on scores
     * @param {Object} scores - Language scores
     * @returns {string} Detected language code
     */
    determineLanguage(scores) {
        const threshold = 5; // Minimum score difference to be confident
        const maxScore = Math.max(scores.no, scores.se, scores.dk);
        
        if (maxScore < 10) {
            return 'unknown';
        }

        if (scores.no === maxScore && scores.no - Math.max(scores.se, scores.dk) >= threshold) {
            return 'no';
        }
        if (scores.se === maxScore && scores.se - Math.max(scores.no, scores.dk) >= threshold) {
            return 'se';
        }
        if (scores.dk === maxScore && scores.dk - Math.max(scores.no, scores.se) >= threshold) {
            return 'dk';
        }

        // If scores are too close, default to Norwegian or return unknown
        return maxScore > 15 ? 'no' : 'unknown';
    }

    /**
     * Calculates confidence percentage
     * @param {Object} scores - Language scores
     * @param {string} detectedLanguage - Detected language
     * @returns {number} Confidence percentage
     */
    calculateConfidence(scores, detectedLanguage) {
        if (detectedLanguage === 'unknown') {
            return 0;
        }

        const maxScore = scores[detectedLanguage];
        const otherScores = Object.values(scores).filter(score => score !== maxScore);
        const secondBest = Math.max(...otherScores);
        
        if (secondBest === 0) {
            return 100;
        }

        // Confidence based on score difference
        const difference = maxScore - secondBest;
        const confidence = Math.min(100, (difference / maxScore) * 100 + 50);
        
        return Math.max(0, confidence);
    }

    /**
     * Returns unknown detection result
     * @returns {Object} Unknown result
     */
    getUnknownResult() {
        return {
            language: 'unknown',
            confidence: 0,
            scores: { no: 0, se: 0, dk: 0 },
            detectedLanguage: this.getLanguageLabel('unknown')
        };
    }

    /**
     * Gets human-readable language label
     * @param {string} languageCode - Language code
     * @returns {string} Language label
     */
    getLanguageLabel(languageCode) {
        const labels = {
            'no': 'Norsk',
            'se': 'Svenska',
            'dk': 'Dansk',
            'unknown': 'Ukjent'
        };
        return labels[languageCode] || 'Ukjent';
    }

    /**
     * Analyzes language patterns in detail
     * @param {string} text - Text to analyze
     * @returns {Object} Detailed analysis
     */
    analyzePatterns(text) {
        const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        const analysis = {
            no: { words: [], characters: [], endings: [] },
            se: { words: [], characters: [], endings: [] },
            dk: { words: [], characters: [], endings: [] }
        };

        // Analyze words
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
            
            Object.keys(this.commonWords).forEach(lang => {
                if (this.commonWords[lang].includes(cleanWord)) {
                    analysis[lang].words.push(cleanWord);
                }
            });
        });

        // Analyze character patterns
        Object.keys(this.characterPatterns).forEach(lang => {
            const matches = text.match(this.characterPatterns[lang].common) || [];
            analysis[lang].characters = matches;
        });

        // Analyze word endings
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
            Object.keys(this.endingPatterns).forEach(lang => {
                this.endingPatterns[lang].forEach(pattern => {
                    if (pattern.test(cleanWord)) {
                        analysis[lang].endings.push(cleanWord);
                    }
                });
            });
        });

        return analysis;
    }

    /**
     * Provides language learning hints based on detected patterns
     * @param {string} text - Text to analyze
     * @returns {Object} Learning hints
     */
    getLanguageHints(text) {
        const detection = this.detect(text);
        const patterns = this.analyzePatterns(text);
        
        const hints = {
            detected: detection.detectedLanguage,
            confidence: detection.confidence,
            suggestions: []
        };

        if (detection.confidence < 70) {
            hints.suggestions.push('Teksten er for kort eller inneholder for få språkspesifikke ord for sikker gjenkjenning.');
        }

        // Character usage hints
        const hasNorwegianDanish = /[æø]/.test(text);
        const hasSwedish = /[äö]/.test(text);
        
        if (hasNorwegianDanish && hasSwedish) {
            hints.suggestions.push('Teksten inneholder både norsk/dansk (æ, ø) og svenske (ä, ö) tegn.');
        }

        // Vocabulary hints
        if (patterns.no.words.length > 0 && patterns.se.words.length > 0) {
            hints.suggestions.push('Teksten inneholder ord fra både norsk og svensk.');
        }

        return hints;
    }
}
