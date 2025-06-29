/**
 * Main Application Module for Nordisk Tekstredigering
 * Orchestrates all components and handles user interactions
 * @author GitHub Copilot
 */

import { TextAnalyzer } from './textAnalyzer.js';
import { LanguageDetector } from './languageDetector.js';
import { TextTransforms } from './textTransforms.js';
import { FindReplace } from './ui/findReplace.js';
import { ExportUtils } from './exportUtils.js';
import { TextCompare } from './textCompare.js';
import { modal } from './ui/modal.js';

/**
 * Main application class
 */
class NordiskTekstredigering {
    constructor() {
        this.currentLanguage = 'no';
        this.textEditor = null;
        this.lastStats = {};
        this.autoSaveEnabled = false;
        this.autoSaveInterval = null;

        // Initialize modules
        this.analyzer = new TextAnalyzer();
        this.languageDetector = new LanguageDetector();
        this.textTransforms = new TextTransforms();
        this.exportUtils = new ExportUtils();
        this.textCompare = new TextCompare();
        this.findReplace = null; // Will be initialized after DOM is ready

        // Bind methods
        this.updateStats = this.updateStats.bind(this);
        this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
        this.handleTextTransform = this.handleTextTransform.bind(this);
        this.handleAdvancedTool = this.handleAdvancedTool.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.initializeAutoSave();
        this.updateStats();
        
        console.log('Nordisk Tekstredigering initialized successfully');
    }

