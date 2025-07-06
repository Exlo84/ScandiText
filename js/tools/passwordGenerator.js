/**
 * Password Generator Tool for ScandiText
 * Supports Nordic languages (Norwegian, Swedish, Danish)
 * Version: 2.0.7
 */

export class PasswordGenerator {
    constructor() {
        this.app = null;
        this.showToast = null;
        this.currentLanguage = 'no';
        this.i18n = null;
        
        // Nordic word lists for passphrase generation
        this.wordLists = {
            no: [
                'hus', 'bil', 'hund', 'katt', 'skog', 'fjell', 'sjø', 'strand', 'sol', 'måne',
                'stein', 'tre', 'blomst', 'fugl', 'fisk', 'vind', 'regn', 'snø', 'is', 'vann',
                'brød', 'melk', 'ost', 'eple', 'pære', 'morgen', 'kveld', 'natt', 'dag', 'uke',
                'måned', 'år', 'tid', 'klokke', 'vei', 'gate', 'hjem', 'skole', 'jobb', 'lege',
                'lærer', 'sjåfør', 'kokk', 'pilot', 'artist', 'bok', 'penn', 'papir', 'vindu', 'dør'
            ],
            se: [
                'hus', 'bil', 'hund', 'katt', 'skog', 'berg', 'sjö', 'strand', 'sol', 'måne',
                'sten', 'träd', 'blomma', 'fågel', 'fisk', 'vind', 'regn', 'snö', 'is', 'vatten',
                'bröd', 'mjölk', 'ost', 'äpple', 'päron', 'morgon', 'kväll', 'natt', 'dag', 'vecka',
                'månad', 'år', 'tid', 'klocka', 'väg', 'gata', 'hem', 'skola', 'jobb', 'läkare',
                'lärare', 'förare', 'kock', 'pilot', 'artist', 'bok', 'penna', 'papper', 'fönster', 'dörr'
            ],
            dk: [
                'hus', 'bil', 'hund', 'kat', 'skov', 'bjerg', 'sø', 'strand', 'sol', 'måne',
                'sten', 'træ', 'blomst', 'fugl', 'fisk', 'vind', 'regn', 'sne', 'is', 'vand',
                'brød', 'mælk', 'ost', 'æble', 'pære', 'morgen', 'aften', 'nat', 'dag', 'uge',
                'måned', 'år', 'tid', 'ur', 'vej', 'gade', 'hjem', 'skole', 'job', 'læge',
                'lærer', 'chauffør', 'kok', 'pilot', 'artist', 'bog', 'pen', 'papir', 'vindue', 'dør'
            ]
        };
        
        this.initializeGenerators();
    }
    
    setLanguage(language) {
        this.currentLanguage = language;
        this.updateUI();
    }
    
    setI18n(i18nInstance) {
        this.i18n = i18nInstance;
        this.updateUI();
    }
    
