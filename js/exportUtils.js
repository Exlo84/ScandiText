/**
 * Export Utilities Module for Nordisk Tekstredigering
 * Handles text export to various formats
 * @author GitHub Copilot
 */

import { modal } from './ui/modal.js';

/**
 * Export utilities for converting text to various formats
 */
export class ExportUtils {
    constructor() {
        this.supportedFormats = ['txt', 'html', 'docx', 'pdf'];
    }

    /**
     * Open export modal and handle format selection
     * @param {string} text - Text to export
     * @param {Object} stats - Text statistics
     */
    openExportModal(text, stats = {}) {
        if (!text || text.trim().length === 0) {
            modal.alert({
                title: 'Ingen tekst å eksportere',
                message: 'Skriv inn eller lim inn tekst før du eksporterer.',
                type: 'warning'
            });
            return;
        }

        const body = document.createElement('div');
        body.innerHTML = `
            <p style="margin-bottom: 20px; color: var(--text-gray);">
                Velg format for eksport av ${stats.words || 0} ord.
            </p>
            <div class="export-options">
                <div class="export-option" data-format="txt">
                    <div class="export-icon">📄</div>
                    <div class="export-title">Plain Text</div>
                    <div class="export-description">Ren tekst uten formatering (.txt)</div>
                </div>
                <div class="export-option" data-format="html">
                    <div class="export-icon">🌐</div>
                    <div class="export-title">HTML</div>
                    <div class="export-description">Formatert HTML-dokument (.html)</div>
                </div>
                <div class="export-option" data-format="docx">
                    <div class="export-icon">📝</div>
                    <div class="export-title">Word-dokument</div>
                    <div class="export-description">Microsoft Word-format (.docx)</div>
                </div>
                <div class="export-option" data-format="pdf">
                    <div class="export-icon">📋</div>
                    <div class="export-title">PDF</div>
                    <div class="export-description">Portable Document Format (.pdf)</div>
                </div>
            </div>
            
            <div class="form-group" style="margin-top: 20px;">
                <label class="form-label" for="exportFilename">Filnavn:</label>
                <input type="text" id="exportFilename" class="form-input" 
                       value="nordisk-tekst-${new Date().toISOString().split('T')[0]}" 
                       placeholder="Skriv inn filnavn...">
            </div>
        `;

        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-secondary';
        cancelButton.textContent = 'Avbryt';
        cancelButton.addEventListener('click', () => modal.close());

        const exportButton = document.createElement('button');
        exportButton.className = 'btn btn-primary';
        exportButton.textContent = 'Eksporter';
        exportButton.disabled = true;
        exportButton.addEventListener('click', () => this.handleExport(text, stats));

        footer.appendChild(cancelButton);
        footer.appendChild(exportButton);

        const modalElement = modal.create({
            title: 'Eksporter tekst',
            body,
            footer,
            className: 'export-modal',
            onOpen: () => this.setupExportModal(modalElement, exportButton)
        });
    }

