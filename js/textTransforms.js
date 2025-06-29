/**
 * Text Transformation Module for Nordisk Tekstredigering
 * Handles various text transformations with Nordic language support
 * @author GitHub Copilot
 */

/**
 * Handles text transformations for Nordic languages
 */
export class TextTransforms {
    constructor() {
        this.initializeNamePatterns();
        this.initializeAbbreviations();
        this.initializeCompoundWordPatterns();
    }

    /**
     * Initialize common name patterns for proper capitalization
     */
    initializeNamePatterns() {
        this.namePatterns = [
            // Nordic names and places
            /\b(oslo|bergen|trondheim|stavanger|tromsø|kristiansand)\b/gi,
            /\b(stockholm|göteborg|malmö|uppsala|västerås|örebro)\b/gi,
            /\b(københavn|aarhus|odense|aalborg|esbjerg|randers)\b/gi,
            /\b(norge|sweden|sverige|danmark|denmark|norway)\b/gi,
            /\b(nordisk|skandinavisk|nordisk)\b/gi,
            // Common Nordic surnames
            /\b(hansen|johansen|olsen|larsen|andersen|pedersen|nielsen|jensen)\b/gi,
            /\b(andersson|johansson|karlsson|nilsson|eriksson|larsson|olsson)\b/gi,
            /\b(christensen|rasmussen|jørgensen|petersen|madsen|mortensen)\b/gi
        ];
    }

    /**
     * Initialize common abbreviations that should maintain their format
     */
    initializeAbbreviations() {
        this.abbreviations = [
            'AS', 'AB', 'ApS', 'A/S', 'ASA', 'BA', 'MA', 'PhD', 'Dr', 'Prof',
            'USA', 'UK', 'EU', 'UN', 'NATO', 'WHO', 'FIFA', 'UEFA',
            'TV', 'DVD', 'CD', 'PC', 'IT', 'GPS', 'SMS', 'MMS',
            'kr', 'NOK', 'SEK', 'DKK', 'EUR', 'USD',
            'AS', 'AB', 'ApS', 'A/S', 'ASA'  // Nordic company suffixes
        ];
    }

    /**
     * Initialize compound word patterns for Nordic languages
     */
    initializeCompoundWordPatterns() {
        this.compoundPatterns = {
            no: {
                separators: ['s', 'e', ''],
                commonPrefixes: ['fore', 'etter', 'over', 'under', 'sam', 'med'],
                commonSuffixes: ['ing', 'het', 'skap', 'dom', 'full', 'løs']
            },
            se: {
                separators: ['s', 'o', ''],
                commonPrefixes: ['för', 'efter', 'över', 'under', 'sam', 'med'],
                commonSuffixes: ['ning', 'het', 'skap', 'dom', 'full', 'lös']
            },
            dk: {
                separators: ['s', 'e', ''],
                commonPrefixes: ['for', 'efter', 'over', 'under', 'sam', 'med'],
                commonSuffixes: ['ing', 'hed', 'skab', 'dom', 'fuld', 'løs']
            }
        };
    }

    /**
     * Transform text to uppercase
     * @param {string} text - Text to transform
     * @returns {string} Uppercase text
     */
    toUpperCase(text) {
        return text.toUpperCase();
    }

    /**
     * Transform text to lowercase
     * @param {string} text - Text to transform
     * @returns {string} Lowercase text
     */
    toLowerCase(text) {
        return text.toLowerCase();
    }

    /**
     * Transform text to title case with intelligent capitalization
     * @param {string} text - Text to transform
     * @param {string} language - Language code for context
     * @returns {string} Title case text
     */
    toTitleCase(text, language = 'no') {
        // Words that should not be capitalized (except at start of sentence)
        const lowercaseWords = {
            no: ['og', 'eller', 'men', 'av', 'til', 'for', 'på', 'i', 'med', 'om', 'under', 'over'],
            se: ['och', 'eller', 'men', 'av', 'till', 'för', 'på', 'i', 'med', 'om', 'under', 'över'],
            dk: ['og', 'eller', 'men', 'af', 'til', 'for', 'på', 'i', 'med', 'om', 'under', 'over']
        };

        const exceptions = lowercaseWords[language] || lowercaseWords['no'];

        return text.replace(/\w\S*/g, (word, index) => {
            const cleanWord = word.toLowerCase();
            const isAbbreviation = this.abbreviations.some(abbr => 
                abbr.toLowerCase() === cleanWord
            );

            if (isAbbreviation) {
                return this.abbreviations.find(abbr => 
                    abbr.toLowerCase() === cleanWord
                );
            }

            // Always capitalize first word or word after sentence punctuation
            const isFirstWord = index === 0 || /[.!?]\s*$/.test(text.substring(0, index));
            
            if (isFirstWord || !exceptions.includes(cleanWord)) {
                return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
            }

            return cleanWord;
        });
    }

