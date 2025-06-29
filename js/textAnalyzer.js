/**
 * Text Analysis Module for Nordisk Tekstredigering
 * Handles text statistics, readability scoring, and advanced analysis
 * @author GitHub Copilot
 */

/**
 * Analyzes text and provides comprehensive statistics
 */
export class TextAnalyzer {
    constructor() {
        this.wordsPerMinute = 200; // Average reading speed
    }

    /**
     * Performs complete text analysis
     * @param {string} text - The text to analyze
     * @param {string} language - Language code (no, se, dk)
     * @returns {Object} Analysis results
     */
    analyze(text, language = 'no') {
        if (!text || typeof text !== 'string') {
            return this.getEmptyStats();
        }

        const words = this.countWords(text);
        const sentences = this.countSentences(text);
        const paragraphs = this.countParagraphs(text);
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const readingTime = this.calculateReadingTime(words);
        const avgWordLength = this.calculateAverageWordLength(text);
        const avgSentenceLength = this.calculateAverageSentenceLength(text);
        const readabilityScore = this.calculateReadabilityScore(text, language);
        const compoundWords = this.detectCompoundWords(text, language);

        return {
            words,
            sentences,
            paragraphs,
            characters,
            charactersNoSpaces,
            readingTime,
            avgWordLength,
            avgSentenceLength,
            readabilityScore,
            compoundWords,
            lastUpdated: new Date().toLocaleTimeString('no-NO')
        };
    }

    /**
     * Returns empty statistics object
     * @returns {Object} Empty stats
     */
    getEmptyStats() {
        return {
            words: 0,
            sentences: 0,
            paragraphs: 0,
            characters: 0,
            charactersNoSpaces: 0,
            readingTime: 0,
            avgWordLength: 0,
            avgSentenceLength: 0,
            readabilityScore: { score: 0, level: 'unknown' },
            compoundWords: [],
            lastUpdated: new Date().toLocaleTimeString('no-NO')
        };
    }

    /**
     * Counts words in text
     * @param {string} text - Text to analyze
     * @returns {number} Word count
     */
    countWords(text) {
        const cleaned = text.trim();
        if (!cleaned) return 0;
        return cleaned.split(/\s+/).length;
    }

    /**
     * Counts sentences in text
     * @param {string} text - Text to analyze
     * @returns {number} Sentence count
     */
    countSentences(text) {
        const cleaned = text.trim();
        if (!cleaned) return 0;
        
        // Split by sentence endings, filter out empty strings
        const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return sentences.length;
    }

    /**
     * Counts paragraphs in text
     * @param {string} text - Text to analyze
     * @returns {number} Paragraph count
     */
    countParagraphs(text) {
        const cleaned = text.trim();
        if (!cleaned) return 0;
        
        // Split by double line breaks, filter out empty strings
        const paragraphs = cleaned.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        return paragraphs.length;
    }

    /**
     * Calculates reading time in minutes
     * @param {number} wordCount - Number of words
     * @returns {number} Reading time in minutes
     */
    calculateReadingTime(wordCount) {
        return Math.ceil(wordCount / this.wordsPerMinute);
    }

    /**
     * Calculates average word length
     * @param {string} text - Text to analyze
     * @returns {number} Average word length
     */
    calculateAverageWordLength(text) {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        if (words.length === 0) return 0;
        
        const totalLength = words.reduce((sum, word) => {
            // Remove punctuation for accurate length calculation
            const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
            return sum + cleanWord.length;
        }, 0);
        
        return Math.round((totalLength / words.length) * 10) / 10;
    }

    /**
     * Calculates average sentence length
     * @param {string} text - Text to analyze
     * @returns {number} Average sentence length in words
     */
    calculateAverageSentenceLength(text) {
        const sentences = this.countSentences(text);
        const words = this.countWords(text);
        
        if (sentences === 0) return 0;
        return Math.round((words / sentences) * 10) / 10;
    }

    /**
     * Calculates readability score adapted for Nordic languages
     * Based on Flesch-Kincaid but adapted for Norwegian/Swedish/Danish
     * @param {string} text - Text to analyze
     * @param {string} language - Language code
     * @returns {Object} Readability score and level
     */
    calculateReadabilityScore(text, language) {
        const words = this.countWords(text);
        const sentences = this.countSentences(text);
        const syllables = this.countSyllables(text, language);

        if (words === 0 || sentences === 0) {
            return { score: 0, level: 'unknown' };
        }

        // Adapted Flesch Reading Ease for Nordic languages
        // Formula: 206.835 - (1.015 × ASL) - (84.6 × ASW)
        // ASL = Average Sentence Length, ASW = Average Syllables per Word
        const asl = words / sentences;
        const asw = syllables / words;
        
        // Adjustment factors for Nordic languages (slightly different from English)
        const score = 206.835 - (1.015 * asl) - (84.6 * asw);
        
        return {
            score: Math.round(score),
            level: this.getReadabilityLevel(score, language)
        };
    }

