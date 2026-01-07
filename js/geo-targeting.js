// Geo-targeting and Localization Script for East Africom Consults
// Handles IP detection, currency conversion, and Chinese market localization

class GeoTargeting {
    constructor() {
        this.userRegion = 'international';
        this.userCountry = null;
        this.currentLanguage = 'en';
        this.exchangeRate = null;
        this.init();
    }

    async init() {
        try {
            await this.detectLocation();
            this.setupCurrencyDisplay();
            this.setupEventListeners();
        } catch (error) {
            this.fallbackToInternational();
        }
    }

    async detectLocation() {
        try {
            // Check for mock country in localStorage (for testing)
            const mockCountry = localStorage.getItem('mockCountry');
            
            let data;
            if (mockCountry) {
                data = {
                    country_code: mockCountry,
                    country_name: mockCountry === 'CN' ? 'China' : mockCountry,
                    city: 'Mock City',
                    region: 'Mock Region'
                };
                this.userCountry = mockCountry;
            } else {
                // Use ip-api.com (free, CORS-enabled API)
                try {
                    const response = await fetch('https://ip-api.com/json/', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('IP API request failed');
                    }
                    
                    const apiData = await response.json();
                    
                    if (apiData.status === 'success') {
                        data = {
                            country_code: apiData.countryCode,
                            country_name: apiData.country,
                            city: apiData.city,
                            region: apiData.regionName
                        };
                        this.userCountry = data.country_code;
                    } else {
                        throw new Error('IP API returned error status');
                    }
                } catch (apiError) {
                    console.warn('Geo-targeting API unavailable, using default settings:', apiError.message);
                    // Fallback to international without error
                    this.fallbackToInternational();
                    return;
                }
            }
            
            // Check if user is from China, Hong Kong, or Macau
            if (['CN', 'HK', 'MO'].includes(this.userCountry)) {
                this.userRegion = 'china';
                this.showChineseNotification();
            }
            
            window.geoData = data;
            
            // Dispatch custom event for geo-targeting complete
            window.dispatchEvent(new CustomEvent('geoTargetingComplete', {
                detail: { 
                    country: this.userCountry, 
                    region: this.userRegion 
                }
            }));
            
        } catch (error) {
            console.warn('Geo-targeting failed, using default settings:', error.message);
            this.fallbackToInternational();
        }
    }

    showChineseNotification() {
        const notification = document.getElementById('geo-notification');
        if (notification) {
            // Disable notification completely
            notification.style.display = 'none !important';
            
            // Auto-hide after 10 seconds if no action
            setTimeout(() => {
                if (notification.style.display !== 'none') {
                    this.dismissLocalization();
                }
            }, 10000);
        }
    }

    acceptLocalization() {
        this.userRegion = 'china';
        this.currentLanguage = 'zh';
        this.hideNotification();
        this.activateChineseLocalization();
        this.updateCurrency('CNY');
        
        // Store preference
        localStorage.setItem('eastafricom_region', 'china');
        localStorage.setItem('eastafricom_language', 'zh');
    }

    dismissLocalization() {
        this.userRegion = 'international';
        this.currentLanguage = 'en';
        this.hideNotification();
        
        // Store preference
        localStorage.setItem('eastafricom_region', 'international');
        localStorage.setItem('eastafricom_language', 'en');
    }