    initializeGenerators() {
        const generateBtn = document.getElementById('generate-passwords-btn');
        const lengthSlider = document.getElementById('password-length');
        const lengthValue = document.getElementById('length-display');
        const includeNumbers = document.getElementById('include-numbers');
        const includeSymbols = document.getElementById('include-symbols');
        const includeUppercase = document.getElementById('include-uppercase');
        const includeNorwegian = document.getElementById('include-norwegian');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePasswords());
        } else {
            console.error('Generate button not found');
        }
        
        if (lengthSlider && lengthValue) {
            lengthSlider.addEventListener('input', (e) => {
                lengthValue.textContent = e.target.value;
            });
        } else {
            console.error('Length slider or display not found');
        }
        
        // Set default values
        if (lengthSlider) lengthSlider.value = 12;
        if (lengthValue) lengthValue.textContent = '12';
        if (includeNumbers) includeNumbers.checked = true;
        if (includeSymbols) includeSymbols.checked = true;
        if (includeUppercase) includeUppercase.checked = true;
        if (includeNorwegian) includeNorwegian.checked = false;
        
        console.log('Password generator initialized:', {
            generateBtn: !!generateBtn,
            lengthSlider: !!lengthSlider,
            lengthValue: !!lengthValue,
            includeNumbers: !!includeNumbers,
            includeSymbols: !!includeSymbols,
            includeUppercase: !!includeUppercase,
            includeNorwegian: !!includeNorwegian
        });
    }
    
    updateUI() {
        if (!this.i18n) return;
        
        // Update nordic words label
        const nordicWordsLabel = document.getElementById('nordic-words-label');
        if (nordicWordsLabel) {
            nordicWordsLabel.textContent = this.i18n.t('useNordicWords');
        }
        
        // Update other password generator labels if needed
        const generateBtn = document.getElementById('generate-passwords');
        if (generateBtn) {
            generateBtn.textContent = this.i18n.t('generatePasswords') || 'Generer passord';
        }
    }
    
    generatePasswords() {
        console.log('Generate passwords called');
        
        const length = parseInt(document.getElementById('password-length')?.value || 12);
        const includeNumbers = document.getElementById('include-numbers')?.checked;
        const includeSymbols = document.getElementById('include-symbols')?.checked;
        const includeUppercase = document.getElementById('include-uppercase')?.checked;
        const includeNorwegian = document.getElementById('include-norwegian')?.checked;
        
        console.log('Password settings:', {
            length,
            includeNumbers,
            includeSymbols,
            includeUppercase,
            includeNorwegian
        });
        
        const passwords = [];
        
        for (let i = 0; i < 5; i++) {
            let password;
            if (includeNorwegian) {
                password = this.generateNordicPassphrase();
            } else {
                password = this.generateRandomPassword(length, includeNumbers, includeSymbols, includeUppercase);
            }
            passwords.push(password);
        }
        
        console.log('Generated passwords:', passwords);
        this.displayPasswords(passwords);
        
        if (this.showToast) {
            this.showToast(this.i18n?.t('passwordsGenerated') || '5 nye passord generert!', 'success');
        }
    }
    
    generateRandomPassword(length, includeNumbers, includeSymbols, includeUppercase) {
        let chars = 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) chars += '0123456789';
        if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return password;
    }
    
    generateNordicPassphrase() {
        const words = this.wordLists[this.currentLanguage] || this.wordLists.no;
        const selectedWords = [];
        
        // Get current settings
        const targetLength = parseInt(document.getElementById('password-length')?.value || 12);
        const includeNumbers = document.getElementById('include-numbers')?.checked;
        const includeSymbols = document.getElementById('include-symbols')?.checked;
        const includeUppercase = document.getElementById('include-uppercase')?.checked;
        
        // Choose separator
        let separator = '-';
        if (includeSymbols) {
            const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '='];
            separator = symbols[Math.floor(Math.random() * symbols.length)];
        }
        
        // Reserve space for numbers if enabled (separator + 1-3 digits = 2-4 chars)
        const numberLength = includeNumbers ? 4 : 0;
        const availableLength = targetLength - numberLength;
        
        // Generate words until we reach desired length
        let currentLength = 0;
        while (currentLength < availableLength && selectedWords.length < 8) { // Max 8 words to avoid infinite loop
            let randomWord = words[Math.floor(Math.random() * words.length)];
            
            // Apply uppercase if enabled
            if (includeUppercase && Math.random() > 0.5) {
                randomWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
            }
            
            // Check if adding this word (+ separator) would exceed target
            const wordWithSeparator = selectedWords.length > 0 ? separator + randomWord : randomWord;
            if (currentLength + wordWithSeparator.length <= availableLength) {
                selectedWords.push(randomWord);
                currentLength += wordWithSeparator.length;
            } else {
                // If word is too long, try a shorter one
                const shorterWords = words.filter(w => w.length <= (availableLength - currentLength - (selectedWords.length > 0 ? 1 : 0)));
                if (shorterWords.length > 0) {
                    let shorterWord = shorterWords[Math.floor(Math.random() * shorterWords.length)];
                    if (includeUppercase && Math.random() > 0.5) {
                        shorterWord = shorterWord.charAt(0).toUpperCase() + shorterWord.slice(1);
                    }
                    selectedWords.push(shorterWord);
                    currentLength += (selectedWords.length > 1 ? separator.length : 0) + shorterWord.length;
                }
                break;
            }
        }
        
        // Ensure we have at least 2 words
        if (selectedWords.length < 2) {
            const shortWords = words.filter(w => w.length <= 4).slice(0, 2);
            selectedWords.length = 0;
            selectedWords.push(...shortWords.map(w => includeUppercase && Math.random() > 0.5 ? 
                w.charAt(0).toUpperCase() + w.slice(1) : w));
        }
        
        // Build password
        let password = selectedWords.join(separator);
        
        // Add numbers if enabled, adjusting count to reach target length
        if (includeNumbers) {
            const remainingLength = targetLength - password.length - separator.length;
            if (remainingLength > 0) {
                // Generate number with appropriate length
                const maxNumber = Math.pow(10, Math.min(remainingLength, 6)) - 1; // Max 6 digits
                const randomNum = Math.floor(Math.random() * maxNumber) + 1;
                password += separator + randomNum;
            }
        }
        
        // If still too short, pad with numbers/symbols
        while (password.length < targetLength && password.length < 100) { // Safety limit
            if (includeNumbers && Math.random() > 0.5) {
                password += Math.floor(Math.random() * 10);
            } else if (includeSymbols) {
                const symbols = ['!', '@', '#', '$', '%', '^', '&', '*'];
                password += symbols[Math.floor(Math.random() * symbols.length)];
            } else {
                password += Math.floor(Math.random() * 10);
            }
        }
        
        // Trim if too long
        if (password.length > targetLength) {
            password = password.substring(0, targetLength);
        }
        
        return password;
    }
    
    displayPasswords(passwords) {
        const container = document.querySelector('#password-list');
        if (!container) {
            console.error('Password container not found');
            return;
        }
        
        // Clear existing passwords
        container.innerHTML = '';
        
        // Create new password list
        const passwordList = document.createElement('div');
        passwordList.className = 'password-list';
        
        passwords.forEach((password, index) => {
            const passwordItem = document.createElement('div');
            passwordItem.className = 'password-item';
            
            const strength = this.calculatePasswordStrength(password);
            const strengthClass = strength >= 80 ? 'strong' : strength >= 60 ? 'medium' : 'weak';
            const strengthText = strength >= 80 ? 
                (this.i18n?.t('strengthStrong') || 'Sterkt') : 
                strength >= 60 ? 
                (this.i18n?.t('strengthMedium') || 'Middels') : 
                (this.i18n?.t('strengthWeak') || 'Svakt');
            
            passwordItem.innerHTML = `
                <div class="password-text">${password}</div>
                <div class="password-strength ${strengthClass}">${strengthText} (${strength}%)</div>
                <button class="copy-password-btn" data-password="${password}">
                    ${this.i18n?.t('copySelected') || 'Kopier'}
                </button>
            `;
            
            passwordList.appendChild(passwordItem);
        });
        
        container.appendChild(passwordList);
        
        // Add copy functionality
        const copyButtons = passwordList.querySelectorAll('.copy-password-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const password = e.target.dataset.password;
                this.copyToClipboard(password);
            });
        });
    }
    
    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length scoring
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 20;
        if (password.length >= 16) score += 10;
        
        // Character type scoring
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/\d/.test(password)) score += 10;
        if (/[^a-zA-Z\d]/.test(password)) score += 20;
        
        return Math.min(score, 100);
    }
    
    async copyToClipboard(text) {
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                if (this.showToast) {
                    this.showToast(this.i18n?.t('passwordCopied') || 'Passord kopiert!', 'success');
                }
                return;
            }
            
            // Fallback to older method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                if (this.showToast) {
                    this.showToast(this.i18n?.t('passwordCopied') || 'Passord kopiert!', 'success');
                }
            } else {
                throw new Error('execCommand failed');
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
            if (this.showToast) {
                this.showToast(this.i18n?.t('copyFailed') || 'Kunne ikke kopiere', 'error');
            }
        }
    }
}

// Auto-initialize if we're in a browser environment
if (typeof window !== 'undefined') {
    window.PasswordGenerator = PasswordGenerator;
}
