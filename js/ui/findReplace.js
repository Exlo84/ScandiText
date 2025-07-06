/**
 * Find and Replace Module for Nordisk Tekstredigering
 * Handles text search and replacement with advanced options
 * @author GitHub Copilot
 */

import { modal } from './modal.js';

/**
 * Find and Replace functionality with advanced search options
 */
export class FindReplace {
    constructor(textArea, i18n = null) {
        this.textArea = textArea;
        this.i18n = i18n;
        this.searchResults = [];
        this.currentResultIndex = -1;
        this.isModalOpen = false;
        this.originalText = '';
        this.highlightElements = [];
    }

    /**
     * Open the find/replace modal
     */
    open() {
        if (this.isModalOpen) return;

        this.originalText = this.textArea.value;
        this.createModal();
        this.isModalOpen = true;
    }

    /**
     * Create the find/replace modal
     */
    createModal() {
        const body = document.createElement('div');
        body.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="findInput">Finn:</label>
                    <input type="text" id="findInput" class="form-input" placeholder="Tekst å finne...">
                </div>
                <div class="form-group">
                    <label class="form-label" for="replaceInput">Erstatt med:</label>
                    <input type="text" id="replaceInput" class="form-input" placeholder="Erstattningstekst...">
                </div>
            </div>
            
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="caseSensitive">
                    <label for="caseSensitive">Skill mellom store og små bokstaver</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="wholeWords">
                    <label for="wholeWords">Kun hele ord</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="useRegex">
                    <label for="useRegex">Bruk regulære uttrykk</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="searchInSelection">
                    <label for="searchInSelection">Søk kun i utvalg</label>
                </div>
            </div>
            
            <div class="search-results" id="searchResults" style="display: none;">
                <span id="resultsText">Ingen resultater funnet</span>
            </div>
        `;

        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        const buttons = [
            { text: 'Finn alle', class: 'btn-outline', action: 'findAll' },
            { text: 'Finn neste', class: 'btn-secondary', action: 'findNext' },
            { text: 'Erstatt', class: 'btn-primary', action: 'replace' },
            { text: 'Erstatt alle', class: 'btn-success', action: 'replaceAll' },
            { text: 'Lukk', class: 'btn-secondary', action: 'close' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `btn ${btn.class}`;
            button.textContent = btn.text;
            button.addEventListener('click', () => this.handleAction(btn.action));
            footer.appendChild(button);
        });

        const modalElement = modal.create({
            title: 'Finn og erstatt',
            body,
            footer,
            className: 'find-replace-modal',
            onClose: () => this.close(),
            onOpen: () => this.setupModalEventListeners()
        });

        this.modalElement = modalElement;
    }

    /**
     * Setup event listeners for the modal
     */
    setupModalEventListeners() {
        const findInput = this.modalElement.querySelector('#findInput');
        const replaceInput = this.modalElement.querySelector('#replaceInput');
        
        // Focus find input
        findInput.focus();

        // Real-time search on input
        findInput.addEventListener('input', () => {
            this.clearHighlights();
            if (findInput.value.trim()) {
                this.findAll(false); // Don't show toast for real-time search
            }
        });

        // Enter key navigation
        findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.findNext();
            }
        });

        replaceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.replace();
            }
        });

        // Update search on option changes
        ['caseSensitive', 'wholeWords', 'useRegex', 'searchInSelection'].forEach(id => {
            const checkbox = this.modalElement.querySelector(`#${id}`);
            checkbox.addEventListener('change', () => {
                const findInput = this.modalElement.querySelector('#findInput');
                if (findInput.value.trim()) {
                    this.findAll(false);
                }
            });
        });
    }

    /**
     * Handle modal actions
     * @param {string} action - Action to perform
     */
    handleAction(action) {
        switch (action) {
            case 'findAll':
                this.findAll(true);
                break;
            case 'findNext':
                this.findNext();
                break;
            case 'replace':
                this.replace();
                break;
            case 'replaceAll':
                this.replaceAll();
                break;
            case 'close':
                modal.close();
                break;
        }
    }

    /**
     * Find all occurrences of search term
     * @param {boolean} showToast - Whether to show result toast
     */
    findAll(showToast = true) {
        const searchText = this.modalElement.querySelector('#findInput').value;
        if (!searchText.trim()) {
            this.clearResults();
            return;
        }

        try {
            const options = this.getSearchOptions();
            this.searchResults = this.performSearch(searchText, options);
            this.updateResultsDisplay();
            this.highlightResults();

            if (showToast && this.searchResults.length > 0) {
                this.showToast(`Fant ${this.searchResults.length} treff`, 'success');
            } else if (showToast) {
                this.showToast('Ingen treff funnet', 'info');
            }

            this.currentResultIndex = this.searchResults.length > 0 ? 0 : -1;
            this.scrollToCurrentResult();

        } catch (error) {
            this.showToast('Ugyldig søkekriterium: ' + error.message, 'error');
            this.clearResults();
        }
    }

    /**
     * Find next occurrence
     */
    findNext() {
        if (this.searchResults.length === 0) {
            this.findAll(false);
        }

        if (this.searchResults.length > 0) {
            this.currentResultIndex = (this.currentResultIndex + 1) % this.searchResults.length;
            this.highlightCurrentResult();
            this.scrollToCurrentResult();
            this.updateResultsDisplay();
        } else {
            this.showToast('Ingen flere treff', 'info');
        }
    }

    /**
     * Replace current occurrence
     */
    replace() {
        if (this.currentResultIndex === -1 || this.searchResults.length === 0) {
            this.showToast('Ingen treff valgt', 'warning');
            return;
        }

        const replaceText = this.modalElement.querySelector('#replaceInput').value;
        const result = this.searchResults[this.currentResultIndex];
        
        // Replace text
        const text = this.textArea.value;
        const newText = text.substring(0, result.start) + 
                       replaceText + 
                       text.substring(result.end);
        
        this.textArea.value = newText;
        
        // Trigger change event
        this.textArea.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Update search results
        const lengthDiff = replaceText.length - (result.end - result.start);
        this.updateResultIndicesAfterReplace(result.start, lengthDiff);
        
        this.showToast('Erstattet 1 forekomst', 'success');
        
        // Find next occurrence
        this.findNext();
    }

    /**
     * Replace all occurrences
     */
    async replaceAll() {
        if (this.searchResults.length === 0) {
            this.showToast('Ingen treff å erstatte', 'warning');
            return;
        }

        const replaceText = this.modalElement.querySelector('#replaceInput').value;
        const confirmed = await modal.confirm({
            title: 'Bekreft erstatt alle',
            message: `Er du sikker på at du vil erstatte alle ${this.searchResults.length} forekomster?`,
            confirmText: 'Erstatt alle',
            cancelText: 'Avbryt'
        });

        if (!confirmed) return;

        // Replace from end to start to maintain correct indices
        const sortedResults = [...this.searchResults].sort((a, b) => b.start - a.start);
        let text = this.textArea.value;
        
        sortedResults.forEach(result => {
            text = text.substring(0, result.start) + 
                  replaceText + 
                  text.substring(result.end);
        });

        this.textArea.value = text;
        this.textArea.dispatchEvent(new Event('input', { bubbles: true }));

        this.showToast(`Erstattet ${this.searchResults.length} forekomster`, 'success');
        this.clearResults();
    }

    /**
     * Get search options from modal
     * @returns {Object} Search options
     */
    getSearchOptions() {
        return {
            caseSensitive: this.modalElement.querySelector('#caseSensitive').checked,
            wholeWords: this.modalElement.querySelector('#wholeWords').checked,
            useRegex: this.modalElement.querySelector('#useRegex').checked,
            searchInSelection: this.modalElement.querySelector('#searchInSelection').checked
        };
    }

    /**
     * Perform search based on options
     * @param {string} searchText - Text to search for
     * @param {Object} options - Search options
     * @returns {Array} Search results
     */
    performSearch(searchText, options) {
        const text = this.textArea.value;
        const results = [];

        let searchRegex;
        
        if (options.useRegex) {
            const flags = options.caseSensitive ? 'g' : 'gi';
            searchRegex = new RegExp(searchText, flags);
        } else {
            let escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            if (options.wholeWords) {
                escapedText = `\\b${escapedText}\\b`;
            }
            
            const flags = options.caseSensitive ? 'g' : 'gi';
            searchRegex = new RegExp(escapedText, flags);
        }

        let match;
        while ((match = searchRegex.exec(text)) !== null) {
            results.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[0]
            });
            
            // Prevent infinite loop with zero-width matches
            if (match.index === searchRegex.lastIndex) {
                searchRegex.lastIndex++;
            }
        }

        // Filter by selection if needed
        if (options.searchInSelection) {
            const selectionStart = this.textArea.selectionStart;
            const selectionEnd = this.textArea.selectionEnd;
            
            return results.filter(result => 
                result.start >= selectionStart && result.end <= selectionEnd
            );
        }

        return results;
    }

    /**
     * Update result indices after replacement
     * @param {number} replaceStart - Start position of replacement
     * @param {number} lengthDiff - Length difference after replacement
     */
    updateResultIndicesAfterReplace(replaceStart, lengthDiff) {
        // Remove the replaced result
        this.searchResults.splice(this.currentResultIndex, 1);
        
        // Update indices for results after the replacement
        this.searchResults.forEach(result => {
            if (result.start > replaceStart) {
                result.start += lengthDiff;
                result.end += lengthDiff;
            }
        });

        // Adjust current index
        if (this.currentResultIndex >= this.searchResults.length) {
            this.currentResultIndex = this.searchResults.length - 1;
        }
    }

    /**
     * Update results display in modal
     */
    updateResultsDisplay() {
        const resultsElement = this.modalElement.querySelector('#searchResults');
        const resultsText = this.modalElement.querySelector('#resultsText');
        
        if (this.searchResults.length > 0) {
            resultsElement.style.display = 'block';
            const current = this.currentResultIndex + 1;
            const total = this.searchResults.length;
            resultsText.textContent = `${current} av ${total} treff`;
        } else {
            resultsElement.style.display = 'none';
        }
    }

    /**
     * Highlight all search results in textarea
     */
    highlightResults() {
        // Note: Textarea highlighting is complex and requires overlay approach
        // For now, we'll use selection to show current result
        this.highlightCurrentResult();
    }

    /**
     * Highlight current search result
     */
    highlightCurrentResult() {
        if (this.currentResultIndex >= 0 && this.currentResultIndex < this.searchResults.length) {
            const result = this.searchResults[this.currentResultIndex];
            this.textArea.setSelectionRange(result.start, result.end);
        }
    }

    /**
     * Scroll to current result
     */
    scrollToCurrentResult() {
        if (this.currentResultIndex >= 0 && this.currentResultIndex < this.searchResults.length) {
            const result = this.searchResults[this.currentResultIndex];
            
            // Calculate approximate line and scroll position
            const text = this.textArea.value.substring(0, result.start);
            const lines = text.split('\n').length;
            const lineHeight = 20; // Approximate line height
            
            this.textArea.scrollTop = Math.max(0, (lines - 5) * lineHeight);
            this.textArea.focus();
        }
    }

    /**
     * Clear search highlights
     */
    clearHighlights() {
        // Clear any highlighting elements if implemented
        this.highlightElements.forEach(el => el.remove());
        this.highlightElements = [];
    }

    /**
     * Clear search results
     */
    clearResults() {
        this.searchResults = [];
        this.currentResultIndex = -1;
        this.clearHighlights();
        this.updateResultsDisplay();
    }

    /**
     * Close find/replace modal
     */
    close() {
        this.clearHighlights();
        this.clearResults();
        this.isModalOpen = false;
    }

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Toast type (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <span class="toast-title">Finn og erstatt</span>
                <button class="toast-close">×</button>
            </div>
            <div class="toast-body">${message}</div>
        `;

        // Add to container
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

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

    /**
     * Get keyboard shortcut handler
     * @returns {Function} Event handler function
     */
    getKeyboardHandler() {
        return (e) => {
            // Ctrl+F or Cmd+F to open find/replace
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                this.open();
            }
            // F3 for find next
            else if (e.key === 'F3') {
                e.preventDefault();
                if (this.isModalOpen) {
                    this.findNext();
                }
            }
            // Escape to close
            else if (e.key === 'Escape' && this.isModalOpen) {
                modal.close();
            }
        };
    }
}
