/**
 * Social Media Formatter for ScandiText
 * Optimizes content for different social media platforms
 * @author GitHub Copilot
 */

import { i18n } from '../i18n.js';

export class SocialFormatter {
    constructor() {
        this.app = null; // Will be set by ToolManager
        this.i18n = new i18n(); // Initialize i18n
        this.currentPlatform = 'linkedin';
        this.textArea = null;
        this.outputArea = null;
        this.charCountElement = null;
        this.charLimitElement = null;
        this.platformTitleElement = null;
        this.copyButton = null;
        
        // Platform configurations
        this.platforms = {
            linkedin: {
                name: 'LinkedIn',
                icon: '💼',
                charLimit: 3000,
                maxHashtags: 30,
                bestPractices: [
                    'Bruk profesjonell tone',
                    'Start med en engasjerende hook',
                    'Inkluder relevante hashtags',
                    'Legg til spørsmål for å øke engasjement'
                ],
                formatting: {
                    addLineBreaks: true,
                    emphasizeBold: true,
                    suggestHashtags: true
                }
            },
            instagram: {
                name: 'Instagram',
                icon: '📸',
                charLimit: 2200,
                maxHashtags: 30,
                bestPractices: [
                    'Visuelt fokusert innhold',
                    'Bruk mange relevante hashtags',
                    'Fortell en historie',
                    'Inkluder call-to-action'
                ],
                formatting: {
                    addLineBreaks: true,
                    emphasizeBold: false,
                    suggestHashtags: true,
                    hashtagFocus: true
                }
            },
            facebook: {
                name: 'Facebook',
                icon: '👍',
                charLimit: 63206,
                maxHashtags: 10,
                bestPractices: [
                    'Engasjerende og personlig tone',
                    'Bruk få, men relevante hashtags',
                    'Still spørsmål til publikum',
                    'Optimaliser for diskusjon'
                ],
                formatting: {
                    addLineBreaks: true,
                    emphasizeBold: false,
                    suggestHashtags: true
                }
            },
            twitter: {
                name: 'Twitter/X',
                icon: '🐦',
                charLimit: 280,
                maxHashtags: 5,
                bestPractices: [
                    'Vær konsis og presis',
                    'Bruk få hashtags',
                    'Inkluder mentions når relevant',
                    'Optimaliser for retweets'
                ],
                formatting: {
                    addLineBreaks: false,
                    emphasizeBold: false,
                    suggestHashtags: true,
                    concise: true
                }
            }
        };
        
        // Nordic hashtag suggestions by language
        this.hashtagSuggestions = {
            no: {
                business: ['#norskbedrift', '#skandinavisk', '#nordiskarbeidsliv', '#innovation', '#entreprenørskap'],
                tech: ['#teknologi', '#digitalisering', '#AI', '#innovation', '#nordisktech'],
                culture: ['#norskkultur', '#skandinavisk', '#hygge', '#janteloven', '#nordisketradisjoner'],
                nature: ['#norgeinnordre', '#skandinavisknatur', '#friluftsliv', '#allemannsretten'],
                food: ['#norskmat', '#skandinaviskmat', '#hyggemat', '#lokalmat'],
                travel: ['#visitnorway', '#visitscandinavia', '#nordiskereise', '#friluftsliv'],
                lifestyle: ['#nordisklivsstil', '#hygge', '#lagom', '#bærekraft', '#miljøbevisst']
            },
            se: {
                business: ['#svenskföretag', '#skandinavisk', '#nordiskarbetsliv', '#innovation', '#entreprenörskap'],
                tech: ['#teknik', '#digitalisering', '#AI', '#innovation', '#nordisktech'],
                culture: ['#svenskkultur', '#skandinavisk', '#hygge', '#jantelagen', '#nordiskatraditioner'],
                nature: ['#visitsweden', '#skandinavisknatur', '#allemansrätten', '#friluftsliv'],
                food: ['#svenskmat', '#skandinaviskmat', '#fika', '#lokalmat'],
                travel: ['#visitsweden', '#visitscandinavia', '#nordiskaresa', '#äventyr'],
                lifestyle: ['#nordisklivsstil', '#lagom', '#hygge', '#hållbarhet', '#miljömedvetenhet']
            },
            da: {
                business: ['#danskvirksomhed', '#skandinavisk', '#nordiskarbejdsliv', '#innovation', '#iværksætteri'],
                tech: ['#teknologi', '#digitalisering', '#AI', '#innovation', '#nordisktech'],
                culture: ['#danskkultur', '#skandinavisk', '#hygge', '#janteloven', '#nordisketraditioner'],
                nature: ['#visitdenmark', '#skandinavisknatur', '#allemansret', '#friluftsliv'],
                food: ['#danskmad', '#skandinaviskmad', '#hyggemad', '#lokalmad'],
                travel: ['#visitdenmark', '#visitscandinavia', '#nordiskrejse', '#eventyr'],
                lifestyle: ['#nordisklivsstil', '#hygge', '#lagom', '#bæredygtighed', '#miljøbevidst']
            }
        };
    }
    
