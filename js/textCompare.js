/**
 * Text Compare Module for Nordisk Tekstredigering
 * Handles side-by-side text comparison with diff highlighting
 * @author GitHub Copilot
 */

import { modal } from './ui/modal.js';
import { TextAnalyzer } from './textAnalyzer.js';

/**
 * Text comparison utility with diff highlighting
 */
export class TextCompare {
    constructor() {
        this.analyzer = new TextAnalyzer();
    }

    /**
     * Open text comparison modal
     * @param {string} currentText - Current text content
     */
    openCompareModal(currentText = '') {
        const body = document.createElement('div');
        body.innerHTML = `
            <p style="margin-bottom: 20px; color: var(--text-gray);">
                Sammenlign to tekster og se forskjellene visuelt markert.
            </p>
            
            <div class="compare-container">
                <div class="compare-section">
                    <div class="compare-header">Originaltekst</div>
                    <textarea class="compare-text" id="originalText" 
                             placeholder="Lim inn eller skriv den første teksten her...">${currentText}</textarea>
                </div>
                <div class="compare-section">
                    <div class="compare-header">Sammenligningstekst</div>
                    <textarea class="compare-text" id="compareText" 
                             placeholder="Lim inn eller skriv den andre teksten her..."></textarea>
                </div>
            </div>
            
            <div class="form-group">
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="ignoreCaseDiff" checked>
                        <label for="ignoreCaseDiff">Ignorer store/små bokstaver</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="ignoreWhitespaceDiff" checked>
                        <label for="ignoreWhitespaceDiff">Ignorer mellomrom og linjeskift</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="showWordLevel">
                        <label for="showWordLevel">Vis forskjeller på ordnivå</label>
                    </div>
                </div>
            </div>
            
            <div id="diffResults" style="display: none;">
                <h4>Sammenligning:</h4>
                <div class="compare-container" id="diffDisplay">
                    <div class="compare-section">
                        <div class="compare-header">Originaltekst med endringer</div>
                        <div class="compare-text" id="originalDiff"></div>
                    </div>
                    <div class="compare-section">
                        <div class="compare-header">Sammenligningstekst med endringer</div>
                        <div class="compare-text" id="compareDiff"></div>
                    </div>
                </div>
                
                <div class="stats-comparison" id="statsComparison">
                    <!-- Statistics will be populated here -->
                </div>
            </div>
        `;

        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        const buttons = [
            { text: 'Sammenlign', class: 'btn-primary', action: 'compare' },
            { text: 'Kopier diff', class: 'btn-outline', action: 'copyDiff' },
            { text: 'Lukk', class: 'btn-secondary', action: 'close' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `btn ${btn.class}`;
            button.textContent = btn.text;
            button.addEventListener('click', () => this.handleCompareAction(btn.action));
            if (btn.action === 'copyDiff') {
                button.disabled = true;
                button.id = 'copyDiffBtn';
            }
            footer.appendChild(button);
        });

        this.modalElement = modal.create({
            title: 'Sammenlign tekster',
            body,
            footer,
            className: 'compare-modal',
            onOpen: () => this.setupCompareModal()
        });
    }

    /**
     * Setup compare modal event listeners
     */
    setupCompareModal() {
        const originalText = this.modalElement.querySelector('#originalText');
        const compareText = this.modalElement.querySelector('#compareText');
        
        // Auto-compare on text change with debounce
        let compareTimeout;
        const autoCompare = () => {
            clearTimeout(compareTimeout);
            compareTimeout = setTimeout(() => {
                if (originalText.value.trim() && compareText.value.trim()) {
                    this.performComparison();
                }
            }, 1000);
        };

        originalText.addEventListener('input', autoCompare);
        compareText.addEventListener('input', autoCompare);

        // Update comparison when options change
        ['ignoreCaseDiff', 'ignoreWhitespaceDiff', 'showWordLevel'].forEach(id => {
            const checkbox = this.modalElement.querySelector(`#${id}`);
            checkbox.addEventListener('change', () => {
                if (originalText.value.trim() && compareText.value.trim()) {
                    this.performComparison();
                }
            });
        });

        // Focus first textarea
        originalText.focus();
    }

    /**
     * Handle compare modal actions
     * @param {string} action - Action to perform
     */
    handleCompareAction(action) {
        switch (action) {
            case 'compare':
                this.performComparison();
                break;
            case 'copyDiff':
                this.copyDiffToClipboard();
                break;
            case 'close':
                modal.close();
                break;
        }
    }

    /**
     * Perform text comparison
     */
    performComparison() {
        const originalText = this.modalElement.querySelector('#originalText').value;
        const compareText = this.modalElement.querySelector('#compareText').value;

        if (!originalText.trim() || !compareText.trim()) {
            modal.alert({
                title: 'Manglende tekst',
                message: 'Begge tekstbokser må inneholde tekst for sammenligning.',
                type: 'warning'
            });
            return;
        }

        const options = this.getCompareOptions();
        const diff = this.generateDiff(originalText, compareText, options);
        const stats = this.compareStatistics(originalText, compareText);

        this.displayDiff(diff);
        this.displayStatistics(stats);

        // Show results section
        this.modalElement.querySelector('#diffResults').style.display = 'block';
        
        // Enable copy button
        this.modalElement.querySelector('#copyDiffBtn').disabled = false;

        // Store diff for copying
        this.lastDiff = diff;
    }