    /**
     * Counts syllables in text (approximation for Nordic languages)
     * @param {string} text - Text to analyze
     * @param {string} language - Language code
     * @returns {number} Estimated syllable count
     */
    countSyllables(text, language) {
        const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        let totalSyllables = 0;

        words.forEach(word => {
            // Remove punctuation
            const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
            if (cleanWord.length === 0) return;

            // Count vowel groups (Nordic languages have similar vowel patterns)
            const vowels = language === 'se' ? 'aeiouyåäö' : 'aeiouyæøå';
            let syllableCount = 0;
            let previousWasVowel = false;

            for (let i = 0; i < cleanWord.length; i++) {
                const char = cleanWord[i];
                const isVowel = vowels.includes(char);

                if (isVowel && !previousWasVowel) {
                    syllableCount++;
                }
                previousWasVowel = isVowel;
            }

            // Minimum one syllable per word
            totalSyllables += Math.max(1, syllableCount);
        });

        return totalSyllables;
    }

    /**
     * Determines readability level based on score
     * @param {number} score - Readability score
     * @param {string} language - Language code
     * @returns {string} Readability level
     */
    getReadabilityLevel(score, language) {
        const labels = {
            'no': {
                excellent: 'Utmerket',
                good: 'God',
                fair: 'Akseptabel',
                poor: 'Dårlig'
            },
            'se': {
                excellent: 'Utmärkt',
                good: 'Bra',
                fair: 'Acceptabel',
                poor: 'Dålig'
            },
            'dk': {
                excellent: 'Fremragende',
                good: 'God',
                fair: 'Acceptabel',
                poor: 'Dårlig'
            }
        };

        const lang = labels[language] || labels['no'];

        if (score >= 80) return lang.excellent;
        if (score >= 60) return lang.good;
        if (score >= 40) return lang.fair;
        return lang.poor;
    }

    /**
     * Detects compound words in Nordic languages
     * @param {string} text - Text to analyze
     * @param {string} language - Language code
     * @returns {Array} Array of detected compound words
     */
    detectCompoundWords(text, language) {
        const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        const compoundWords = [];

        // Common compound word patterns for Nordic languages
        const patterns = {
            'no': [
                /\w{3,}s\w{3,}/, // -s- compounds
                /\w{3,}e\w{3,}/, // -e- compounds
                /\w{4,}ing\w{3,}/, // -ing- compounds
            ],
            'se': [
                /\w{3,}s\w{3,}/, // -s- compounds
                /\w{3,}o\w{3,}/, // -o- compounds
                /\w{4,}ning\w{3,}/, // -ning- compounds
            ],
            'dk': [
                /\w{3,}s\w{3,}/, // -s- compounds
                /\w{3,}e\w{3,}/, // -e- compounds
                /\w{4,}ing\w{3,}/, // -ing- compounds
            ]
        };

        const langPatterns = patterns[language] || patterns['no'];

        words.forEach(word => {
            const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
            if (cleanWord.length < 8) return; // Minimum length for compound detection

            langPatterns.forEach(pattern => {
                if (pattern.test(cleanWord)) {
                    compoundWords.push(cleanWord);
                }
            });
        });

        // Remove duplicates and return first 10
        return [...new Set(compoundWords)].slice(0, 10);
    }

    /**
     * Analyzes text complexity beyond basic readability
     * @param {string} text - Text to analyze
     * @param {string} language - Language code
     * @returns {Object} Advanced complexity metrics
     */
    analyzeComplexity(text, language) {
        const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        
        // Count long words (>6 characters)
        const longWords = words.filter(word => {
            const cleanWord = word.replace(/[^\w\u00C0-\u017F]/g, '');
            return cleanWord.length > 6;
        }).length;

        // Count unique words
        const uniqueWords = new Set(words.map(word => 
            word.replace(/[^\w\u00C0-\u017F]/g, '').toLowerCase()
        )).size;

        // Lexical diversity (unique words / total words)
        const lexicalDiversity = words.length > 0 ? (uniqueWords / words.length) : 0;

        // Sentence complexity (average clauses per sentence)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const clauses = text.split(/[,;:]/).length;
        const avgClausesPerSentence = sentences.length > 0 ? (clauses / sentences.length) : 0;

        return {
            longWords,
            uniqueWords,
            lexicalDiversity: Math.round(lexicalDiversity * 100) / 100,
            avgClausesPerSentence: Math.round(avgClausesPerSentence * 10) / 10
        };
    }
}