    /**
     * Initialize social media formatter
     */
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.updatePlatform('linkedin');
        console.log('SocialFormatter initialized');
    }
    
    /**
     * Setup DOM elements
     */
    setupElements() {
        this.textArea = document.getElementById('social-text');
        this.outputArea = document.getElementById('formatted-output');
        this.charCountElement = document.getElementById('char-count');
        this.charLimitElement = document.getElementById('char-limit');
        this.platformTitleElement = document.getElementById('platform-title');
        this.copyButton = document.getElementById('copy-formatted-btn');
        
        if (!this.textArea || !this.outputArea) {
            console.error('Social formatter elements not found');
            return;
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Platform selection buttons
        document.querySelectorAll('.platform-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.dataset.platform;
                this.updatePlatform(platform);
            });
        });
        
        // Text input
        this.textArea.addEventListener('input', () => {
            this.formatText();
        });
        
        // Copy formatted text
        this.copyButton.addEventListener('click', () => {
            this.copyFormattedText();
        });
        
        // Language change updates
        document.addEventListener('languageChanged', () => {
            this.updateUI();
        });
    }
    
    /**
     * Update platform and reformat content
     */
    updatePlatform(platform) {
        if (!this.platforms[platform]) return;
        
        this.currentPlatform = platform;
        
        // Update active button
        document.querySelectorAll('.platform-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.platform === platform) {
                btn.classList.add('active');
            }
        });
        
        // Update UI
        this.updateUI();
        this.formatText();
    }
    
    /**
     * Update UI based on current platform and language
     */
    updateUI() {
        const platform = this.platforms[this.currentPlatform];
        const currentLang = this.app?.currentLanguage || 'no';
        
        // Update i18n language
        this.i18n.setLanguage(currentLang);
        
        // Update platform title
        this.platformTitleElement.textContent = `${platform.icon} ${platform.name}-optimalisering`;
        
        // Update character limit
        this.charLimitElement.textContent = platform.charLimit;
        
        // Update placeholder text
        this.textArea.placeholder = this.i18n.t('socialTextPlaceholder');
        
        // Update copy button text
        this.copyButton.textContent = this.i18n.t('copyFormattedText');
    }
    
    /**
     * Format text based on current platform
     */
    formatText() {
        const text = this.textArea.value;
        const platform = this.platforms[this.currentPlatform];
        
        if (!text.trim()) {
            this.showPlaceholder();
            this.updateCharCount(0);
            return;
        }
        
        let formattedText = text;
        
        // Apply platform-specific formatting
        if (platform.formatting.addLineBreaks) {
            formattedText = this.addOptimalLineBreaks(formattedText);
        }
        
        if (platform.formatting.emphasizeBold) {
            formattedText = this.addLinkedInFormatting(formattedText);
        }
        
        if (platform.formatting.suggestHashtags) {
            formattedText = this.addHashtagSuggestions(formattedText, platform);
        }
        
        if (platform.formatting.concise && formattedText.length > platform.charLimit) {
            formattedText = this.makeTextConcise(formattedText, platform.charLimit);
        }
        
        // Update output
        this.outputArea.innerHTML = `
            <div class="formatted-content">
                <div class="content-body">${this.formatForDisplay(formattedText)}</div>
                ${this.generateBestPractices(platform)}
            </div>
        `;
        
        this.updateCharCount(formattedText.length);
    }
    
    /**
     * Add optimal line breaks for readability
     */
    addOptimalLineBreaks(text) {
        // Split into paragraphs and add spacing
        const paragraphs = text.split('\n').filter(p => p.trim());
        return paragraphs.map(para => {
            // Add line break after sentences for better readability
            if (para.length > 100) {
                return para.replace(/([.!?])\s+/g, '$1\n\n');
            }
            return para;
        }).join('\n\n');
    }
    
    /**
     * Add LinkedIn-specific formatting (bold for key points)
     */
    addLinkedInFormatting(text) {
        // Detect key points and make them bold
        return text.replace(/^([A-ZÆØÅ][^.!?]*:)/gm, '**$1**');
    }
    
    /**
     * Add relevant hashtag suggestions
     */
    addHashtagSuggestions(text, platform) {
        const suggestions = this.generateHashtagSuggestions(text);
        if (suggestions.length === 0) return text;
        
        const maxHashtags = Math.min(suggestions.length, platform.maxHashtags, 10);
        const selectedTags = suggestions.slice(0, maxHashtags);
        
        return text + '\n\n' + selectedTags.join(' ');
    }
    
    /**
     * Generate hashtag suggestions based on content
     */
    generateHashtagSuggestions(text) {
        const lowerText = text.toLowerCase();
        const suggestions = new Set();
        const currentLanguage = this.i18n.getCurrentLanguage() || 'no';
        
        // Get hashtags for current language
        const languageHashtags = this.hashtagSuggestions[currentLanguage] || this.hashtagSuggestions.no;
        
        // Analyze content for relevant categories
        Object.entries(languageHashtags).forEach(([category, tags]) => {
            const categoryKeywords = {
                business: [
                    // Norwegian
                    'bedrift', 'forretning', 'arbeid', 'jobb', 'karriere', 'lederskap',
                    // Swedish
                    'företag', 'business', 'arbete', 'jobb', 'karriär', 'ledarskap',
                    // Danish
                    'virksomhed', 'forretning', 'arbejde', 'job', 'karriere', 'lederskab'
                ],
                tech: [
                    // Norwegian
                    'teknologi', 'digital', 'data', 'AI', 'app', 'software',
                    // Swedish
                    'teknik', 'digital', 'data', 'AI', 'app', 'mjukvara',
                    // Danish
                    'teknologi', 'digital', 'data', 'AI', 'app', 'software'
                ],
                culture: [
                    // Norwegian
                    'kultur', 'tradisjon', 'historie', 'samfunn',
                    // Swedish
                    'kultur', 'tradition', 'historia', 'samhälle',
                    // Danish
                    'kultur', 'tradition', 'historie', 'samfund'
                ],
                nature: [
                    // Norwegian
                    'natur', 'fjell', 'skog', 'hav', 'friluft',
                    // Swedish
                    'natur', 'fjäll', 'skog', 'hav', 'friluft',
                    // Danish
                    'natur', 'bjerg', 'skov', 'hav', 'friluft'
                ],
                food: [
                    // Norwegian
                    'mat', 'oppskrift', 'kokk', 'restaurant', 'fisk', 'sjømat',
                    // Swedish
                    'mat', 'recept', 'kock', 'restaurang', 'fisk', 'skaldjur', 'fisksoppa', 'räkor',
                    // Danish
                    'mad', 'opskrift', 'kok', 'restaurant', 'fisk', 'skaldyr'
                ],
                travel: [
                    // Norwegian
                    'reise', 'ferie', 'besøk', 'tur',
                    // Swedish
                    'resa', 'semester', 'besök', 'tur',
                    // Danish
                    'rejse', 'ferie', 'besøg', 'tur'
                ],
                lifestyle: [
                    // Norwegian
                    'livsstil', 'helse', 'miljø', 'bærekraft',
                    // Swedish
                    'livsstil', 'hälsa', 'miljö', 'hållbarhet',
                    // Danish
                    'livsstil', 'sundhed', 'miljø', 'bæredygtighed'
                ]
            };
            
            const keywords = categoryKeywords[category] || [];
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                tags.forEach(tag => suggestions.add(tag));
            }
        });
        
        return Array.from(suggestions);
    }
    
    /**
     * Make text more concise for character limits
     */
    makeTextConcise(text, limit) {
        if (text.length <= limit) return text;
        
        // Try to cut at sentence boundaries
        const sentences = text.split(/[.!?]+/);
        let result = '';
        
        for (const sentence of sentences) {
            if ((result + sentence + '.').length > limit - 10) break;
            result += sentence + '.';
        }
        
        return result.trim() || text.substring(0, limit - 3) + '...';
    }
    
    /**
     * Format text for display with HTML
     */
    formatForDisplay(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
    }
    
    /**
     * Generate best practices tips for current platform
     */
    generateBestPractices(platform) {
        const title = this.i18n.t('bestPracticesFor') + ' ' + platform.name;
        
        return `
            <div class="best-practices">
                <h4>${title}:</h4>
                <ul>
                    ${platform.bestPractices.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    /**
     * Show placeholder when no content
     */
    showPlaceholder() {
        this.outputArea.innerHTML = `
            <p class="output-placeholder">${this.i18n.t('previewPlaceholder')}</p>
        `;
    }
    
    /**
     * Update character count display
     */
    updateCharCount(count) {
        this.charCountElement.textContent = count;
        
        const platform = this.platforms[this.currentPlatform];
        const percentage = (count / platform.charLimit) * 100;
        
        // Update styling based on character usage
        this.charCountElement.className = '';
        if (percentage > 90) {
            this.charCountElement.classList.add('char-limit-danger');
        } else if (percentage > 75) {
            this.charCountElement.classList.add('char-limit-warning');
        }
    }
    
    /**
     * Copy formatted text to clipboard
     */
    async copyFormattedText() {
        const formattedText = this.getPlainFormattedText();
        
        if (!formattedText.trim()) {
            this.showToast(this.i18n.t('noTextToCopy'), 'warning');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(formattedText);
            this.showToast(this.i18n.t('formattedTextCopied'), 'success');
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast(this.i18n.t('couldNotCopyText'), 'error');
        }
    }
    
    /**
     * Get plain text version of formatted content
     */
    getPlainFormattedText() {
        const text = this.textArea.value;
        const platform = this.platforms[this.currentPlatform];
        
        if (!text.trim()) return '';
        
        let formattedText = text;
        
        // Apply same formatting as display but without HTML
        if (platform.formatting.addLineBreaks) {
            formattedText = this.addOptimalLineBreaks(formattedText);
        }
        
        if (platform.formatting.suggestHashtags) {
            formattedText = this.addHashtagSuggestions(formattedText, platform);
        }
        
        if (platform.formatting.concise && formattedText.length > platform.charLimit) {
            formattedText = this.makeTextConcise(formattedText, platform.charLimit);
        }
        
        return formattedText;
    }
    
    /**
     * Show toast notification (uses main app's method)
     */
    showToast(message, type = 'info') {
        if (this.app && typeof this.app.showToast === 'function') {
            this.app.showToast(message, type);
        } else {
            console.log(`Toast: ${message} (${type})`);
        }
    }
    
    /**
     * Update language (called when language changes)
     */
    updateLanguage(language) {
        this.i18n.setLanguage(language);
        this.updateUI();
        this.formatText(); // Reformat with new language
    }
    
    /**
     * Set language (alias for updateLanguage for compatibility)
     */
    setLanguage(language) {
        this.updateLanguage(language);
    }
    
    /**
     * Get platform statistics
     */
    getPlatformStats() {
        const text = this.getPlainFormattedText();
        const platform = this.platforms[this.currentPlatform];
        
        return {
            platform: this.currentPlatform,
            characterCount: text.length,
            characterLimit: platform.charLimit,
            usage: Math.round((text.length / platform.charLimit) * 100),
            withinLimit: text.length <= platform.charLimit,
            hashtagCount: (text.match(/#\w+/g) || []).length,
            maxHashtags: platform.maxHashtags
        };
    }
}