    /**
     * Get comparison options from modal
     * @returns {Object} Comparison options
     */
    getCompareOptions() {
        return {
            ignoreCase: this.modalElement.querySelector('#ignoreCaseDiff').checked,
            ignoreWhitespace: this.modalElement.querySelector('#ignoreWhitespaceDiff').checked,
            wordLevel: this.modalElement.querySelector('#showWordLevel').checked
        };
    }

    /**
     * Generate diff between two texts
     * @param {string} text1 - Original text
     * @param {string} text2 - Comparison text
     * @param {Object} options - Comparison options
     * @returns {Object} Diff result
     */
    generateDiff(text1, text2, options) {
        let processedText1 = text1;
        let processedText2 = text2;

        // Apply preprocessing based on options
        if (options.ignoreCase) {
            processedText1 = processedText1.toLowerCase();
            processedText2 = processedText2.toLowerCase();
        }

        if (options.ignoreWhitespace) {
            processedText1 = processedText1.replace(/\s+/g, ' ').trim();
            processedText2 = processedText2.replace(/\s+/g, ' ').trim();
        }

        // Choose diff algorithm based on word level option
        if (options.wordLevel) {
            return this.generateWordDiff(processedText1, processedText2, text1, text2);
        } else {
            return this.generateLineDiff(processedText1, processedText2, text1, text2);
        }
    }

    /**
     * Generate word-level diff
     * @param {string} text1 - Processed text 1
     * @param {string} text2 - Processed text 2
     * @param {string} original1 - Original text 1
     * @param {string} original2 - Original text 2
     * @returns {Object} Word diff result
     */
    generateWordDiff(text1, text2, original1, original2) {
        const words1 = text1.split(/\s+/);
        const words2 = text2.split(/\s+/);
        const originalWords1 = original1.split(/\s+/);
        const originalWords2 = original2.split(/\s+/);

        const lcs = this.longestCommonSubsequence(words1, words2);
        
        let result1 = '';
        let result2 = '';
        let i = 0, j = 0, k = 0;

        while (i < words1.length || j < words2.length) {
            if (k < lcs.length && i < words1.length && words1[i] === lcs[k]) {
                // Common word
                result1 += originalWords1[i] + ' ';
                result2 += originalWords2[j] + ' ';
                i++; j++; k++;
            } else if (i < words1.length && (k >= lcs.length || words1[i] !== lcs[k])) {
                // Removed word
                result1 += `<span class="diff-removed">${originalWords1[i]}</span> `;
                i++;
            } else if (j < words2.length) {
                // Added word
                result2 += `<span class="diff-added">${originalWords2[j]}</span> `;
                j++;
            }
        }

        return {
            text1: result1.trim(),
            text2: result2.trim(),
            type: 'word'
        };
    }

    /**
     * Generate line-level diff
     * @param {string} text1 - Processed text 1
     * @param {string} text2 - Processed text 2
     * @param {string} original1 - Original text 1
     * @param {string} original2 - Original text 2
     * @returns {Object} Line diff result
     */
    generateLineDiff(text1, text2, original1, original2) {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const originalLines1 = original1.split('\n');
        const originalLines2 = original2.split('\n');

        const lcs = this.longestCommonSubsequence(lines1, lines2);
        
        let result1 = '';
        let result2 = '';
        let i = 0, j = 0, k = 0;

        while (i < lines1.length || j < lines2.length) {
            if (k < lcs.length && i < lines1.length && lines1[i] === lcs[k]) {
                // Common line
                result1 += originalLines1[i] + '\n';
                result2 += originalLines2[j] + '\n';
                i++; j++; k++;
            } else if (i < lines1.length && (k >= lcs.length || lines1[i] !== lcs[k])) {
                // Removed line
                result1 += `<span class="diff-removed">${this.escapeHtml(originalLines1[i])}</span>\n`;
                i++;
            } else if (j < lines2.length) {
                // Added line
                result2 += `<span class="diff-added">${this.escapeHtml(originalLines2[j])}</span>\n`;
                j++;
            }
        }

        return {
            text1: result1.trim(),
            text2: result2.trim(),
            type: 'line'
        };
    }