    /**
     * Clean text by removing excessive whitespace and normalizing formatting
     * @param {string} text - Text to clean
     * @returns {string} Cleaned text
     */
    cleanText(text) {
        return text
            // Replace multiple spaces with single space
            .replace(/[ \t]+/g, ' ')
            // Replace multiple line breaks with maximum two
            .replace(/\n\s*\n\s*\n+/g, '\n\n')
            // Remove trailing spaces from lines
            .replace(/[ \t]+$/gm, '')
            // Remove leading spaces from lines (except intentional indentation)
            .replace(/^[ \t]+/gm, '')
            // Trim overall
            .trim();
    }

    /**
     * Convert Nordic characters to ASCII equivalents
     * @param {string} text - Text to convert
     * @param {boolean} preserveCase - Whether to preserve original case
     * @returns {string} Converted text
     */
    convertNordicToAscii(text, preserveCase = true) {
        const conversions = {
            'æ': 'ae', 'ø': 'oe', 'å': 'aa',
            'Æ': preserveCase ? 'Ae' : 'ae',
            'Ø': preserveCase ? 'Oe' : 'oe',
            'Å': preserveCase ? 'Aa' : 'aa',
            'ä': 'ae', 'ö': 'oe',
            'Ä': preserveCase ? 'Ae' : 'ae',
            'Ö': preserveCase ? 'Oe' : 'oe'
        };

        return text.replace(/[æøåäöÆØÅÄÖ]/g, char => conversions[char] || char);
    }

    /**
     * Convert ASCII equivalents back to Nordic characters
     * @param {string} text - Text to convert
     * @param {string} language - Target language (no, se, dk)
     * @returns {string} Converted text
     */
    convertAsciiToNordic(text, language = 'no') {
        const conversions = {
            no: {
                'ae': 'æ', 'oe': 'ø', 'aa': 'å',
                'Ae': 'Æ', 'Oe': 'Ø', 'Aa': 'Å'
            },
            se: {
                'ae': 'ä', 'oe': 'ö', 'aa': 'å',
                'Ae': 'Ä', 'Oe': 'Ö', 'Aa': 'Å'
            },
            dk: {
                'ae': 'æ', 'oe': 'ø', 'aa': 'å',
                'Ae': 'Æ', 'Oe': 'Ø', 'Aa': 'Å'
            }
        };

        const langConversions = conversions[language] || conversions['no'];
        
        let result = text;
        Object.entries(langConversions).forEach(([ascii, nordic]) => {
            // Use word boundaries to avoid partial matches
            const regex = new RegExp(`\\b${ascii}\\b`, 'g');
            result = result.replace(regex, nordic);
        });

        return result;
    }

    /**
     * Remove hyphens from compound words
     * @param {string} text - Text to process
     * @param {string} language - Language code
     * @returns {string} Text with hyphens removed from compounds
     */
    removeCompoundHyphens(text, language = 'no') {
        const patterns = this.compoundPatterns[language] || this.compoundPatterns['no'];
        
        // Remove hyphens from likely compound words
        return text.replace(/(\w+)-(\w+)/g, (match, first, second) => {
            // Keep hyphens for short words (likely not compounds)
            if (first.length < 3 || second.length < 3) {
                return match;
            }
            
            // Keep hyphens for numbers
            if (/\d/.test(first) || /\d/.test(second)) {
                return match;
            }
            
            // Check if it looks like a compound word
            const isCompound = patterns.separators.some(sep => 
                first.endsWith(sep) || patterns.commonPrefixes.includes(first.toLowerCase())
            ) || patterns.commonSuffixes.some(suffix => 
                second.toLowerCase().endsWith(suffix)
            );
            
            return isCompound ? first + second : match;
        });
    }

    /**
     * Add hyphens to long compound words for better readability
     * @param {string} text - Text to process
     * @param {string} language - Language code
     * @returns {string} Text with hyphens added to long compounds
     */
    addCompoundHyphens(text, language = 'no') {
        const patterns = this.compoundPatterns[language] || this.compoundPatterns['no'];
        
        return text.replace(/\b\w{12,}\b/g, (word) => {
            // Skip if already has hyphens
            if (word.includes('-')) return word;
            
            // Try to split long words at logical points
            for (const separator of patterns.separators) {
                if (separator) {
                    const regex = new RegExp(`(\\w{4,})${separator}(\\w{4,})`, 'i');
                    if (regex.test(word)) {
                        return word.replace(regex, `$1${separator}-$2`);
                    }
                }
            }
            
            return word;
        });
    }

