/**
 * Tool Manager for Nordisk Verktøysuite
 * Handles navigation between different tools
 */
export class ToolManager {
    constructor(app) {
        this.app = app; // Reference to main app
        this.currentTool = 'text-editor';
        this.tools = {};
        this.initialized = false;
    }
    
    /**
     * Initialize tool manager
     */
    async init() {
        if (this.initialized) return;
        
        this.setupNavigation();
        this.initializeTools();
        this.showTool('text-editor'); // Default tool
        
        this.initialized = true;
        console.log('ToolManager initialized');
    }
    
    /**
     * Setup navigation event listeners
     */
    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const toolName = e.target.dataset.tool;
                this.showTool(toolName);
            });
        });
    }
    
    /**
     * Initialize all tools (lazy loading)
     */
    initializeTools() {
        // Tools will be initialized when first accessed
        this.tools = {
            'text-editor': null, // Main text editor (always active)
            'invoice': null,     // Will be loaded dynamically
            'social': null,      // Will be loaded dynamically  
            'password': null     // Will be loaded dynamically
        };
    }
    
    /**
     * Show specific tool
     */
    async showTool(toolName) {
        if (this.currentTool === toolName) return;
        
        // Hide all tool sections
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        
        // Update navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-pressed', 'false');
        });
        
        // Show selected tool section
        const toolSection = document.getElementById(`${toolName}-tool`);
        if (toolSection) {
            toolSection.classList.remove('hidden');
            toolSection.classList.add('active');
        }
        
        // Update active nav tab
        const activeTab = document.querySelector(`[data-tool="${toolName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-pressed', 'true');
        }
        
        // Initialize tool if needed
        await this.initializeTool(toolName);
        
        this.currentTool = toolName;
        
        // Update URL hash for bookmarking
        if (toolName !== 'text-editor') {
            window.location.hash = toolName;
        } else {
            window.location.hash = '';
        }
        
        console.log(`Switched to tool: ${toolName}`);
    }
    
    /**
     * Initialize specific tool (lazy loading)
     */
    async initializeTool(toolName) {
        if (this.tools[toolName] || toolName === 'text-editor') {
            return; // Already initialized or is main editor
        }
        
        try {
            switch (toolName) {
                case 'invoice':
                    const { InvoiceGenerator } = await import('./invoiceGenerator.js');
                    this.tools.invoice = new InvoiceGenerator();
                    this.tools.invoice.app = this.app; // Give access to main app
                    this.tools.invoice.showToast = this.app.showToast.bind(this.app);
                    this.tools.invoice.init();
                    break;
                    
                case 'social':
                    const { SocialFormatter } = await import('./socialFormatter.js');
                    this.tools.social = new SocialFormatter();
                    this.tools.social.app = this.app; // Give access to main app
                    this.tools.social.showToast = this.app.showToast.bind(this.app);
                    this.tools.social.init();
                    break;
                    
                case 'password':
                    const { PasswordGenerator } = await import('./passwordGenerator.js');
                    this.tools.password = new PasswordGenerator();
                    this.tools.password.app = this.app; // Give access to main app
                    this.tools.password.showToast = this.app.showToast.bind(this.app);
                    this.tools.password.setI18n(this.app.i18n); // Give access to i18n
                    this.tools.password.setLanguage(this.app.currentLanguage); // Set current language
                    // Password generator initializes itself
                    break;
                    
                default:
                    console.warn(`Unknown tool: ${toolName}`);
            }
        } catch (error) {
            console.error(`Failed to initialize tool ${toolName}:`, error);
            this.app.showToast(`Feil ved lasting av verktøy: ${toolName}`, 'error');
        }
    }
    
    /**
     * Handle browser back/forward navigation
     */
    handleHashChange() {
        const hash = window.location.hash.slice(1); // Remove #
        const toolName = hash || 'text-editor';
        
        if (this.tools.hasOwnProperty(toolName) || toolName === 'text-editor') {
            this.showTool(toolName);
        }
    }
    
    /**
     * Setup hash change listener for browser navigation
     */
    setupBrowserNavigation() {
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        // Handle initial hash on page load
        if (window.location.hash) {
            this.handleHashChange();
        }
    }
    
    /**
     * Get current tool
     */
    getCurrentTool() {
        return this.currentTool;
    }
    
    /**
     * Check if tool is available
     */
    isToolAvailable(toolName) {
        return this.tools.hasOwnProperty(toolName) || toolName === 'text-editor';
    }
    
    /**
     * Update language for all loaded tools
     */
    updateLanguage(language) {
        Object.values(this.tools).forEach(tool => {
            if (tool && typeof tool.setLanguage === 'function') {
                tool.setLanguage(language);
            } else if (tool && typeof tool.updateLanguage === 'function') {
                tool.updateLanguage(language);
            }
        });
    }
}