    /**
     * Setup DOM references
     */
    setupDOM() {
        this.textEditor = document.getElementById('textEditor');
        this.elements = {
            wordCount: document.getElementById('wordCount'),
            charCount: document.getElementById('charCount'),
            charCountNoSpaces: document.getElementById('charCountNoSpaces'),
            sentenceCount: document.getElementById('sentenceCount'),
            paragraphCount: document.getElementById('paragraphCount'),
            readingTime: document.getElementById('readingTime'),
            avgWordLength: document.getElementById('avgWordLength'),
            avgSentenceLength: document.getElementById('avgSentenceLength'),
            detectedLang: document.getElementById('detectedLang'),
            lastUpdated: document.getElementById('lastUpdated'),
            readabilityScore: document.querySelector('.readability-score')
        };

        // Initialize FindReplace with textarea reference
        this.findReplace = new FindReplace(this.textEditor);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Text editor input
        this.textEditor.addEventListener('input', this.updateStats);
        this.textEditor.addEventListener('paste', () => {
            // Small delay to ensure pasted content is processed
            setTimeout(this.updateStats, 10);
        });

        // Language selector buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', this.handleLanguageSelect);
        });

        // Text transformation buttons
        document.querySelectorAll('[data-transform]').forEach(btn => {
            const action = btn.getAttribute('data-transform');
            btn.addEventListener('click', () => this.handleTextTransform(action));
        });

        // Advanced tool buttons
        document.querySelectorAll('[data-tool]').forEach(btn => {
            const tool = btn.getAttribute('data-tool');
            btn.addEventListener('click', () => this.handleAdvancedTool(tool));
        });

        // Window events
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', this.handleKeyboard);
        
        // Setup FindReplace keyboard handler
        document.addEventListener('keydown', this.findReplace.getKeyboardHandler());
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboard(e) {
        // Ctrl/Cmd + S for save (auto-save toggle)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.toggleAutoSave();
        }
        // Ctrl/Cmd + E for export
        else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            this.handleAdvancedTool('export');
        }
        // Ctrl/Cmd + Shift + C for compare
        else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            this.handleAdvancedTool('compare');
        }
        // F1 for help
        else if (e.key === 'F1') {
            e.preventDefault();
            this.showHelp();
        }
    }

    /**
     * Update text statistics
     */
    updateStats() {
        const text = this.textEditor.value;
        
        // Analyze text
        const stats = this.analyzer.analyze(text, this.currentLanguage);
        
        // Detect language
        const detection = this.languageDetector.detect(text);
        
        // Update stats display
        this.updateStatsDisplay(stats, detection);
        
        // Store last stats for export
        this.lastStats = { ...stats, detection };
        
        // Auto-save if enabled
        if (this.autoSaveEnabled) {
            this.saveToLocalStorage();
        }
    }

    /**
     * Update statistics display
     * @param {Object} stats - Text statistics
     * @param {Object} detection - Language detection result
     */
    updateStatsDisplay(stats, detection) {
        // Update basic stats
        this.elements.wordCount.textContent = stats.words;
        this.elements.charCount.textContent = stats.characters;
        this.elements.charCountNoSpaces.textContent = stats.charactersNoSpaces;
        this.elements.sentenceCount.textContent = stats.sentences;
        this.elements.paragraphCount.textContent = stats.paragraphs;
        this.elements.readingTime.textContent = stats.readingTime + ' min';
        this.elements.avgWordLength.textContent = stats.avgWordLength;
        this.elements.avgSentenceLength.textContent = stats.avgSentenceLength;
        this.elements.lastUpdated.textContent = stats.lastUpdated;

        // Update language detection
        this.elements.detectedLang.textContent = detection.detectedLanguage;
        if (detection.confidence > 0) {
            this.elements.detectedLang.innerHTML = `
                ${detection.detectedLanguage}
                <span class="confidence-score">(${detection.confidence}%)</span>
            `;
        }

        // Update readability score
        const readabilityElement = this.elements.readabilityScore;
        readabilityElement.textContent = `Lesbarhet: ${stats.readabilityScore.level}`;
        
        // Update readability class based on score
        readabilityElement.className = 'readability-score';
        if (stats.readabilityScore.score >= 80) {
            readabilityElement.classList.add('excellent');
        } else if (stats.readabilityScore.score >= 60) {
            readabilityElement.classList.add('good');
        } else if (stats.readabilityScore.score >= 40) {
            readabilityElement.classList.add('fair');
        } else {
            readabilityElement.classList.add('poor');
        }
    }

    /**
     * Handle language selection
     * @param {Event} e - Click event
     */
    handleLanguageSelect(e) {
        e.preventDefault();
        
        // Remove active class from all buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Extract language from button content or data attribute
        const langMap = {
            'Norsk': 'no',
            'Svenska': 'se',
            'Dansk': 'dk'
        };
        
        const langText = e.target.textContent.replace(/🇳🇴|🇸🇪|🇩🇰/, '').trim();
        this.currentLanguage = langMap[langText] || 'no';
        
        // Update stats with new language
        this.updateStats();
    }

    /**
     * Handle text transformations
     * @param {string} action - Transformation action
     */
    handleTextTransform(action) {
        const text = this.textEditor.value;
        if (!text.trim()) {
            this.showToast('Ingen tekst å transformere', 'warning');
            return;
        }

        let transformed = text;

        try {
            switch (action) {
                case 'uppercase':
                    transformed = this.textTransforms.toUpperCase(text);
                    break;
                case 'lowercase':
                    transformed = this.textTransforms.toLowerCase(text);
                    break;
                case 'title':
                    transformed = this.textTransforms.toTitleCase(text, this.currentLanguage);
                    break;
                case 'clean':
                    transformed = this.textTransforms.fullClean(text, this.currentLanguage);
                    break;
                case 'ae-convert':
                    transformed = this.textTransforms.convertNordicToAscii(text);
                    break;
                case 'ascii-to-nordic':
                    transformed = this.textTransforms.convertAsciiToNordic(text, this.currentLanguage);
                    break;
                case 'remove-hyphens':
                    transformed = this.textTransforms.removeCompoundHyphens(text, this.currentLanguage);
                    break;
                case 'add-hyphens':
                    transformed = this.textTransforms.addCompoundHyphens(text, this.currentLanguage);
                    break;
                case 'normalize-punctuation':
                    transformed = this.textTransforms.normalizePunctuation(text);
                    break;
                default:
                    this.showToast(`Ukjent transformasjon: ${action}`, 'error');
                    return;
            }

            // Apply transformation
            this.textEditor.value = transformed;
            this.updateStats();
            
            // Show success message
            const actionNames = {
                'uppercase': 'Store bokstaver',
                'lowercase': 'Små bokstaver',
                'title': 'Tittel format',
                'clean': 'Tekst renset',
                'ae-convert': 'Konvertert til ASCII',
                'ascii-to-nordic': 'Konvertert til nordiske tegn',
                'remove-hyphens': 'Bindestreker fjernet',
                'add-hyphens': 'Bindestreker lagt til',
                'normalize-punctuation': 'Tegnsetting normalisert'
            };
            
            this.showToast(`${actionNames[action] || 'Transformasjon'} utført`, 'success');
            
        } catch (error) {
            console.error('Transformation error:', error);
            this.showToast('Feil ved transformasjon: ' + error.message, 'error');
        }
    }

    /**
     * Handle advanced tools
     * @param {string} tool - Tool name
     */
    handleAdvancedTool(tool) {
        switch (tool) {
            case 'find-replace':
                this.findReplace.open();
                break;
            case 'compare':
                this.textCompare.openCompareModal(this.textEditor.value);
                break;
            case 'export':
                this.exportUtils.openExportModal(this.textEditor.value, this.lastStats);
                break;
            case 'help':
                this.showHelp();
                break;
            case 'settings':
                this.showSettings();
                break;
            default:
                this.showToast(`Verktøyet "${tool}" er ikke implementert ennå`, 'info');
        }
    }

    /**
     * Initialize auto-save functionality
     */
    initializeAutoSave() {
        // Check if auto-save was previously enabled
        const savedState = localStorage.getItem('nordisk-autosave-enabled');
        if (savedState === 'true') {
            this.toggleAutoSave();
        }

        // Load saved text
        this.loadFromLocalStorage();
    }

    /**
     * Toggle auto-save functionality
     */
    toggleAutoSave() {
        if (this.autoSaveEnabled) {
            // Disable auto-save
            this.autoSaveEnabled = false;
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
                this.autoSaveInterval = null;
            }
            localStorage.setItem('nordisk-autosave-enabled', 'false');
            this.showToast('Auto-lagring deaktivert', 'info');
        } else {
            // Enable auto-save
            this.autoSaveEnabled = true;
            this.autoSaveInterval = setInterval(() => {
                this.saveToLocalStorage();
            }, 30000); // Save every 30 seconds
            localStorage.setItem('nordisk-autosave-enabled', 'true');
            this.showToast('Auto-lagring aktivert (lagrer hvert 30. sekund)', 'success');
        }
    }

    /**
     * Save text to localStorage
     */
    saveToLocalStorage() {
        try {
            const data = {
                text: this.textEditor.value,
                language: this.currentLanguage,
                timestamp: Date.now()
            };
            localStorage.setItem('nordisk-text-data', JSON.stringify(data));
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    }

    /**
     * Load text from localStorage
     */
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('nordisk-text-data');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.text && data.text.trim()) {
                    // Only load if current editor is empty
                    if (!this.textEditor.value.trim()) {
                        this.textEditor.value = data.text;
                        this.currentLanguage = data.language || 'no';
                        this.updateLanguageButtons();
                        this.updateStats();
                        
                        const age = Date.now() - data.timestamp;
                        const minutes = Math.floor(age / 60000);
                        this.showToast(`Lastet tidligere tekst (${minutes} min gammel)`, 'info');
                    }
                }
            }
        } catch (error) {
            console.error('Load error:', error);
        }
    }

    /**
     * Update language button states
     */
    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            const langText = btn.textContent.replace(/🇳🇴|🇸🇪|🇩🇰/, '').trim();
            const langMap = { 'Norsk': 'no', 'Svenska': 'se', 'Dansk': 'dk' };
            if (langMap[langText] === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Show help modal
     */
    showHelp() {
        const helpContent = `
            <h4>Hurtigtaster:</h4>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li><strong>Ctrl+F:</strong> Finn og erstatt</li>
                <li><strong>Ctrl+S:</strong> Toggle auto-lagring</li>
                <li><strong>Ctrl+E:</strong> Eksporter tekst</li>
                <li><strong>Ctrl+Shift+C:</strong> Sammenlign tekster</li>
                <li><strong>F1:</strong> Vis denne hjelpen</li>
                <li><strong>F3:</strong> Finn neste (i søk)</li>
                <li><strong>Escape:</strong> Lukk modal</li>
            </ul>
            
            <h4>Teksttransformasjoner:</h4>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li><strong>Store/små bokstaver:</strong> Konverter hele teksten</li>
                <li><strong>Tittel format:</strong> Intelligent kapitalisering</li>
                <li><strong>Rens tekst:</strong> Fjern ekstra mellomrom og normaliser</li>
                <li><strong>æ/ø/å ↔ ae/oe/aa:</strong> Konverter mellom nordiske tegn og ASCII</li>
            </ul>
            
            <h4>Avanserte verktøy:</h4>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li><strong>Finn og erstatt:</strong> Søk og erstatt med regex-støtte</li>
                <li><strong>Sammenlign tekster:</strong> Side-ved-side sammenligning med diff</li>
                <li><strong>Eksporter:</strong> Lagre som TXT, HTML, Word eller PDF</li>
            </ul>
            
            <h4>Språkgjenkjenning:</h4>
            <p style="margin: 15px 0;">Verktøyet gjenkjenner automatisk norsk, svensk og dansk basert på ordforråd, tegn og ordendelser.</p>
            
            <h4>Tekstanalyse:</h4>
            <p style="margin: 15px 0;">Får omfattende statistikk inkludert lesbarhetsscore tilpasset nordiske språk.</p>
        `;

        modal.create({
            title: 'Hjelp - Nordisk Tekstredigering',
            body: helpContent,
            footer: `<button class="btn btn-primary" onclick="modal.close()">Lukk</button>`,
            size: 'large'
        });
    }

    /**
     * Show settings modal
     */
    showSettings() {
        const body = document.createElement('div');
        body.innerHTML = `
            <div class="form-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="autoSaveToggle" ${this.autoSaveEnabled ? 'checked' : ''}>
                    <label for="autoSaveToggle">Aktiver auto-lagring (lagrer hvert 30. sekund)</label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Standard språk:</label>
                <select class="form-input" id="defaultLanguage">
                    <option value="no" ${this.currentLanguage === 'no' ? 'selected' : ''}>Norsk</option>
                    <option value="se" ${this.currentLanguage === 'se' ? 'selected' : ''}>Svenska</option>
                    <option value="dk" ${this.currentLanguage === 'dk' ? 'selected' : ''}>Dansk</option>
                </select>
            </div>
            
            <div class="form-group">
                <button class="btn btn-outline" id="clearStorageBtn">Tøm lagrede data</button>
                <p style="font-size: 12px; color: var(--text-gray); margin-top: 5px;">
                    Fjerner all lagret tekst og innstillinger
                </p>
            </div>
        `;

        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary';
        saveBtn.textContent = 'Lagre innstillinger';
        saveBtn.addEventListener('click', () => this.saveSettings());
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Avbryt';
        cancelBtn.addEventListener('click', () => modal.close());
        
        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        const modalElement = modal.create({
            title: 'Innstillinger',
            body,
            footer,
            className: 'settings-modal',
            onOpen: () => this.setupSettingsModal(modalElement)
        });
    }

    /**
     * Setup settings modal
     * @param {HTMLElement} modalElement - Modal element
     */
    setupSettingsModal(modalElement) {
        const clearBtn = modalElement.querySelector('#clearStorageBtn');
        clearBtn.addEventListener('click', async () => {
            const confirmed = await modal.confirm({
                title: 'Tøm lagrede data',
                message: 'Er du sikker på at du vil fjerne all lagret tekst og innstillinger? Dette kan ikke angres.',
                confirmText: 'Ja, tøm alt',
                cancelText: 'Avbryt'
            });
            
            if (confirmed) {
                localStorage.clear();
                this.showToast('Alle lagrede data er fjernet', 'success');
                modal.close();
            }
        });
    }

    /**
     * Save settings from modal
     */
    saveSettings() {
        const autoSaveToggle = document.querySelector('#autoSaveToggle');
        const defaultLanguage = document.querySelector('#defaultLanguage');
        
        // Toggle auto-save if changed
        if (autoSaveToggle.checked !== this.autoSaveEnabled) {
            this.toggleAutoSave();
        }
        
        // Update default language
        if (defaultLanguage.value !== this.currentLanguage) {
            this.currentLanguage = defaultLanguage.value;
            this.updateLanguageButtons();
            this.updateStats();
        }
        
        modal.close();
        this.showToast('Innstillinger lagret', 'success');
    }

    /**
     * Handle before unload event
     * @param {BeforeUnloadEvent} e - Before unload event
     */
    handleBeforeUnload(e) {
        if (this.textEditor.value.trim() && !this.autoSaveEnabled) {
            e.preventDefault();
            e.returnValue = 'Du har ulagret tekst. Er du sikker på at du vil forlate siden?';
            return e.returnValue;
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Ensure modal positioning is correct
        if (modal.isActive()) {
            modal.resize();
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Toast type
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <div class="toast-header">
                <span class="toast-title">Nordisk Tekstredigering</span>
                <button class="toast-close">×</button>
            </div>
            <div class="toast-body">${message}</div>
        `;

        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new NordiskTekstredigering();
    app.init();
    
    // Make app globally available for debugging
    window.NordiskTekstredigering = app;
});
