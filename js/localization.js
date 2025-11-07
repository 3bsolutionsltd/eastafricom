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