    /**
     * Setup export modal event listeners
     * @param {HTMLElement} modalElement - Modal element
     * @param {HTMLElement} exportButton - Export button
     */
    setupExportModal(modalElement, exportButton) {
        const options = modalElement.querySelectorAll('.export-option');
        let selectedFormat = null;

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                options.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to selected option
                option.classList.add('active');
                selectedFormat = option.dataset.format;
                
                // Enable export button
                exportButton.disabled = false;
                exportButton.dataset.format = selectedFormat;
                
                // Update filename extension
                const filenameInput = modalElement.querySelector('#exportFilename');
                const baseFilename = filenameInput.value.replace(/\.[^/.]+$/, '');
                filenameInput.value = `${baseFilename}.${selectedFormat}`;
            });
        });

        // Focus filename input
        modalElement.querySelector('#exportFilename').focus();
    }

    /**
     * Handle export process
     * @param {string} text - Text to export
     * @param {Object} stats - Text statistics
     */
    async handleExport(text, stats) {
        const format = document.querySelector('.export-option.active')?.dataset.format;
        const filename = document.querySelector('#exportFilename')?.value || 'nordisk-tekst';

        if (!format) {
            modal.alert({
                title: 'Velg format',
                message: 'Vennligst velg et eksportformat.',
                type: 'warning'
            });
            return;
        }

        modal.close();

        // Show loading modal
        const loading = modal.loading({
            title: 'Eksporterer...',
            message: `Genererer ${format.toUpperCase()}-fil...`,
            showProgress: true
        });

        try {
            await this.exportToFormat(text, format, filename, stats, loading);
            loading.close();
            
            modal.alert({
                title: 'Eksport fullført',
                message: `Filen "${filename}" har blitt lastet ned.`,
                type: 'success'
            });
        } catch (error) {
            loading.close();
            modal.alert({
                title: 'Eksportfeil',
                message: `Kunne ikke eksportere til ${format}: ${error.message}`,
                type: 'error'
            });
        }
    }

    /**
     * Export text to specified format
     * @param {string} text - Text to export
     * @param {string} format - Export format
     * @param {string} filename - Output filename
     * @param {Object} stats - Text statistics
     * @param {Object} loading - Loading modal controller
     */
    async exportToFormat(text, format, filename, stats, loading) {
        loading.updateProgress(25);

        switch (format) {
            case 'txt':
                await this.exportToTxt(text, filename);
                break;
            case 'html':
                await this.exportToHtml(text, filename, stats);
                break;
            case 'docx':
                await this.exportToDocx(text, filename, stats, loading);
                break;
            case 'pdf':
                await this.exportToPdf(text, filename, stats, loading);
                break;
            default:
                throw new Error('Ukjent format');
        }

        loading.updateProgress(100);
    }

    /**
     * Export to plain text file
     * @param {string} text - Text content
     * @param {string} filename - Output filename
     */
    async exportToTxt(text, filename) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        this.downloadBlob(blob, filename);
    }

    /**
     * Export to HTML file
     * @param {string} text - Text content
     * @param {string} filename - Output filename
     * @param {Object} stats - Text statistics
     */
    async exportToHtml(text, filename, stats) {
        const html = `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename.replace(/\.[^/.]+$/, '')}</title>
    <style>
        body {
            font-family: Georgia, serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }
        .header {
            border-bottom: 2px solid #3498db;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            font-size: 14px;
            color: #6c757d;
        }
        .content {
            white-space: pre-wrap;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 12px;
            color: #6c757d;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${filename.replace(/\.[^/.]+$/, '')}</h1>
        <p>Eksportert fra Nordisk Tekstredigering</p>
    </div>
    
    <div class="stats">
        <strong>Tekststatistikk:</strong><br>
        Ord: ${stats.words || 0} | 
        Tegn: ${stats.characters || 0} | 
        Setninger: ${stats.sentences || 0} | 
        Avsnitt: ${stats.paragraphs || 0}
        ${stats.readabilityScore ? `<br>Lesbarhet: ${stats.readabilityScore.level} (${stats.readabilityScore.score})` : ''}
    </div>
    
    <div class="content">${this.escapeHtml(text)}</div>
    
    <div class="footer">
        Generert ${new Date().toLocaleString('no-NO')} av Nordisk Tekstredigering
    </div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        this.downloadBlob(blob, filename);
    }

    /**
     * Export to Word document (requires external library)
     * @param {string} text - Text content
     * @param {string} filename - Output filename
     * @param {Object} stats - Text statistics
     * @param {Object} loading - Loading modal controller
     */
    async exportToDocx(text, filename, stats, loading) {
        loading.updateMessage('Laster Word-bibliotek...');
        loading.updateProgress(50);

        try {
            // For a real implementation, you would load docx.js library here
            // const docx = await import('https://cdn.jsdelivr.net/npm/docx@7.3.0/+esm');
            
            // Simplified implementation - export as RTF instead
            const rtfContent = this.generateRtf(text, filename, stats);
            const blob = new Blob([rtfContent], { type: 'application/rtf' });
            this.downloadBlob(blob, filename.replace('.docx', '.rtf'));
            
            loading.updateProgress(90);
        } catch (error) {
            // Fallback to HTML export
            await this.exportToHtml(text, filename.replace('.docx', '.html'), stats);
        }
    }

    /**
     * Export to PDF (requires external library)
     * @param {string} text - Text content
     * @param {string} filename - Output filename
     * @param {Object} stats - Text statistics
     * @param {Object} loading - Loading modal controller
     */
    async exportToPdf(text, filename, stats, loading) {
        loading.updateMessage('Laster PDF-bibliotek...');
        loading.updateProgress(50);

        try {
            // For a real implementation, you would load jsPDF here
            // const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
            
            // Simplified implementation - create a printable HTML version
            const printHtml = this.generatePrintableHtml(text, filename, stats);
            const blob = new Blob([printHtml], { type: 'text/html' });
            this.downloadBlob(blob, filename.replace('.pdf', '_printable.html'));
            
            loading.updateProgress(90);
            
            // Open print dialog
            setTimeout(() => {
                modal.alert({
                    title: 'PDF-eksport',
                    message: 'En utskriftsvennlig HTML-fil har blitt lastet ned. Bruk nettleserens utskriftsfunksjon og velg "Lagre som PDF" for å generere PDF.',
                    type: 'info'
                });
            }, 1000);
            
        } catch (error) {
            // Fallback to HTML export
            await this.exportToHtml(text, filename.replace('.pdf', '.html'), stats);
        }
    }

    /**
     * Generate RTF content
     * @param {string} text - Text content
     * @param {string} filename - Filename
     * @param {Object} stats - Text statistics
     * @returns {string} RTF content
     */
    generateRtf(text, filename, stats) {
        const title = filename.replace(/\.[^/.]+$/, '');
        const statsText = `Ord: ${stats.words || 0} | Tegn: ${stats.characters || 0} | Setninger: ${stats.sentences || 0}`;
        
        return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24
{\\b\\fs28 ${title}\\par}
\\par
{\\i Eksportert fra Nordisk Tekstredigering\\par}
\\par
{\\fs20 ${statsText}\\par}
\\par
${text.replace(/\n/g, '\\par\n')}
\\par
\\par
{\\fs16\\i Generert ${new Date().toLocaleString('no-NO')}\\par}
}`;
    }

    /**
     * Generate printable HTML for PDF export
     * @param {string} text - Text content
     * @param {string} filename - Filename
     * @param {Object} stats - Text statistics
     * @returns {string} Printable HTML
     */
    generatePrintableHtml(text, filename, stats) {
        return `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>${filename.replace(/\.[^/.]+$/, '')}</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        body {
            font-family: Georgia, serif;
            line-height: 1.6;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            color: #000;
        }
        .header {
            border-bottom: 2px solid #000;
            padding-bottom: 10mm;
            margin-bottom: 10mm;
        }
        .stats {
            background: #f5f5f5;
            padding: 5mm;
            margin-bottom: 10mm;
            font-size: 12pt;
        }
        .content {
            white-space: pre-wrap;
            font-size: 12pt;
        }
        .footer {
            margin-top: 10mm;
            padding-top: 5mm;
            border-top: 1px solid #ccc;
            font-size: 10pt;
            text-align: center;
        }
        .no-print {
            background: #e7f3ff;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="no-print">
        <p><strong>Trykk Ctrl+P (eller Cmd+P) og velg "Lagre som PDF" for å generere PDF-fil.</strong></p>
    </div>
    
    <div class="header">
        <h1>${filename.replace(/\.[^/.]+$/, '')}</h1>
        <p>Eksportert fra Nordisk Tekstredigering</p>
    </div>
    
    <div class="stats">
        <strong>Tekststatistikk:</strong><br>
        Ord: ${stats.words || 0} | Tegn: ${stats.characters || 0} | Setninger: ${stats.sentences || 0} | Avsnitt: ${stats.paragraphs || 0}
        ${stats.readabilityScore ? `<br>Lesbarhet: ${stats.readabilityScore.level} (${stats.readabilityScore.score})` : ''}
    </div>
    
    <div class="content">${this.escapeHtml(text)}</div>
    
    <div class="footer">
        Generert ${new Date().toLocaleString('no-NO')} av Nordisk Tekstredigering
    </div>
</body>
</html>`;
    }

    /**
     * Download blob as file
     * @param {Blob} blob - File blob
     * @param {string} filename - Filename
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
     * Get supported export formats
     * @returns {Array} Array of supported formats
     */
    getSupportedFormats() {
        return [
            {
                id: 'txt',
                name: 'Plain Text',
                description: 'Ren tekst uten formatering',
                extension: '.txt',
                mimeType: 'text/plain'
            },
            {
                id: 'html',
                name: 'HTML',
                description: 'Formatert HTML-dokument',
                extension: '.html',
                mimeType: 'text/html'
            },
            {
                id: 'docx',
                name: 'Word-dokument',
                description: 'Microsoft Word-format (RTF fallback)',
                extension: '.docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            },
            {
                id: 'pdf',
                name: 'PDF',
                description: 'Portable Document Format (via print)',
                extension: '.pdf',
                mimeType: 'application/pdf'
            }
        ];
    }
}