    hideNotification() {
        const notification = document.getElementById('geo-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }

    activateChineseLocalization() {
        // Show Chinese-specific elements
        const chineseElements = document.querySelectorAll('.chinese-contact, .chinese-social, .chinese-payment, .chinese-testimonial, .chinese-specific');
        chineseElements.forEach(element => {
            element.style.display = 'block';
        });

        // Hide some international elements
        const internationalTestimonials = document.querySelectorAll('.international-testimonial');
        if (internationalTestimonials.length > 1) {
            internationalTestimonials[1].style.display = 'none'; // Hide one international testimonial
        }

        // Update navigation language indicator
        this.updateLanguageIndicator();
        
        // Switch to Chinese content
        this.switchLanguage('zh');
    }

    async setupCurrencyDisplay() {
        if (this.userRegion === 'china') {
            await this.getExchangeRate();
            this.updateCurrency('CNY');
        }
    }

    async getExchangeRate() {
        try {
            // Use a free exchange rate API
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            this.exchangeRate = data.rates.CNY;
        } catch (error) {
            this.exchangeRate = 7.2; // Fallback rate
        }
    }

    updateCurrency(currency) {
        const currencyIndicator = document.getElementById('currency-indicator');
        const exchangeRateElement = document.getElementById('exchange-rate');
        
        if (currency === 'CNY' && this.exchangeRate) {
            if (currencyIndicator) {
                currencyIndicator.textContent = 'CNY (¥)';
            }
            
            if (exchangeRateElement) {
                exchangeRateElement.textContent = `1 USD = ¥${this.exchangeRate.toFixed(2)}`;
                exchangeRateElement.style.display = 'block';
            }

            // Update price displays
            this.updatePriceDisplays();
            
        } else {
            if (currencyIndicator) {
                currencyIndicator.textContent = 'USD ($)';
            }
            
            if (exchangeRateElement) {
                exchangeRateElement.style.display = 'none';
            }
        }
    }

    updatePriceDisplays() {
        const usdPrices = document.querySelectorAll('[data-currency="USD"]');
        const cnyPrices = document.querySelectorAll('[data-currency="CNY"]');
        
        if (this.userRegion === 'china') {
            usdPrices.forEach(price => price.style.display = 'none');
            cnyPrices.forEach(price => price.style.display = 'inline');
        } else {
            usdPrices.forEach(price => price.style.display = 'inline');
            cnyPrices.forEach(price => price.style.display = 'none');
        }
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update all elements with data-en and data-zh attributes
        const elements = document.querySelectorAll('[data-en][data-zh]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update button texts
        const buttonTexts = document.querySelectorAll('.btn-text');
        buttonTexts.forEach(btn => {
            const text = btn.parentElement.getAttribute(`data-${lang}`);
            if (text) {
                btn.textContent = text;
            }
        });

        this.updateLanguageIndicator();
    }

    updateLanguageIndicator() {
        const currentLang = document.getElementById('current-lang');
        const altLang = document.getElementById('alt-lang');
        
        if (this.currentLanguage === 'zh') {
            if (currentLang) currentLang.textContent = '中文';
            if (altLang) altLang.textContent = 'EN';
        } else {
            if (currentLang) currentLang.textContent = 'EN';
            if (altLang) altLang.textContent = '中文';
        }
    }

    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'zh' : 'en';
        this.switchLanguage(newLang);
        
        if (newLang === 'zh') {
            this.activateChineseLocalization();
            this.updateCurrency('CNY');
        } else {
            this.deactivateChineseLocalization();
            this.updateCurrency('USD');
        }
        
        // Store preference
        localStorage.setItem('eastafricom_language', newLang);
    }

    deactivateChineseLocalization() {
        // Hide Chinese-specific elements
        const chineseElements = document.querySelectorAll('.chinese-contact, .chinese-social, .chinese-payment, .chinese-testimonial, .chinese-specific');
        chineseElements.forEach(element => {
            element.style.display = 'none';
        });

        // Show international elements
        const internationalTestimonials = document.querySelectorAll('.international-testimonial');
        internationalTestimonials.forEach(element => {
            element.style.display = 'block';
        });
    }

    setupEventListeners() {
        // Load stored preferences
        const storedLanguage = localStorage.getItem('eastafricom_language');
        const storedRegion = localStorage.getItem('eastafricom_region');
        
        if (storedLanguage && storedRegion) {
            this.currentLanguage = storedLanguage;
            this.userRegion = storedRegion;
            
            if (storedLanguage === 'zh' || storedRegion === 'china') {
                this.activateChineseLocalization();
                this.updateCurrency('CNY');
            }
        }
    }

    fallbackToInternational() {
        this.userRegion = 'international';
        this.currentLanguage = 'en';
        this.updateCurrency('USD');
        
        // Dispatch event even on fallback
        window.dispatchEvent(new CustomEvent('geoTargetingComplete', {
            detail: { 
                country: null, 
                region: this.userRegion 
            }
        }));
    }
}

// Global functions for button clicks
function acceptLocalization() {
    if (window.geoTargeting) {
        window.geoTargeting.acceptLocalization();
    }
}

function dismissLocalization() {
    if (window.geoTargeting) {
        window.geoTargeting.dismissLocalization();
    }
}

function toggleLanguage() {
    if (window.geoTargeting) {
        window.geoTargeting.toggleLanguage();
    }
}

function downloadCatalog() {
    // Track download
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'engagement',
            'event_label': 'product_catalog'
        });
    }
    
    // Simulate download (replace with actual file)
    const link = document.createElement('a');
    link.href = 'documents/eastafricom-product-catalog-2024.pdf';
    link.download = 'EastAfricom-Product-Catalog-2024.pdf';
    link.click();
    
    alert(window.geoTargeting && window.geoTargeting.currentLanguage === 'zh' 
        ? '产品目录下载已开始。如有问题，请联系我们。' 
        : 'Product catalog download started. Please contact us if you have any issues.');
}

// Initialize geo-targeting when DOM is loaded - single instance only
if (!window.geoTargetingInitialized) {
    document.addEventListener('DOMContentLoaded', function() {
        window.geoTargeting = new GeoTargeting();
        window.geoTargetingInitialized = true;
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GeoTargeting, acceptLocalization, dismissLocalization, toggleLanguage, downloadCatalog };
}