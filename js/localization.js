// Localization.js - Language content management
// This file provides content translation support

class Localization {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                nav: {
                    home: 'Home',
                    products: 'Products',
                    about: 'About',
                    certifications: 'Certifications',
                    contact: 'Contact',
                    getQuote: 'Get Quote'
                },
                hero: {
                    title: 'Premium Coffee & Cocoa Exports',
                    subtitle: 'Direct from East Africa to Global Markets',
                    cta1: 'View Products',
                    cta2: 'Request Quote'
                },
                products: {
                    coffee: 'Premium Coffee',
                    cocoa: 'Quality Cocoa',
                    viewCatalog: 'Download Catalog',
                    requestQuote: 'Request Quote'
                },
                contact: {
                    title: 'Get in Touch',
                    name: 'Your Name',
                    email: 'Email Address',
                    company: 'Company Name',
                    message: 'Your Message',
                    send: 'Send Message'
                }
            },
            zh: {
                nav: {
                    home: '首页',
                    products: '产品',
                    about: '关于我们',
                    certifications: '认证',
                    contact: '联系我们',
                    getQuote: '获取报价'
                },
                hero: {
                    title: '优质咖啡和可可出口',
                    subtitle: '直接从东非到全球市场',
                    cta1: '查看产品',
                    cta2: '请求报价'
                },
                products: {
                    coffee: '优质咖啡',
                    cocoa: '优质可可',
                    viewCatalog: '下载目录',
                    requestQuote: '请求报价'
                },
                contact: {
                    title: '联系我们',
                    name: '您的姓名',
                    email: '电子邮箱',
                    company: '公司名称',
                    message: '您的留言',
                    send: '发送消息'
                }
            }
        };
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateContent();
    }

    updateContent() {
        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
    }
}

// Initialize localization
window.localization = new Localization();

// Enhanced language switching function for comprehensive translation
function toggleLanguage() {
    const currentLang = document.getElementById('current-lang')?.textContent;
    const newLang = currentLang === 'EN' ? 'zh' : 'en';
    
    // Update language indicators
    if (document.getElementById('current-lang')) {
        document.getElementById('current-lang').textContent = newLang === 'en' ? 'EN' : '中文';
    }
    if (document.getElementById('alt-lang')) {
        document.getElementById('alt-lang').textContent = newLang === 'en' ? '中文' : 'EN';
    }
    
    // Apply translations to all elements with language attributes
    const elements = document.querySelectorAll('[data-en][data-zh]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${newLang}`);
        if (text) {
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.classList.contains('btn-text')) {
                element.textContent = text;
            } else if (element.classList.contains('cta-btn') || element.querySelector('i')) {
                // For elements with icons (like CTA buttons), preserve the icon
                const icon = element.querySelector('i');
                if (icon) {
                    element.textContent = '';
                    element.appendChild(icon);
                    element.appendChild(document.createTextNode(' ' + text));
                } else {
                    element.textContent = text;
                }
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update banner button text specifically
    const bannerBtn = document.querySelector('.banner-order-btn .btn-text');
    const bannerBtnParent = document.querySelector('.banner-order-btn');
    if (bannerBtn && bannerBtnParent) {
        const btnText = bannerBtnParent.getAttribute(`data-${newLang}`);
        if (btnText) bannerBtn.textContent = btnText;
    }
    
    // Update currency display
    updateCurrencyDisplay(newLang);
    
    // Store language preference
    localStorage.setItem('language', newLang);
    
    // Show/hide Chinese-specific content
    toggleChineseContent(newLang === 'zh');
    
    // Update page language attribute
    document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en';
}

// Currency display function
function updateCurrencyDisplay(lang) {
    const priceElements = document.querySelectorAll('.price-value');
    priceElements.forEach(element => {
        const usdPrice = element.textContent;
        if (lang === 'zh' && usdPrice.includes('$')) {
            // Convert to CNY (approximate rate: 1 USD = 7.2 CNY)
            const price = parseFloat(usdPrice.replace(/[^0-9.-]/g, ''));
            if (!isNaN(price)) {
                element.textContent = `¥${(price * 7.2).toFixed(0)}`;
            }
        } else if (lang === 'en' && usdPrice.includes('¥')) {
            // Convert back to USD
            const price = parseFloat(usdPrice.replace(/[^0-9.-]/g, ''));
            if (!isNaN(price)) {
                element.textContent = `$${(price / 7.2).toFixed(2)}`;
            }
        }
    });
}

// Toggle Chinese-specific content
function toggleChineseContent(isZh) {
    const chineseElements = document.querySelectorAll('.chinese-specific, .chinese-contact, .chinese-payment, .chinese-social, .chinese-testimonial');
    const internationalElements = document.querySelectorAll('.international-contact, .international-payment, .international-testimonial');
    
    chineseElements.forEach(el => {
        el.style.display = isZh ? 'block' : 'none';
    });
    
    internationalElements.forEach(el => {
        el.style.display = isZh ? 'none' : 'block';
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'en';
    if (savedLang === 'zh') {
        toggleLanguage();
    }
});