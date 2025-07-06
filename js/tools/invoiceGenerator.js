/**
 * Faktura-generator for norske småbedrifter
 * Følger samme pattern som eksisterende moduler
 */
export class InvoiceGenerator {
    constructor() {
        this.currentInvoice = null;
        this.templates = this.loadTemplates();
        this.elements = {};
        this.initialized = false;
    }
    
    /**
     * Initialiserer faktura-generatoren
     */
    init() {
        if (this.initialized) return;
        
        this.setupDOM();
        this.setupEventListeners();
        this.loadDefaultTemplate();
        this.initialized = true;
        console.log('InvoiceGenerator initialized');
    }
    
    /**
     * Setup DOM references
     */
    setupDOM() {
        this.elements = {
            companyName: document.getElementById('company-name'),
            companyAddress: document.getElementById('company-address'),
            companyOrg: document.getElementById('company-org'),
            companyAccount: document.getElementById('company-account'),
            customerName: document.getElementById('customer-name'),
            customerAddress: document.getElementById('customer-address'),
            kidMessage: document.getElementById('kid-message'),
            paymentTerms: document.getElementById('payment-terms'),
            itemsList: document.getElementById('items-list'),
            previewContent: document.getElementById('invoice-preview-content'),
            addItemBtn: document.getElementById('add-item-btn'),
            exportPdfBtn: document.getElementById('export-pdf-btn'),
            saveTemplateBtn: document.getElementById('save-template-btn'),
            loadTemplateBtn: document.getElementById('load-template-btn')
        };
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Form input listeners for live preview
        const formInputs = [
            this.elements.companyName,
            this.elements.companyAddress,
            this.elements.companyOrg,
            this.elements.companyAccount,
            this.elements.customerName,
            this.elements.customerAddress,
            this.elements.kidMessage,
            this.elements.paymentTerms
        ];
        
        formInputs.forEach(input => {
            input?.addEventListener('input', () => this.updatePreview());
        });
        
        // Button listeners
        this.elements.addItemBtn?.addEventListener('click', () => this.addInvoiceItem());
        this.elements.exportPdfBtn?.addEventListener('click', () => this.exportToPDF());
        this.elements.saveTemplateBtn?.addEventListener('click', () => this.saveTemplate());
        this.elements.loadTemplateBtn?.addEventListener('click', () => this.loadTemplate());
        
        // Existing items listeners
        this.setupItemListeners();
    }
    
    /**
     * Setup listeners for invoice items
     */
    setupItemListeners() {
        const items = this.elements.itemsList?.querySelectorAll('.invoice-item');
        items?.forEach(item => {
            const inputs = item.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.updatePreview());
            });
            
