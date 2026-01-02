// East Africom Security Module
// Comprehensive anti-bot and form protection system

class EastAfricomSecurity {
    constructor() {
        this.config = {
            maxFormAttempts: 5,
            timeWindow: 300000, // 5 minutes
            minFormTime: 3000,   // 3 seconds
            maxFormTime: 1800000, // 30 minutes
            requiredInteractions: 2
        };
        
        this.metrics = {
            formStartTime: 0,
            interactionCount: 0,
            mouseMovements: [],
            attempts: new Map(),
            blockedIPs: new Set()
        };
        
        this.spamFilter = new SpamFilter();
        this.behaviorAnalyzer = new BehaviorAnalyzer();
        this.rateLimiter = new RateLimiter();
        
        this.init();
    }
    
    init() {
        this.setupHoneypots();
        this.setupFormProtection();
        this.setupBehaviorTracking();
        this.setupCSRFProtection();
        this.displaySecurityStatus();
    }
    
    // Honeypot Implementation
    setupHoneypots() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const honeypotFields = `
                <div class="honeypot-field" style="position: absolute; left: -9999px;">
                    <input type="text" name="website" tabindex="-1" autocomplete="off">
                    <input type="email" name="confirm_email" tabindex="-1" autocomplete="off">
                    <input type="tel" name="phone_verify" tabindex="-1" autocomplete="off">
                </div>
            `;
            form.insertAdjacentHTML('afterbegin', honeypotFields);
        });
    }
    
    // Form Protection Setup
    setupFormProtection() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Track form start time
            form.addEventListener('focus', () => {
                if (this.metrics.formStartTime === 0) {
                    this.metrics.formStartTime = Date.now();
                }
            }, true);
            
            // Track interactions
            form.addEventListener('input', () => {
                this.metrics.interactionCount++;
            });
            
            // Validate on submit
            form.addEventListener('submit', (e) => {
                if (!this.validateFormSubmission(form)) {
                    e.preventDefault();
                    this.showSecurityMessage('Submission blocked for security reasons.');
                    return false;
                }
            });
        });
    }
    
    // Behavior Tracking
    setupBehaviorTracking() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.metrics.mouseMovements.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            // Keep only recent movements
            if (this.metrics.mouseMovements.length > 100) {
                this.metrics.mouseMovements = this.metrics.mouseMovements.slice(-50);
            }
        });
        
        // Keyboard tracking
        document.addEventListener('keydown', () => {
            this.metrics.interactionCount++;
        });
    }
    
    // CSRF Protection
    setupCSRFProtection() {
        const csrfToken = this.generateCSRFToken();
        sessionStorage.setItem('csrfToken', csrfToken);
        
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);
        });
    }
    
    // Form Validation
    validateFormSubmission(form) {
        // Check honeypots
        if (!this.validateHoneypots(form)) {
            this.logSecurityEvent('honeypot_triggered');
            return false;
        }
        
        // Check timing
        if (!this.validateTiming()) {
            this.logSecurityEvent('suspicious_timing');
            return false;
        }
        
        // Check interactions
        if (!this.validateInteractions()) {
            this.logSecurityEvent('insufficient_interaction');
            return false;
        }
        
        // Check rate limiting
        if (!this.validateRateLimit()) {
            this.logSecurityEvent('rate_limit_exceeded');
            return false;
        }
        
        // Check content for spam
        if (!this.validateContent(form)) {
            this.logSecurityEvent('spam_content_detected');
            return false;
        }
        
        // Check CSRF token
        if (!this.validateCSRFToken(form)) {
            this.logSecurityEvent('csrf_token_invalid');
            return false;
        }
        
        // Check behavior score
        if (!this.validateBehavior()) {
            this.logSecurityEvent('suspicious_behavior');
            return false;
        }
        
        this.logSecurityEvent('valid_submission');
        return true;
    }
    
    validateHoneypots(form) {
        const honeypots = ['website', 'confirm_email', 'phone_verify'];
        for (let field of honeypots) {
            const input = form.querySelector(`input[name="${field}"]`);
            if (input && input.value !== '') {
                return false;
            }
        }
        return true;
    }
    
    validateTiming() {
        const timeTaken = Date.now() - this.metrics.formStartTime;
        return timeTaken >= this.config.minFormTime && timeTaken <= this.config.maxFormTime;
    }
    
    validateInteractions() {
        return this.metrics.interactionCount >= this.config.requiredInteractions;
    }
    
    validateRateLimit() {
        const userFingerprint = this.getUserFingerprint();
        return this.rateLimiter.checkRate(userFingerprint, this.config.maxFormAttempts, this.config.timeWindow);
    }
    
    validateContent(form) {
        const textFields = form.querySelectorAll('textarea, input[type="text"]');
        for (let field of textFields) {
            if (this.spamFilter.isSpam(field.value)) {
                return false;
            }
        }
        return true;
    }
    
    validateCSRFToken(form) {
        const formToken = form.querySelector('input[name="csrf_token"]')?.value;
        const sessionToken = sessionStorage.getItem('csrfToken');
        return formToken === sessionToken;
    }
    
    validateBehavior() {
        return this.behaviorAnalyzer.getBehaviorScore() > 30;
    }
    
    // Email Validation
    async validateEmail(email) {
        const checks = {
            format: this.validateEmailFormat(email),
            disposable: await this.checkDisposableEmail(email),
            domain: await this.checkDomainExists(email)
        };
        
        return checks.format && checks.disposable && checks.domain;
    }
    
    validateEmailFormat(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    async checkDisposableEmail(email) {
        const domain = email.split('@')[1]?.toLowerCase();
        const disposableDomains = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'mailinator.com', 'yopmail.com', 'temp-mail.org',
            'throwaway.email', 'getnada.com', 'emailondeck.com'
        ];
        
        return !disposableDomains.includes(domain);
    }
    
    async checkDomainExists(email) {
        // Simplified domain check - in production, use proper DNS validation
        const domain = email.split('@')[1];
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        
        if (commonDomains.includes(domain.toLowerCase())) {
            return true;
        }
        
        // For other domains, assume valid (implement proper DNS check server-side)
        return domain.includes('.');
    }
    
    // Utility Functions
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
    }
    
    getUserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        return btoa(fingerprint).substr(0, 16);
    }
    
    logSecurityEvent(type, details = {}) {
        const event = {
            type,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            fingerprint: this.getUserFingerprint(),
            ...details
        };
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'security_event', {
                'event_category': 'Security',
                'event_label': type,
                'value': 1
            });
        }
    }
    
    showSecurityMessage(message) {
        const modal = document.createElement('div');
        modal.className = 'security-message';
        modal.innerHTML = `
            <h3>🔒 Security Check</h3>
            <p>${message}</p>
            <p>For urgent inquiries, call: <a href="tel:+256776701003">+256 776 701 003</a></p>
            <button onclick="this.parentElement.remove()">Close</button>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
        }, 10000);
    }
    
    displaySecurityStatus() {
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'security-badge';
        statusIndicator.innerHTML = '<i class="fas fa-shield-alt"></i> Secure Form';
        
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.classList.add('secure-form');
            if (!form.querySelector('.security-badge')) {
                form.insertAdjacentElement('beforebegin', statusIndicator.cloneNode(true));
            }
        });
    }
}

// Spam Filter Class
class SpamFilter {
    constructor() {
        this.spamKeywords = [
            'viagra', 'casino', 'lottery', 'winner', 'congratulations',
            'click here', 'free money', 'get rich', 'work from home',
            'guaranteed', 'no questions asked', 'limited time',
            'act now', 'earn money', 'make money fast', 'mlm',
            'investment opportunity', 'risk free', 'cash bonus'
        ];
        
        this.suspiciousPatterns = [
            /(.)\1{4,}/g,     // Repeated characters
            /[A-Z]{5,}/g,     // Too many capitals
            /\d{10,}/g,       // Long numbers
            /[!@#$%^&*]{3,}/g // Special character spam
        ];
    }
    
    isSpam(text, threshold = 20) {
        const analysis = this.analyzeContent(text);
        return analysis.score >= threshold;
    }
    
    analyzeContent(text) {
        let score = 0;
        const reasons = [];
        const lowerText = text.toLowerCase();
        
        // Check spam keywords
        this.spamKeywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                score += 10;
                reasons.push(`Spam keyword: ${keyword}`);
            }
        });
        
        // Check suspicious patterns
        this.suspiciousPatterns.forEach(pattern => {
            if (pattern.test(text)) {
                score += 5;
                reasons.push('Suspicious patterns detected');
            }
        });
        
        // Check URL ratio
        const words = text.split(/\s+/).length;
        const urls = (text.match(/https?:\/\/[^\s]+/g) || []).length;
        
        if (urls > 0 && urls / words > 0.1) {
            score += 15;
            reasons.push('Too many URLs');
        }
        
        return { score, reasons };
    }
}

// Behavior Analyzer Class
class BehaviorAnalyzer {
    constructor() {
        this.startTime = Date.now();
        this.interactions = {
            scroll: 0,
            click: 0,
            keyboard: 0,
            mouse: 0,
            focus: 0
        };
        
        this.setupTracking();
    }
    
    setupTracking() {
        window.addEventListener('scroll', () => this.interactions.scroll++);
        document.addEventListener('click', () => this.interactions.click++);
        document.addEventListener('keydown', () => this.interactions.keyboard++);
        document.addEventListener('mousemove', () => this.interactions.mouse++);
        document.addEventListener('focus', () => this.interactions.focus++, true);
    }
    
    getBehaviorScore() {
        const timeOnPage = Date.now() - this.startTime;
        let score = 0;
        
        // Positive indicators
        if (timeOnPage > 30000) score += 20;
        if (this.interactions.scroll > 5) score += 15;
        if (this.interactions.click > 2) score += 15;
        if (this.interactions.keyboard > 10) score += 20;
        if (this.interactions.mouse > 100) score += 20;
        if (this.interactions.focus > 3) score += 10;
        
        // Negative indicators
        if (timeOnPage < 5000) score -= 30;
        if (this.interactions.scroll === 0) score -= 20;
        
        return Math.max(0, Math.min(100, score));
    }
}

// Rate Limiter Class
class RateLimiter {
    constructor() {
        this.attempts = new Map();
        this.blocked = new Set();
    }
    
    checkRate(identifier, limit = 5, window = 300000) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || [];
        
        // Clean old attempts
        const recentAttempts = userAttempts.filter(time => now - time < window);
        
        if (recentAttempts.length >= limit) {
            this.blocked.add(identifier);
            return false;
        }
        
        recentAttempts.push(now);
        this.attempts.set(identifier, recentAttempts);
        return true;
    }
    
    isBlocked(identifier) {
        return this.blocked.has(identifier);
    }
}

// Initialize security system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.eastAfricomSecurity = new EastAfricomSecurity();
    
    // Setup email validation for all email inputs
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', async function() {
            const isValid = await window.eastAfricomSecurity.validateEmail(this.value);
            
            if (!isValid) {
                this.classList.add('invalid');
                this.parentElement.classList.add('invalid');
                
                if (!this.parentElement.querySelector('.validation-error')) {
                    const error = document.createElement('div');
                    error.className = 'validation-error';
                    error.textContent = 'Please enter a valid business email address';
                    this.parentElement.appendChild(error);
                }
            } else {
                this.classList.remove('invalid');
                this.classList.add('valid');
                this.parentElement.classList.remove('invalid');
                this.parentElement.classList.add('valid');
                
                const error = this.parentElement.querySelector('.validation-error');
                if (error) error.remove();
            }
        });
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EastAfricomSecurity, SpamFilter, BehaviorAnalyzer, RateLimiter };
}