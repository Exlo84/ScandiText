/**
 * Modal UI Module for Nordisk Tekstredigering
 * Handles modal creation, display, and interaction
 * @author GitHub Copilot
 */

/**
 * Modal manager for creating and managing modal dialogs
 */
export class Modal {
    constructor() {
        this.activeModal = null;
        this.zIndexCounter = 1000;
        this.initializeEventListeners();
    }

    /**
     * Initialize global event listeners for modal management
     */
    initializeEventListeners() {
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close();
            }
        });

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') && this.activeModal) {
                this.close();
            }
        });
    }

    /**
     * Create and show a modal
     * @param {Object} options - Modal configuration
     * @returns {HTMLElement} Modal element
     */
    create(options = {}) {
        const {
            title = 'Modal',
            body = '',
            footer = null,
            className = '',
            size = 'medium',
            closable = true,
            onClose = null,
            onOpen = null
        } = options;

        // Close existing modal if any
        if (this.activeModal) {
            this.close();
        }

        // Create modal structure
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.zIndex = this.zIndexCounter++;

        const modal = document.createElement('div');
        modal.className = `modal ${className} modal-${size}`;

        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const titleElement = document.createElement('h3');
        titleElement.className = 'modal-title';
        titleElement.textContent = title;
        header.appendChild(titleElement);

        if (closable) {
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '×';
            closeButton.setAttribute('aria-label', 'Lukk modal');
            closeButton.addEventListener('click', () => this.close());
            header.appendChild(closeButton);
        }

        // Create body
        const bodyElement = document.createElement('div');
        bodyElement.className = 'modal-body';
        
        if (typeof body === 'string') {
            bodyElement.innerHTML = body;
        } else if (body instanceof HTMLElement) {
            bodyElement.appendChild(body);
        }

        // Create footer if provided
        let footerElement = null;
        if (footer) {
            footerElement = document.createElement('div');
            footerElement.className = 'modal-footer';
            
            if (typeof footer === 'string') {
                footerElement.innerHTML = footer;
            } else if (footer instanceof HTMLElement) {
                footerElement.appendChild(footer);
            } else if (Array.isArray(footer)) {
                footer.forEach(button => {
                    if (button instanceof HTMLElement) {
                        footerElement.appendChild(button);
                    }
                });
            }
        }

        // Assemble modal
        modal.appendChild(header);
        modal.appendChild(bodyElement);
        if (footerElement) {
            modal.appendChild(footerElement);
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Store references
        this.activeModal = {
            overlay,
            modal,
            onClose: onClose || (() => {})
        };

        // Show modal with animation
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            
            // Update modal language content
            if (window.app && window.app.i18n) {
                setTimeout(() => {
                    window.app.i18n.updateUI();
                }, 50);
            }
            
            if (onOpen) onOpen(modal);
        });

        // Return modal object with methods
        return {
            element: modal,
            close: () => this.close()
        };
    }

    /**
     * Close the active modal
     */
    close() {
        if (!this.activeModal) return;

        const { overlay, onClose } = this.activeModal;
        
        // Remove active class for animation
        overlay.classList.remove('active');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            onClose();
        }, 300);

        this.activeModal = null;
    }

    /**
     * Create a confirmation modal
     * @param {Object} options - Confirmation options
     * @returns {Promise} Promise that resolves with user choice
     */
    confirm(options = {}) {
        const {
            title = 'Bekreft',
            message = 'Er du sikker?',
            confirmText = 'Ja',
            cancelText = 'Avbryt',
            confirmClass = 'btn-primary',
            cancelClass = 'btn-secondary'
        } = options;

        return new Promise((resolve) => {
            const body = document.createElement('div');
            body.innerHTML = `
                <p style="margin-bottom: 20px; line-height: 1.6;">${message}</p>
            `;

            const footer = document.createElement('div');
            footer.className = 'modal-footer';

            const cancelButton = document.createElement('button');
            cancelButton.className = `btn ${cancelClass}`;
            cancelButton.textContent = cancelText;
            cancelButton.addEventListener('click', () => {
                resolve(false);
                this.close();
            });

            const confirmButton = document.createElement('button');
            confirmButton.className = `btn ${confirmClass}`;
            confirmButton.textContent = confirmText;
            confirmButton.addEventListener('click', () => {
                resolve(true);
                this.close();
            });

            footer.appendChild(cancelButton);
            footer.appendChild(confirmButton);

            this.create({
                title,
                body,
                footer,
                size: 'small',
                onClose: () => resolve(false)
            });

            // Focus confirm button
            setTimeout(() => confirmButton.focus(), 100);
        });
    }

    /**
     * Create an alert modal
     * @param {Object} options - Alert options
     * @returns {Promise} Promise that resolves when closed
     */
    alert(options = {}) {
        const {
            title = 'Varsel',
            message = '',
            buttonText = 'OK',
            type = 'info'
        } = options;

        return new Promise((resolve) => {
            const body = document.createElement('div');
            body.innerHTML = `
                <div class="alert alert-${type}">
                    <p style="margin: 0; line-height: 1.6;">${message}</p>
                </div>
            `;

            const footer = document.createElement('div');
            footer.className = 'modal-footer';

            const okButton = document.createElement('button');
            okButton.className = 'btn btn-primary';
            okButton.textContent = buttonText;
            okButton.addEventListener('click', () => {
                resolve();
                this.close();
            });

            footer.appendChild(okButton);

            this.create({
                title,
                body,
                footer,
                size: 'small',
                onClose: () => resolve()
            });

            // Focus OK button
            setTimeout(() => okButton.focus(), 100);
        });
    }

    /**
     * Create a loading modal
     * @param {Object} options - Loading options
     * @returns {Object} Loading modal controller
     */
    loading(options = {}) {
        const {
            title = 'Laster...',
            message = 'Vennligst vent...',
            showProgress = false,
            cancellable = false,
            onCancel = null
        } = options;

        const body = document.createElement('div');
        body.style.textAlign = 'center';
        body.innerHTML = `
            <div class="loading-spinner" style="margin: 20px auto;"></div>
            <p style="margin: 20px 0; line-height: 1.6;">${message}</p>
            ${showProgress ? '<div class="progress-bar"><div class="progress-fill"></div></div>' : ''}
        `;

        let footer = null;
        if (cancellable) {
            footer = document.createElement('div');
            footer.className = 'modal-footer';

            const cancelButton = document.createElement('button');
            cancelButton.className = 'btn btn-secondary';
            cancelButton.textContent = 'Avbryt';
            cancelButton.addEventListener('click', () => {
                if (onCancel) onCancel();
                this.close();
            });

            footer.appendChild(cancelButton);
        }

        const modal = this.create({
            title,
            body,
            footer,
            size: 'small',
            closable: cancellable
        });

        return {
            modal,
            updateProgress: (percent) => {
                const progressFill = modal.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
                }
            },
            updateMessage: (newMessage) => {
                const messageElement = modal.querySelector('p');
                if (messageElement) {
                    messageElement.textContent = newMessage;
                }
            },
            close: () => this.close()
        };
    }

    /**
     * Check if a modal is currently active
     * @returns {boolean} True if modal is active
     */
    isActive() {
        return this.activeModal !== null;
    }

    /**
     * Get the current active modal element
     * @returns {HTMLElement|null} Active modal element or null
     */
    getActiveModal() {
        return this.activeModal ? this.activeModal.modal : null;
    }

    /**
     * Create a custom modal with specific content
     * @param {HTMLElement} content - Custom content element
     * @param {Object} options - Modal options
     * @returns {HTMLElement} Modal element
     */
    createCustom(content, options = {}) {
        return this.create({
            ...options,
            body: content
        });
    }

    /**
     * Add CSS animation classes for custom animations
     * @param {string} animationClass - CSS class for animation
     */
    addAnimation(animationClass) {
        if (this.activeModal) {
            this.activeModal.modal.classList.add(animationClass);
        }
    }

    /**
     * Remove CSS animation classes
     * @param {string} animationClass - CSS class to remove
     */
    removeAnimation(animationClass) {
        if (this.activeModal) {
            this.activeModal.modal.classList.remove(animationClass);
        }
    }

    /**
     * Set focus to specific element within modal
     * @param {string} selector - CSS selector for element to focus
     */
    focusElement(selector) {
        if (this.activeModal) {
            const element = this.activeModal.modal.querySelector(selector);
            if (element) {
                element.focus();
            }
        }
    }

    /**
     * Resize modal to fit content
     */
    resize() {
        if (this.activeModal) {
            // Trigger reflow to recalculate dimensions
            this.activeModal.modal.style.height = 'auto';
            this.activeModal.modal.style.width = 'auto';
        }
    }
}

// Create global modal instance
export const modal = new Modal();