            const removeBtn = item.querySelector('.remove-item-btn');
            removeBtn?.addEventListener('click', () => {
                item.remove();
                this.updatePreview();
            });
        });
    }
    
    /**
     * Add new invoice item
     */
    addInvoiceItem() {
        const itemHtml = `
            <div class="invoice-item">
                <input type="text" class="item-description" placeholder="Beskrivelse av vare/tjeneste">
                <input type="number" class="item-quantity" placeholder="Antall" value="1" min="1">
                <input type="number" class="item-price" placeholder="Pris eks. MVA" min="0" step="0.01">
                <button type="button" class="remove-item-btn">❌</button>
            </div>
        `;
        
        this.elements.itemsList?.insertAdjacentHTML('beforeend', itemHtml);
        this.setupItemListeners(); // Re-setup listeners for new item
        this.updatePreview();
    }
    
    /**
     * Update invoice preview
     */
    updatePreview() {
        const invoiceData = this.getInvoiceData();
        const previewHtml = this.generateInvoiceHTML(invoiceData);
        
        if (this.elements.previewContent) {
            this.elements.previewContent.innerHTML = previewHtml;
        }
    }
    
    /**
     * Get current invoice data from form
     */
    getInvoiceData() {
        const items = [];
        const itemElements = this.elements.itemsList?.querySelectorAll('.invoice-item') || [];
        
        itemElements.forEach(item => {
            const description = item.querySelector('.item-description')?.value || '';
            const quantity = parseFloat(item.querySelector('.item-quantity')?.value) || 1;
            const price = parseFloat(item.querySelector('.item-price')?.value) || 0;
            
            if (description.trim()) {
                items.push({
                    description,
                    quantity,
                    price,
                    total: quantity * price
                });
            }
        });
        
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const vat = subtotal * 0.25; // 25% MVA
        const total = subtotal + vat;
        
        return {
            company: {
                name: this.elements.companyName?.value || '',
                address: this.elements.companyAddress?.value || '',
                org: this.elements.companyOrg?.value || '',
                account: this.elements.companyAccount?.value || ''
            },
            customer: {
                name: this.elements.customerName?.value || '',
                address: this.elements.customerAddress?.value || ''
            },
            payment: {
                kid: this.elements.kidMessage?.value || '',
                terms: this.elements.paymentTerms?.value || 'Forfallsdato: 30 dager fra fakturadato.\nVed forsinket betaling påløper forsinkelsesrenter etter lov.'
            },
            items,
            subtotal,
            vat,
            total,
            date: this.formatDate(new Date()),
            number: this.generateInvoiceNumber()
        };
    }
    
    /**
     * Generate invoice HTML
     */
    generateInvoiceHTML(data) {
        if (!data.company.name && !data.customer.name && data.items.length === 0) {
            return '<p class="preview-placeholder">Fyll ut skjemaet for å se forhåndsvisning av fakturaen</p>';
        }
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; color: #000000; background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; margin: 0 auto; text-align: center;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #374151; padding-bottom: 20px; background: #ffffff;">
                    <h1 style="color: #374151; margin: 0; font-size: 28px; font-weight: bold;">FAKTURA</h1>
                    <p style="margin: 8px 0; font-size: 16px; color: #1f2937; font-weight: 600;">Fakturanummer: ${data.number}</p>
                    <p style="margin: 8px 0; font-size: 16px; color: #1f2937; font-weight: 600;">Dato: ${data.date}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px; gap: 30px; text-align: left;">
                    <div style="flex: 1; background: #ffffff;">
                        <h3 style="color: #374151; margin-bottom: 12px; font-size: 18px; font-weight: bold; text-align: center;">Fra:</h3>
                        <p style="margin: 0; white-space: pre-line; color: #000000; line-height: 1.6; font-size: 14px; font-weight: 500; text-align: center;"><strong style="color: #000000;">${data.company.name}</strong><br>${data.company.address}${data.company.org ? `<br><strong>Org.nr:</strong> ${data.company.org}` : ''}${data.company.account ? `<br><strong>Konto:</strong> ${data.company.account}` : ''}</p>
                    </div>
                    <div style="flex: 1; background: #ffffff;">
                        <h3 style="color: #374151; margin-bottom: 12px; font-size: 18px; font-weight: bold; text-align: center;">Til:</h3>
                        <p style="margin: 0; white-space: pre-line; color: #000000; line-height: 1.6; font-size: 14px; font-weight: 500; text-align: center;"><strong style="color: #000000;">${data.customer.name}</strong><br>${data.customer.address}</p>
                    </div>
                </div>
                
                ${data.items.length > 0 ? `
                    <table style="width: 100%; border-collapse: collapse; margin: 20px auto; background: #ffffff; border: 2px solid #374151;">
                        <thead>
                            <tr style="background: #374151; color: #ffffff;">
                                <th style="padding: 15px 12px; text-align: center; border: 1px solid #374151; color: #ffffff; font-weight: bold; font-size: 14px;">Beskrivelse</th>
                                <th style="padding: 15px 12px; text-align: center; border: 1px solid #374151; color: #ffffff; font-weight: bold; font-size: 14px;">Antall</th>
                                <th style="padding: 15px 12px; text-align: center; border: 1px solid #374151; color: #ffffff; font-weight: bold; font-size: 14px;">Pris eks. MVA</th>
                                <th style="padding: 15px 12px; text-align: center; border: 1px solid #374151; color: #ffffff; font-weight: bold; font-size: 14px;">Total eks. MVA</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(item => `
                                <tr style="background: #ffffff;">
                                    <td style="padding: 12px; text-align: center; border: 1px solid #d1d5db; color: #000000; font-weight: 600; font-size: 14px;">${item.description}</td>
                                    <td style="padding: 12px; text-align: center; border: 1px solid #d1d5db; color: #000000; font-weight: 600; font-size: 14px;">${item.quantity}</td>
                                    <td style="padding: 12px; text-align: center; border: 1px solid #d1d5db; color: #000000; font-weight: 600; font-size: 14px;">kr ${item.price.toFixed(2)}</td>
                                    <td style="padding: 12px; text-align: center; border: 1px solid #d1d5db; color: #000000; font-weight: 600; font-size: 14px;">kr ${item.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="margin: 20px auto; width: 320px; border-top: 3px solid #374151; padding-top: 18px; background: #ffffff;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #000000; font-weight: 600; font-size: 15px;">
                            <span>Subtotal eks. MVA:</span>
                            <span>kr ${data.subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #000000; font-weight: 600; font-size: 15px;">
                            <span>MVA (25%):</span>
                            <span>kr ${data.vat.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 20px; border-top: 2px solid #1f2937; padding-top: 10px; color: #374151; background: #f8fafc; padding: 12px; border-radius: 4px;">
                            <span>Totalt inkl. MVA:</span>
                            <span>kr ${data.total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    ${data.payment.kid ? `
                    <div style="margin: 30px auto; padding: 18px; background: #f0f9ff; border-radius: 8px; border: 2px solid #374151; max-width: 400px;">
                        <p style="margin: 0; color: #000000; font-weight: bold; font-size: 15px; text-align: center;"><strong>KID/Melding:</strong> ${data.payment.kid}</p>
                    </div>
                    ` : ''}
                    
                    <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 13px; color: #374151; text-align: center; background: #ffffff;">
                        <p style="margin: 8px 0; white-space: pre-line; color: #1f2937; line-height: 1.5; font-weight: 500;">${data.payment.terms}</p>
                        <p style="margin: 18px 0 8px 0; font-style: italic; color: #6b7280; font-size: 12px;">Faktura generert med ScandiText</p>
                        <p style="margin: 0; font-size: 12px;"><a href="https://nordisk.exlo.no/" style="color: #374151; text-decoration: none; font-weight: 600;">https://nordisk.exlo.no/</a></p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Format date to DD.MM.YYYY
     */
    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
    
    /**
     * Generate invoice number
     */
    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Generate a more professional invoice number
        // Format: YYYY-MM-DDXXXX where XXXX is a random 4-digit number
        const random = Math.floor(Math.random() * 9000 + 1000); // 4-digit number from 1000-9999
        
        return `${year}-${month}${day}-${random}`;
    }
    
    /**
     * Export to PDF
     */
    async exportToPDF() {
        try {
            const invoiceData = this.getInvoiceData();
            
            // Validate invoice data
            if (!this.validateInvoiceData(invoiceData)) {
                return; // Error messages shown in validateInvoiceData
            }
            
            // Show loading message
            this.showToast('Genererer PDF...', 'info');
            
            // Use simple window.open method - most reliable
            this.generateInvoicePDFSimple(invoiceData);
            
        } catch (error) {
            console.error('PDF export failed:', error);
            this.showToast('Feil ved PDF-eksport: ' + error.message, 'error');
        }
    }
    
    /**
     * Generate PDF using simple window.open method
     */
    generateInvoicePDFSimple(invoiceData) {
        try {
            const htmlContent = this.generateProfessionalInvoiceHTML(invoiceData);
            
            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes,resizable=yes');
            
            if (!printWindow) {
                this.showToast('Popup ble blokkert av nettleseren. Vennligst tillat popup for denne siden og prøv igjen.', 'error');
                return;
            }
            
            // Write content to new window
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            // Set a proper title
            printWindow.document.title = `Faktura ${invoiceData.number} - ${invoiceData.company.name}`;
            
            // Show success message with instructions
            this.showToast('Faktura-vindu åpnet! For ren PDF: Ctrl+P → Mer innstillinger → Fjern "Headers and footers"', 'success');
            
            // Wait for content to load, then auto-trigger print dialog
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.focus();
                    
                    // Auto-trigger print dialog after a short delay
                    try {
                        printWindow.print();
                    } catch (error) {
                        console.warn('Could not auto-trigger print dialog:', error);
                        this.showToast('Bruk Ctrl+P eller "Skriv ut"-menyen for å lagre som PDF', 'info');
                    }
                }, 500);
            };
            
            // Handle case where window is closed without printing
            const checkClosed = setInterval(() => {
                if (printWindow.closed) {
                    clearInterval(checkClosed);
                    console.log('Print window closed');
                }
            }, 1000);
            
        } catch (error) {
            console.error('PDF generation failed:', error);
            this.showToast('Feil ved PDF-generering: ' + error.message, 'error');
        }
    }
    
    /**
     * Validate invoice data before export
     */
    validateInvoiceData(invoiceData) {
        // Check if company info is provided
        if (!invoiceData.company.name.trim()) {
            this.showToast('Vennligst fyll ut firmanavn før eksport', 'warning');
            document.getElementById('company-name')?.focus();
            return false;
        }
        
        // Check if customer info is provided
        if (!invoiceData.customer.name.trim()) {
            this.showToast('Vennligst fyll ut kundenavn før eksport', 'warning');
            document.getElementById('customer-name')?.focus();
            return false;
        }
        
        // Check if at least one item is added
        if (invoiceData.items.length === 0) {
            this.showToast('Legg til minst en vare/tjeneste før eksport', 'warning');
            document.querySelector('.item-description')?.focus();
            return false;
        }
        
        // Check if all items have descriptions and valid prices
        for (const item of invoiceData.items) {
            if (!item.description.trim()) {
                this.showToast('Alle varer/tjenester må ha en beskrivelse', 'warning');
                return false;
            }
            if (item.price <= 0) {
                this.showToast('Alle varer/tjenester må ha en gyldig pris større enn 0', 'warning');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Alternative PDF generation using iframe to avoid browser headers
     */
    generateInvoicePDFAlternative(invoiceData) {
        try {
            const htmlContent = this.generateProfessionalInvoiceHTML(invoiceData);
            
            // Create a hidden iframe for printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.top = '-9999px';
            iframe.style.left = '-9999px';
            iframe.style.width = '210mm';
            iframe.style.height = '297mm';
            iframe.style.border = 'none';
            
            document.body.appendChild(iframe);
            
            // Write content to iframe
            iframe.contentDocument.open();
            iframe.contentDocument.write(htmlContent);
            iframe.contentDocument.close();
            
            // Focus iframe and trigger print
            iframe.contentWindow.focus();
            
            setTimeout(() => {
                try {
                    iframe.contentWindow.print();
                    this.showToast('Print-dialog åpnet! Velg "Lagre som PDF" og fjern headers/footers i innstillinger.', 'success');
                } catch (error) {
                    console.warn('Could not auto-trigger print dialog:', error);
                    this.showToast('Print-funksjon ikke tilgjengelig. Prøv Ctrl+P.', 'warning');
                }
                
                // Clean up iframe after a delay
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.error('Alternative PDF generation failed:', error);
            this.showToast('Feil ved PDF-generering: ' + error.message, 'error');
        }
    }
    
    /**
     * Generate professional invoice HTML for PDF
     */
    generateProfessionalInvoiceHTML(data) {
        return `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faktura ${data.number} - ${data.company.name}</title>
    <!-- Prevent browser from showing headers/footers in print -->
    <meta name="format-detection" content="telephone=no">
    <meta name="robots" content="noindex, nofollow">
    <style>
        @page {
            size: A4;
            margin: 0;
            /* Remove all browser headers and footers */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            background: white;
            margin: 15mm;
            padding: 0;
            /* Force remove any browser headers/footers */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .invoice-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
            position: relative;
        }
        
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }
        
        .invoice-title {
            font-size: 36pt;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: 2px;
            margin: 0;
        }
        
        .invoice-meta {
            text-align: right;
            font-size: 11pt;
            color: #374151;
        }
        
        .invoice-meta p {
            margin: 4px 0;
            font-weight: 500;
        }
        
        .invoice-meta strong {
            color: #2563eb;
        }
        
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 50px;
            gap: 40px;
        }
        
        .company-info, .customer-info {
            flex: 1;
            max-width: 45%;
        }
        
        .info-header {
            font-size: 13pt;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 4px;
        }
        
        .info-content {
            font-size: 11pt;
            line-height: 1.6;
            white-space: pre-line;
            color: #374151;
        }
        
        .company-name, .customer-name {
            font-weight: 700;
            font-size: 12pt;
            margin-bottom: 6px;
            color: #111827;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .items-table th {
            background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
            color: white;
            font-weight: 700;
            padding: 16px 12px;
            text-align: center;
            border: none;
            font-size: 11pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .items-table th:nth-child(2),
        .items-table th:nth-child(3),
        .items-table th:nth-child(4) {
            text-align: center;
        }
        
        .items-table td {
            padding: 14px 12px;
            border: 1px solid #e5e7eb;
            font-size: 11pt;
            vertical-align: top;
            text-align: center;
        }
        
        .items-table td:nth-child(2),
        .items-table td:nth-child(3),
        .items-table td:nth-child(4) {
            text-align: center;
            font-family: 'Courier New', monospace;
            font-weight: 500;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .items-table tr:hover {
            background: #f3f4f6;
        }
        
        .totals-section {
            margin-left: auto;
            width: 350px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .totals-table td {
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11pt;
        }
        
        .totals-table .label {
            text-align: left;
            font-weight: 600;
            color: #374151;
        }
        
        .totals-table .amount {
            text-align: right;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            color: #111827;
        }
        
        .total-final {
            border-top: 3px solid #374151;
            background: white;
            font-weight: 700;
            font-size: 14pt;
            color: #374151;
        }
        
        .total-final td {
            padding: 16px 0;
            border-bottom: none;
        }
        
        .invoice-footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            font-size: 10pt;
            color: #6b7280;
            text-align: center;
            background: #f9fafb;
            margin-left: -20px;
            margin-right: -20px;
            padding-left: 20px;
            padding-right: 20px;
            padding-bottom: 20px;
        }
        
        .invoice-footer p {
            margin: 8px 0;
        }
        
        .invoice-footer .payment-info {
            font-weight: 600;
            color: #374151;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .invoice-container {
                box-shadow: none;
            }
            
            /* Hide browser headers/footers */
            @page {
                margin: 15mm;
                size: A4;
                /* Remove browser headers and footers */
                margin-top: 15mm;
                margin-bottom: 15mm;
            }
            
            /* Ensure our footer is not overlapped by browser footer */
            .invoice-footer {
                margin-bottom: 20mm;
                page-break-inside: avoid;
            }
            
            /* Hide any browser-generated content */
            body::before,
            body::after {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div>
                <div class="invoice-title">FAKTURA</div>
            </div>
            <div class="invoice-meta">
                <p><strong>Fakturanummer:</strong> ${data.number}</p>
                <p><strong>Fakturadato:</strong> ${data.date}</p>
                <p><strong>Forfallsdato:</strong> ${this.addDaysToDate(data.date, 30)}</p>
            </div>
        </div>
        
        <div class="invoice-details">
            <div class="company-info">
                <div class="info-header">Fakturert av</div>
                <div class="info-content">
                    <div class="company-name">${data.company.name}</div>
                    ${data.company.address}
                    ${data.company.org ? `<br><strong>Org.nr:</strong> ${data.company.org}` : ''}
                    ${data.company.account ? `<br><strong>Kontonummer:</strong> ${data.company.account}` : ''}
                </div>
            </div>
            
            <div class="customer-info">
                <div class="info-header">Fakturert til</div>
                <div class="info-content">
                    <div class="customer-name">${data.customer.name}</div>
                    ${data.customer.address}
                </div>
            </div>
        </div>
        
        ${data.items.length > 0 ? `
        <table class="items-table">
            <thead>
                <tr>
                    <th>Beskrivelse</th>
                    <th>Antall</th>
                    <th>Pris eks. MVA</th>
                    <th>Total eks. MVA</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>kr ${item.price.toFixed(2)}</td>
                        <td>kr ${item.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="totals-section">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal eks. MVA:</td>
                    <td class="amount">kr ${data.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td class="label">MVA (25%):</td>
                    <td class="amount">kr ${data.vat.toFixed(2)}</td>
                </tr>
                <tr class="total-final">
                    <td class="label">Totalt inkl. MVA:</td>
                    <td class="amount">kr ${data.total.toFixed(2)}</td>
                </tr>
            </table>
        </div>
        ` : ''}
        
        <div class="invoice-footer">
            ${data.payment.kid ? `
            <div style="margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #2563eb;">
                <p class="payment-info"><strong>KID/Faktura melding:</strong> ${data.payment.kid}</p>
            </div>
            ` : ''}
            
            <p class="payment-info"><strong>Betalingsinformasjon:</strong></p>
            <p style="white-space: pre-line;">${data.payment.terms}</p>
            ${data.company.account ? `<p><strong>Kontonummer:</strong> ${data.company.account}</p>` : ''}
            <p>Ved spørsmål om denne fakturaen, kontakt ${data.company.name}</p>
            <p style="margin-top: 20px; font-style: italic;">Faktura generert med Nordisk Verktøysuite</p>
            <p style="margin: 5px 0; font-size: 9pt; color: #6b7280;"><a href="https://nordisk.exlo.no/" style="color: #2563eb; text-decoration: none;">https://nordisk.exlo.no/</a></p>
        </div>
    </div>
</body>
</html>`;
    }
    
    /**
     * Add days to date string (DD.MM.YYYY format)
     */
    addDaysToDate(dateString, days) {
        const [day, month, year] = dateString.split('.');
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + days);
        return this.formatDate(date);
    }
    
    /**
     * Save template - Lagrer firmaopplysninger og betalingsbetingelser som mal
     * Dette gjør at du slipper å fylle ut de samme opplysningene hver gang
     */
    saveTemplate() {
        const templateData = {
            company: {
                name: this.elements.companyName?.value || '',
                address: this.elements.companyAddress?.value || '',
                org: this.elements.companyOrg?.value || '',
                account: this.elements.companyAccount?.value || ''
            },
            payment: {
                terms: this.elements.paymentTerms?.value || ''
            }
        };
        
        // Sjekk om det er noe å lagre
        const hasData = Object.values(templateData.company).some(value => value.trim() !== '') ||
                       (templateData.payment.terms && templateData.payment.terms.trim() !== '');
        
        if (!hasData) {
            this.showToast('Fyll ut firmaopplysninger før du lagrer mal', 'warning');
            return;
        }
        
        this.templates.push(templateData);
        localStorage.setItem('invoiceTemplates', JSON.stringify(this.templates));
        this.showToast('Firmamal lagret! Bruk "Last inn mal" for å gjenbruke opplysningene.', 'success');
    }
    
    /**
     * Load template - Laster inn tidligere lagrede firmaopplysninger
     */
    loadTemplate() {
        if (this.templates.length === 0) {
            this.showToast('Ingen lagrede maler funnet. Bruk "Lagre mal" etter å ha fylt ut firmaopplysningene.', 'warning');
            return;
        }
        
        const template = this.templates[this.templates.length - 1]; // Load latest template
        
        if (this.elements.companyName) this.elements.companyName.value = template.company.name || '';
        if (this.elements.companyAddress) this.elements.companyAddress.value = template.company.address || '';
        if (this.elements.companyOrg) this.elements.companyOrg.value = template.company.org || '';
        if (this.elements.companyAccount) this.elements.companyAccount.value = template.company.account || '';
        if (this.elements.paymentTerms) this.elements.paymentTerms.value = template.payment?.terms || '';
        
        this.updatePreview();
        this.showToast('Firmaopplysninger lastet inn fra mal', 'success');
    }
    
    /**
     * Load templates from localStorage
     */
    loadTemplates() {
        try {
            return JSON.parse(localStorage.getItem('invoiceTemplates') || '[]');
        } catch (error) {
            console.warn('Failed to load templates:', error);
            return [];
        }
    }
    
    /**
     * Load default template (empty for now)
     */
    loadDefaultTemplate() {
        // Could load a default template here if needed
    }
    
    /**
     * Show toast message (connected to main app's toast system)
     */
    showToast(message, type = 'info') {
        // Use main app's toast system if available
        if (this.app && this.app.showToast) {
            this.app.showToast(message, type);
        } else {
            // Fallback to console and alert
            console.log(`Toast [${type}]: ${message}`);
            if (type === 'error') {
                alert('Feil: ' + message);
            } else if (type === 'success') {
                console.log('✅ ' + message);
            }
        }
    }
}