    /**
     * Find longest common subsequence
     * @param {Array} seq1 - First sequence
     * @param {Array} seq2 - Second sequence
     * @returns {Array} LCS sequence
     */
    longestCommonSubsequence(seq1, seq2) {
        const m = seq1.length;
        const n = seq2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        // Build LCS table
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (seq1[i - 1] === seq2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Reconstruct LCS
        const lcs = [];
        let i = m, j = n;
        while (i > 0 && j > 0) {
            if (seq1[i - 1] === seq2[j - 1]) {
                lcs.unshift(seq1[i - 1]);
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        return lcs;
    }

    /**
     * Display diff results in modal
     * @param {Object} diff - Diff result
     */
    displayDiff(diff) {
        const originalDiff = this.modalElement.querySelector('#originalDiff');
        const compareDiff = this.modalElement.querySelector('#compareDiff');

        originalDiff.innerHTML = diff.text1 || 'Ingen endringer';
        compareDiff.innerHTML = diff.text2 || 'Ingen endringer';
    }

    /**
     * Compare statistics between texts
     * @param {string} text1 - Original text
     * @param {string} text2 - Comparison text
     * @returns {Object} Statistics comparison
     */
    compareStatistics(text1, text2) {
        const stats1 = this.analyzer.analyze(text1);
        const stats2 = this.analyzer.analyze(text2);

        return {
            original: stats1,
            comparison: stats2,
            differences: {
                words: stats2.words - stats1.words,
                characters: stats2.characters - stats1.characters,
                sentences: stats2.sentences - stats1.sentences,
                paragraphs: stats2.paragraphs - stats1.paragraphs,
                readingTime: stats2.readingTime - stats1.readingTime
            }
        };
    }

    /**
     * Display statistics comparison
     * @param {Object} stats - Statistics comparison
     */
    displayStatistics(stats) {
        const container = this.modalElement.querySelector('#statsComparison');
        
        const statsHtml = `
            <div class="stat-card">
                <h4>Ord</h4>
                <div class="value">${stats.original.words} → ${stats.comparison.words}</div>
                <div style="font-size: 12px; color: ${stats.differences.words >= 0 ? 'green' : 'red'};">
                    ${stats.differences.words >= 0 ? '+' : ''}${stats.differences.words}
                </div>
            </div>
            <div class="stat-card">
                <h4>Tegn</h4>
                <div class="value">${stats.original.characters} → ${stats.comparison.characters}</div>
                <div style="font-size: 12px; color: ${stats.differences.characters >= 0 ? 'green' : 'red'};">
                    ${stats.differences.characters >= 0 ? '+' : ''}${stats.differences.characters}
                </div>
            </div>
            <div class="stat-card">
                <h4>Setninger</h4>
                <div class="value">${stats.original.sentences} → ${stats.comparison.sentences}</div>
                <div style="font-size: 12px; color: ${stats.differences.sentences >= 0 ? 'green' : 'red'};">
                    ${stats.differences.sentences >= 0 ? '+' : ''}${stats.differences.sentences}
                </div>
            </div>
            <div class="stat-card">
                <h4>Avsnitt</h4>
                <div class="value">${stats.original.paragraphs} → ${stats.comparison.paragraphs}</div>
                <div style="font-size: 12px; color: ${stats.differences.paragraphs >= 0 ? 'green' : 'red'};">
                    ${stats.differences.paragraphs >= 0 ? '+' : ''}${stats.differences.paragraphs}
                </div>
            </div>
            <div class="stat-card">
                <h4>Lesetid</h4>
                <div class="value">${stats.original.readingTime} → ${stats.comparison.readingTime} min</div>
                <div style="font-size: 12px; color: ${stats.differences.readingTime >= 0 ? 'green' : 'red'};">
                    ${stats.differences.readingTime >= 0 ? '+' : ''}${stats.differences.readingTime} min
                </div>
            </div>
            <div class="stat-card">
                <h4>Lesbarhet</h4>
                <div class="value">${stats.original.readabilityScore.level} → ${stats.comparison.readabilityScore.level}</div>
                <div style="font-size: 12px;">
                    ${stats.original.readabilityScore.score} → ${stats.comparison.readabilityScore.score}
                </div>
            </div>
        `;

        container.innerHTML = statsHtml;
    }

    /**
     * Copy diff to clipboard
     */
    async copyDiffToClipboard() {
        if (!this.lastDiff) {
            modal.alert({
                title: 'Ingen sammenligning',
                message: 'Utfør en sammenligning først.',
                type: 'warning'
            });
            return;
        }

        try {
            // Create plain text version of diff
            const plainTextDiff = this.convertDiffToPlainText(this.lastDiff);
            await navigator.clipboard.writeText(plainTextDiff);
            
            this.showToast('Diff kopiert til utklippstavle', 'success');
        } catch (error) {
            modal.alert({
                title: 'Kopiering feilet',
                message: 'Kunne ikke kopiere til utklippstavle.',
                type: 'error'
            });
        }
    }

    /**
     * Convert diff HTML to plain text
     * @param {Object} diff - Diff object
     * @returns {string} Plain text diff
     */
    convertDiffToPlainText(diff) {
        const text1 = diff.text1.replace(/<span class="diff-removed">(.*?)<\/span>/g, '[-$1-]');
        const text2 = diff.text2.replace(/<span class="diff-added">(.*?)<\/span>/g, '[+$1+]');
        
        return `ORIGINALTEKST:\n${text1}\n\nSAMMENLIGNINGSTEKST:\n${text2}`;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
                <span class="toast-title">Tekstsammenligning</span>
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
