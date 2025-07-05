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
            customerName: document.getElementById('customer-name'),
            customerAddress: document.getElementById('customer-address'),
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
            this.elements.customerName,
            this.elements.customerAddress
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
                org: this.elements.companyOrg?.value || ''
            },
            customer: {
                name: this.elements.customerName?.value || '',
                address: this.elements.customerAddress?.value || ''
            },
            items,
            subtotal,
            vat,
            total,
            date: new Date().toLocaleDateString('no-NO'),
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
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
                    <h1 style="color: #2563eb; margin: 0;">FAKTURA</h1>
                    <p style="margin: 5px 0; font-size: 14px;">Fakturanummer: ${data.number}</p>
                    <p style="margin: 5px 0; font-size: 14px;">Dato: ${data.date}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div>
                        <h3 style="color: #2563eb; margin-bottom: 10px;">Fra:</h3>
                        <p style="margin: 0; white-space: pre-line;"><strong>${data.company.name}</strong><br>${data.company.address}<br>Org.nr: ${data.company.org}</p>
                    </div>
                    <div>
                        <h3 style="color: #2563eb; margin-bottom: 10px;">Til:</h3>
                        <p style="margin: 0; white-space: pre-line;"><strong>${data.customer.name}</strong><br>${data.customer.address}</p>
                    </div>
                </div>
                
                ${data.items.length > 0 ? `
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 2px solid #2563eb;">
                                <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Beskrivelse</th>
                                <th style="padding: 12px; text-align: center; border: 1px solid #d1d5db;">Antall</th>
                                <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Pris eks. MVA</th>
                                <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Total eks. MVA</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(item => `
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #d1d5db;">${item.description}</td>
                                    <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${item.quantity}</td>
                                    <td style="padding: 10px; text-align: right; border: 1px solid #d1d5db;">kr ${item.price.toFixed(2)}</td>
                                    <td style="padding: 10px; text-align: right; border: 1px solid #d1d5db;">kr ${item.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="margin-left: auto; width: 300px; border-top: 2px solid #2563eb; padding-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Subtotal eks. MVA:</span>
                            <span>kr ${data.subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>MVA (25%):</span>
                            <span>kr ${data.vat.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #d1d5db; padding-top: 8px;">
                            <span>Totalt inkl. MVA:</span>
                            <span>kr ${data.total.toFixed(2)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Generate invoice number
     */
    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${year}${month}${day}-${random}`;
    }
    
    /**
     * Export to PDF
     */
    async exportToPDF() {
        try {
            const invoiceData = this.getInvoiceData();
            if (invoiceData.items.length === 0) {
                this.showToast('Legg til minst en vare/tjeneste før eksport', 'warning');
                return;
            }
            
            const htmlContent = this.generateInvoiceHTML(invoiceData);
            
            // Use existing export utility
            if (window.exportUtils && window.exportUtils.exportToPDF) {
                await window.exportUtils.exportToPDF(htmlContent, `faktura-${invoiceData.number}.pdf`);
                this.showToast('Faktura eksportert til PDF', 'success');
            } else {
                this.showToast('PDF-eksport ikke tilgjengelig', 'error');
            }
        } catch (error) {
            console.error('PDF export failed:', error);
            this.showToast('Feil ved PDF-eksport: ' + error.message, 'error');
        }
    }
    
    /**
     * Save template
     */
    saveTemplate() {
        const templateData = {
            company: {
                name: this.elements.companyName?.value || '',
                address: this.elements.companyAddress?.value || '',
                org: this.elements.companyOrg?.value || ''
            }
        };
        
        this.templates.push(templateData);
        localStorage.setItem('invoiceTemplates', JSON.stringify(this.templates));
        this.showToast('Mal lagret', 'success');
    }
    
    /**
     * Load template
     */
    loadTemplate() {
        if (this.templates.length === 0) {
            this.showToast('Ingen maler tilgjengelig', 'warning');
            return;
        }
        
        const template = this.templates[this.templates.length - 1]; // Load latest template
        
        if (this.elements.companyName) this.elements.companyName.value = template.company.name || '';
        if (this.elements.companyAddress) this.elements.companyAddress.value = template.company.address || '';
        if (this.elements.companyOrg) this.elements.companyOrg.value = template.company.org || '';
        
        this.updatePreview();
        this.showToast('Mal lastet inn', 'success');
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
     * Show toast message (will be connected to main app's toast system)
     */
    showToast(message, type = 'info') {
        // Will be connected to main app's toast system
        console.log(`Toast [${type}]: ${message}`);
        
        // Fallback to alert for now
        if (type === 'error') {
            alert('Feil: ' + message);
        }
    }
}