    /**
     * Normalize punctuation and spacing
     * @param {string} text - Text to normalize
     * @returns {string} Normalized text
     */
    normalizePunctuation(text) {
        return text
            // Fix spacing around punctuation
            .replace(/\s+([,.!?;:])/g, '$1')
            .replace(/([.!?])\s*([A-ZÆØÅÄÖ])/g, '$1 $2')
            .replace(/([,:;])\s*/g, '$1 ')
            // Fix quotation marks
            .replace(/\s*"\s*/g, '"')
            .replace(/\s*'\s*/g, "'")
            // Fix ellipsis
            .replace(/\.{3,}/g, '…')
            // Fix multiple punctuation
            .replace(/[!]{2,}/g, '!')
            .replace(/[?]{2,}/g, '?')
            // Normalize dashes
            .replace(/\s*--\s*/g, ' – ')
            .replace(/\s*-\s*/g, '-');
    }

    /**
     * Apply intelligent formatting based on content type
     * @param {string} text - Text to format
     * @param {string} type - Content type (email, address, phone, etc.)
     * @returns {string} Formatted text
     */
    formatSpecialContent(text, type) {
        switch (type) {
            case 'email':
                return text.toLowerCase().replace(/\s+/g, '');
            
            case 'phone':
                // Norwegian phone number formatting
                return text.replace(/\D/g, '').replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
            
            case 'address':
                return this.toTitleCase(text).replace(/\s+/g, ' ');
            
            case 'currency':
                return text.replace(/(\d)\s+(kr|kroner|øre)/gi, '$1 $2');
            
            default:
                return text;
        }
    }

    /**
     * Smart capitalization that preserves intentional formatting
     * @param {string} text - Text to capitalize
     * @param {string} language - Language code
     * @returns {string} Smart capitalized text
     */
    smartCapitalization(text, language = 'no') {
        let result = text;
        
        // Capitalize after sentence punctuation
        result = result.replace(/([.!?]\s+)([a-zæøåäö])/g, (match, punct, letter) => {
            return punct + letter.toUpperCase();
        });
        
        // Capitalize first letter of text
        result = result.replace(/^([a-zæøåäö])/, letter => letter.toUpperCase());
        
        // Capitalize proper names using patterns
        this.namePatterns.forEach(pattern => {
            result = result.replace(pattern, match => this.toTitleCase(match, language));
        });
        
        return result;
    }

    /**
     * Remove extra line breaks while preserving paragraph structure
     * @param {string} text - Text to process
     * @returns {string} Text with normalized line breaks
     */
    normalizeLineBreaks(text) {
        return text
            // Replace Windows line endings
            .replace(/\r\n/g, '\n')
            // Replace Mac line endings
            .replace(/\r/g, '\n')
            // Replace multiple line breaks with maximum two
            .replace(/\n{3,}/g, '\n\n')
            // Remove trailing line breaks
            .replace(/\n+$/, '');
    }

    /**
     * Apply all cleaning and normalization transforms
     * @param {string} text - Text to process
     * @param {string} language - Language code
     * @returns {string} Fully processed text
     */
    fullClean(text, language = 'no') {
        return this.normalizePunctuation(
            this.normalizeLineBreaks(
                this.cleanText(text)
            )
        );
    }

    /**
     * Get available transformations list
     * @returns {Array} Array of available transformation objects
     */
    getAvailableTransforms() {
        return [
            {
                id: 'uppercase',
                name: 'STORE BOKSTAVER',
                description: 'Konverterer all tekst til store bokstaver'
            },
            {
                id: 'lowercase',
                name: 'små bokstaver',
                description: 'Konverterer all tekst til små bokstaver'
            },
            {
                id: 'titlecase',
                name: 'Tittel Format',
                description: 'Intelligent kapitalisering av ord'
            },
            {
                id: 'clean',
                name: 'Rens Tekst',
                description: 'Fjerner ekstra mellomrom og normaliserer formatering'
            },
            {
                id: 'nordic-to-ascii',
                name: 'æ/ø/å → ae/oe/aa',
                description: 'Konverterer nordiske tegn til ASCII'
            },
            {
                id: 'ascii-to-nordic',
                name: 'ae/oe/aa → æ/ø/å',
                description: 'Konverterer ASCII tilbake til nordiske tegn'
            },
            {
                id: 'remove-hyphens',
                name: 'Fjern bindestreker',
                description: 'Fjerner bindestreker fra sammensatte ord'
            },
            {
                id: 'add-hyphens',
                name: 'Legg til bindestreker',
                description: 'Legger til bindestreker i lange sammensatte ord'
            },
            {
                id: 'normalize-punctuation',
                name: 'Normaliser tegnsetting',
                description: 'Fikser mellomrom og tegnsetting'
            },
            {
                id: 'full-clean',
                name: 'Full opprydding',
                description: 'Utfører all opprydding og normalisering'
            }
        ];
    }
}
