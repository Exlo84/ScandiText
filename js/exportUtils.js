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
        this.supportedFormats = ['txt', 'html', 'md', 'docx', 'pdf'];
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
                <div class="export-option" data-format="md">
                    <div class="export-icon">📖</div>
                    <div class="export-title">Markdown</div>
                    <div class="export-description">Markdown-format for dokumentasjon (.md)</div>
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
            case 'md':
                await this.exportToMd(text, filename, stats);
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
     * Export to Markdown file
     * @param {string} text - Text content
     * @param {string} filename - Output filename
     * @param {Object} stats - Text statistics
     */
    async exportToMd(text, filename, stats) {
        // Create markdown content with metadata and stats
        const title = filename.replace(/\.[^/.]+$/, '');
        const date = new Date().toISOString().split('T')[0];
        
        let markdown = `# ${title}\n\n`;
        
        // Add metadata section
        markdown += `*Eksportert fra Nordisk Tekstredigering den ${new Date().toLocaleDateString('no-NO')}*\n\n`;
        
        // Add statistics section
        if (stats && Object.keys(stats).length > 0) {
            markdown += `## Tekststatistikk\n\n`;
            markdown += `- **Ord:** ${stats.words || 0}\n`;
            markdown += `- **Tegn:** ${stats.characters || 0}\n`;
            markdown += `- **Setninger:** ${stats.sentences || 0}\n`;
            markdown += `- **Avsnitt:** ${stats.paragraphs || 0}\n`;
            
            if (stats.readabilityScore) {
                markdown += `- **Lesbarhet:** ${stats.readabilityScore.level} (${stats.readabilityScore.score})\n`;
            }
            
            if (stats.language) {
                markdown += `- **Språk:** ${stats.language}\n`;
            }
            
            markdown += `\n---\n\n`;
        }
        
        // Add main content
        markdown += `## Innhold\n\n`;
        
        // Convert text to markdown-friendly format
        const paragraphs = text.split('\n').filter(p => p.trim());
        paragraphs.forEach(paragraph => {
            // Simple markdown formatting - preserve line breaks and basic structure
            const trimmed = paragraph.trim();
            if (trimmed) {
                markdown += `${trimmed}\n\n`;
            }
        });
        
        // Add footer
        markdown += `---\n\n`;
        markdown += `*Generert av [Nordisk Tekstredigering](https://scanditext.exlo.no) - Avansert tekstbehandling for nordiske språk*\n`;

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
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
        loading.updateMessage('Genererer PDF...');
        loading.updateProgress(30);

        try {
            // Try to use browser's built-in PDF generation
            if (window.showSaveFilePicker) {
                // Modern browsers with File System Access API
                await this.generateModernPdf(text, filename, stats, loading);
            } else {
                // Fallback to improved HTML PDF generation
                await this.generateHtmlPdf(text, filename, stats, loading);
            }
            
        } catch (error) {
            console.warn('PDF generation failed, using fallback:', error);
            // Final fallback to HTML export
            await this.exportToHtml(text, filename.replace('.pdf', '.html'), stats);
        }
    }

    /**
     * Generate PDF using modern browser APIs
     */
    async generateModernPdf(text, filename, stats, loading) {
        loading.updateProgress(50);
        
        // Create a dedicated PDF-optimized HTML
        const pdfHtml = this.generatePdfOptimizedHtml(text, filename, stats);
        
        // Create a hidden iframe for PDF generation
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '210mm'; // A4 width
        iframe.style.height = '297mm'; // A4 height
        document.body.appendChild(iframe);
        
        // Write content to iframe
        iframe.contentDocument.open();
        iframe.contentDocument.write(pdfHtml);
        iframe.contentDocument.close();
        
        loading.updateProgress(70);
        
        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            // Try to use the iframe's print functionality
            iframe.contentWindow.print();
            
            modal.confirm({
                title: 'PDF-generering',
                message: 'Utskriftsdialogen er åpnet. Velg "Lagre som PDF" som destinasjon for å generere PDF-filen.',
                confirmText: 'OK',
                cancelText: 'Last ned HTML i stedet',
                onConfirm: () => {
                    document.body.removeChild(iframe);
                },
                onCancel: () => {
                    document.body.removeChild(iframe);
                    const blob = new Blob([pdfHtml], { type: 'text/html' });
                    this.downloadBlob(blob, filename.replace('.pdf', '_pdf-optimized.html'));
                }
            });
            
        } catch (error) {
            document.body.removeChild(iframe);
            throw error;
        }
        
        loading.updateProgress(100);
    }

    /**
     * Generate HTML optimized for PDF conversion
     */
    generateHtmlPdf(text, filename, stats, loading) {
        loading.updateProgress(60);
        
        const pdfHtml = this.generatePdfOptimizedHtml(text, filename, stats);
        const blob = new Blob([pdfHtml], { type: 'text/html' });
        
        this.downloadBlob(blob, filename.replace('.pdf', '_pdf-ready.html'));
        
        loading.updateProgress(90);
        
        setTimeout(() => {
            modal.alert({
                title: 'PDF-klar HTML',
                message: 'En PDF-optimalisert HTML-fil har blitt lastet ned. Åpne filen i nettleseren og bruk Ctrl+P → "Lagre som PDF" for beste resultat.',
                type: 'info'
            });
        }, 500);
    }

    /**
     * Generate PDF-optimized HTML content
     */
    generatePdfOptimizedHtml(text, filename, stats) {
        const title = filename.replace(/\.[^/.]+$/, '');
        const date = new Date().toLocaleDateString('no-NO');
        
        return `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 1cm;
            margin-bottom: 1cm;
        }
        
        .title {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 0.5cm;
            color: #2c3e50;
        }
        
        .subtitle {
            font-size: 12pt;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .stats-box {
            background: #ecf0f1;
            padding: 0.5cm;
            border-radius: 4px;
            margin: 1cm 0;
            font-size: 10pt;
            display: flex;
            justify-content: space-around;
            text-align: center;
        }
        
        .stat-item {
            flex: 1;
        }
        
        .stat-value {
            font-weight: bold;
            font-size: 14pt;
            color: #2c3e50;
        }
        
        .content {
            font-size: 12pt;
            text-align: justify;
            margin-top: 1cm;
        }
        
        .footer {
            position: fixed;
            bottom: 1cm;
            left: 2cm;
            right: 2cm;
            text-align: center;
            font-size: 9pt;
            color: #7f8c8d;
            border-top: 1px solid #bdc3c7;
            padding-top: 0.3cm;
        }
        
        /* Print-specific styles */
        @media print {
            body { print-color-adjust: exact; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="title">${title}</div>
        <div class="subtitle">Generert av Nordisk Tekstredigering • ${date}</div>
    </header>
    
    <div class="stats-box">
        <div class="stat-item">
            <div class="stat-value">${stats.words || 0}</div>
            <div>Ord</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.characters || 0}</div>
            <div>Tegn</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.sentences || 0}</div>
            <div>Setninger</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.paragraphs || 0}</div>
            <div>Avsnitt</div>
        </div>
        ${stats.readabilityScore ? `
        <div class="stat-item">
            <div class="stat-value">${Math.round(stats.readabilityScore)}</div>
            <div>Lesbarhet</div>
        </div>` : ''}
    </div>
    
    <main class="content">
        ${text.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('')}
    </main>
    
    <footer class="footer">
        Nordisk Tekstredigering - Avansert tekstanalyse for nordiske språk
    </footer>
</body>
</html>`;
    }

    /**
     * Generate enhanced RTF content with better Word compatibility
     * @param {string} text - Text content
     * @param {string} filename - Filename
     * @param {Object} stats - Text statistics
     * @returns {string} Enhanced RTF content
     */
    generateRtf(text, filename, stats) {
        const title = filename.replace(/\.[^/.]+$/, '');
        const date = new Date().toLocaleDateString('no-NO');
        const time = new Date().toLocaleTimeString('no-NO');
        
        // Enhanced RTF with better formatting and Nordic character support
        const rtfHeader = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1044{\\fonttbl{\\f0\\froman\\fprq2\\fcharset0 Times New Roman;}{\\f1\\fswiss\\fprq2\\fcharset0 Arial;}}
{\\colortbl ;\\red47\\green79\\blue79;\\red52\\green152\\blue219;\\red39\\green174\\blue96;}
{\\*\\generator Nordisk Tekstredigering RTF Export;}
\\viewkind4\\uc1`;

        const rtfTitle = `\\pard\\keep\\keepn\\widctlpar\\s1\\sb360\\sa180\\sl288\\slmult1\\cf1\\f1\\fs32\\b ${this.escapeRtf(title)}\\par`;
        
        const rtfSubtitle = `\\pard\\widctlpar\\sa180\\sl276\\slmult1\\cf2\\f1\\fs18\\i Eksportert fra Nordisk Tekstredigering • ${date} ${time}\\par`;
        
        // Stats table
        const statsTable = `\\pard\\widctlpar\\sa180\\trowd\\trgaph70\\trleft-70\\trbrdrl\\brdrs\\brdrw10 \\trbrdrt\\brdrs\\brdrw10 \\trbrdrr\\brdrs\\brdrw10 \\trbrdrb\\brdrs\\brdrw10 
\\clbrdrl\\brdrw10\\brdrs\\clbrdrt\\brdrw10\\brdrs\\clbrdrr\\brdrw10\\brdrs\\clbrdrb\\brdrw10\\brdrs \\cellx1800
\\clbrdrl\\brdrw10\\brdrs\\clbrdrt\\brdrw10\\brdrs\\clbrdrr\\brdrw10\\brdrs\\clbrdrb\\brdrw10\\brdrs \\cellx3600
\\clbrdrl\\brdrw10\\brdrs\\clbrdrt\\brdrw10\\brdrs\\clbrdrr\\brdrw10\\brdrs\\clbrdrb\\brdrw10\\brdrs \\cellx5400
\\clbrdrl\\brdrw10\\brdrs\\clbrdrt\\brdrw10\\brdrs\\clbrdrr\\brdrw10\\brdrs\\clbrdrb\\brdrw10\\brdrs \\cellx7200
\\cf3\\f1\\fs20\\b Ord\\cell Tegn\\cell Setninger\\cell Avsnitt\\cell\\row
\\cf0\\f1\\fs18 ${stats.words || 0}\\cell ${stats.characters || 0}\\cell ${stats.sentences || 0}\\cell ${stats.paragraphs || 0}\\cell\\row`;

        // Process text with proper paragraph formatting
        const paragraphs = text.split('\n\n').filter(p => p.trim());
        const rtfContent = paragraphs.map(paragraph => {
            const cleanPara = this.escapeRtf(paragraph.replace(/\n/g, ' ').trim());
            return `\\pard\\widctlpar\\sa180\\sl276\\slmult1\\f0\\fs24 ${cleanPara}\\par`;
        }).join('\n');

        const rtfFooter = `\\pard\\widctlpar\\sa180\\sl276\\slmult1\\cf2\\f1\\fs16\\i Tekstanalysefunksjoner: 
${stats.readabilityScore ? `Lesbarhetsscore: ${Math.round(stats.readabilityScore)} • ` : ''}
${stats.averageWordsPerSentence ? `Gj.snitt ord per setning: ${stats.averageWordsPerSentence.toFixed(1)} • ` : ''}
${stats.averageWordLength ? `Gj.snitt ordlengde: ${stats.averageWordLength.toFixed(1)} tegn` : ''}\\par
}`;

        return `${rtfHeader}
${rtfTitle}
${rtfSubtitle}
${statsTable}
\\pard\\widctlpar\\sa180\\par
${rtfContent}
\\pard\\widctlpar\\sa180\\par
${rtfFooter}`;
    }

    /**
     * Escape RTF special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped RTF text
     */
    escapeRtf(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/æ/g, '\\u230?')
            .replace(/ø/g, '\\u248?')
            .replace(/å/g, '\\u229?')
            .replace(/Æ/g, '\\u198?')
            .replace(/Ø/g, '\\u216?')
            .replace(/Å/g, '\\u197?')
            .replace(/é/g, '\\u233?')
            .replace(/è/g, '\\u232?')
            .replace(/ê/g, '\\u234?')
            .replace(/ë/g, '\\u235?');
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
