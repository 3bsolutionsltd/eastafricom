// East Africom Coffee & Cocoa Export Website - Enhanced JavaScript
// Features: Geo-targeting, Language switching, Currency display, Product interactions

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// Navigation functionality with language support
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.languageToggle = document.getElementById('languageToggle');
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScrolling();
        this.handleActiveLinks();
        this.handleLanguageToggle();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    handleMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            }
        });
    }

    handleSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    handleActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    handleLanguageToggle() {
        if (this.languageToggle) {
            this.languageToggle.addEventListener('click', () => {
                const currentLang = localStorage.getItem('language') || 'en';
                const newLang = currentLang === 'en' ? 'zh' : 'en';
                
                if (window.geoTargeting) {
                    window.geoTargeting.switchLanguage(newLang);
                }
            });
        }
    }
}

// Enhanced Hero section with currency display
class HeroSection {
    constructor() {
        this.heroStats = document.querySelectorAll('.stat-number');
        this.currencyDisplay = document.querySelector('.currency-display');
        this.init();
    }

    init() {
        this.animateCounters();
        this.handleScrollIndicator();
        this.updateCurrencyDisplay();
    }

    animateCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.heroStats.forEach(stat => {
            observer.observe(stat);
        });
    }

    countUp(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = numericValue / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current).toString();
            if (isPercentage) displayValue += '%';
            if (isPlus) displayValue += '+';
            
            element.textContent = displayValue;
        }, stepTime);
    }

    handleScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    async updateCurrencyDisplay() {
        if (!this.currencyDisplay) return;

        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            const cnyRate = data.rates.CNY;
            
            const exchangeRateElement = this.currencyDisplay.querySelector('.exchange-rate');
            if (exchangeRateElement) {
                exchangeRateElement.textContent = `1 USD = ${cnyRate.toFixed(2)} CNY`;
            }
        } catch (error) {
            // Currency update failed silently
        }
    }
}

// Product interaction and filtering
class ProductShowcase {
    constructor() {
        this.productCards = document.querySelectorAll('.product-card');
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.init();
    }

    init() {
        this.handleProductHover();
        this.handleProductClick();
        this.handleCategoryFiltering();
    }

    handleProductHover() {
        this.productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(139, 69, 19, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    handleProductClick() {
        this.productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productName = card.querySelector('.product-name').textContent;
                const productPrice = card.querySelector('.price').textContent;
                
                // Show product details modal or redirect to product page
                this.showProductModal(productName, productPrice, card);
            });
        });
    }

    showProductModal(name, price, cardElement) {
        // Create modal for product details
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
        `;

        modalContent.innerHTML = `
            <button class="close-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            <h3 style="color: #8B4513; margin-bottom: 1rem;">${name}</h3>
            <p style="color: #5D4037; margin-bottom: 1.5rem;">Price: ${price}</p>
            <p style="color: #5D4037; margin-bottom: 2rem;">Contact us for bulk orders and custom packaging options.</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-primary" onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'}); this.closest('.product-modal').remove();">
                    <i class="fas fa-envelope"></i> Get Quote
                </button>
                <button class="btn btn-secondary" onclick="this.closest('.product-modal').remove();">
                    Close
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                modal.remove();
            }
        });

        // Animate modal
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    handleCategoryFiltering() {
        // If category tabs exist, handle filtering
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                this.filterProducts(category);
                
                // Update active tab
                this.categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    filterProducts(category) {
        this.productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Enhanced contact form with WeChat integration
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.chineseForm = document.getElementById('chineseContactForm');
        this.inputs = document.querySelectorAll('.form-input');
        this.init();
    }

    init() {
        if (this.form) {
            this.handleFormSubmission();
            this.handleInputValidation();
            this.handleInputFocus();
        }
        
        if (this.chineseForm) {
            this.handleChineseForm();
        }
        
        this.handleWeChatContact();
    }

    handleFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.submitForm();
            }
        });
    }

    handleChineseForm() {
        this.chineseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Handle Chinese form submission
            await this.submitChineseForm();
        });
    }

    handleWeChatContact() {
        const wechatButtons = document.querySelectorAll('.wechat-contact');
        wechatButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Show WeChat QR code or contact information
                this.showWeChatModal();
            });
        });
    }

    showWeChatModal() {
        const modal = document.createElement('div');
        modal.className = 'wechat-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            position: relative;
        `;

        modalContent.innerHTML = `
            <button class="close-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            <h3 style="color: #228B22; margin-bottom: 1rem;">
                <i class="fab fa-weixin"></i> WeChat Contact
            </h3>
            <div style="width: 200px; height: 200px; background: #f0f0f0; margin: 1rem auto; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #666;">
                QR Code Placeholder
            </div>
            <p style="color: #5D4037; margin-bottom: 1rem;">WeChat ID: eastafricom_export</p>
            <p style="color: #5D4037; font-size: 0.9rem;">Scan QR code or search WeChat ID to connect with us</p>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                modal.remove();
            }
        });
    }

    handleInputValidation() {
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });

            input.addEventListener('input', () => {
                this.clearErrors(input);
            });
        });
    }

    handleInputFocus() {
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;
        let errorMessage = '';

        this.clearErrors(input);

        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }

        if (name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }

        if (name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }

        if (!isValid) {
            this.showError(input, errorMessage);
        }

        return isValid;
    }

    validateForm() {
        let isFormValid = true;
        
        this.inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    showError(input, message) {
        const formGroup = input.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #D32F2F;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: block;
        `;
        errorDiv.textContent = message;
        
        formGroup.appendChild(errorDiv);
        input.style.borderColor = '#D32F2F';
    }

    clearErrors(input) {
        const formGroup = input.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        input.style.borderColor = '';
    }

    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Check if security system is available
        if (typeof window.eastAfricomSecurity === 'undefined') {
            this.showErrorMessage('Security system not loaded. Please refresh the page.');
            return;
        }
        
        // Validate form with security system
        if (!window.eastAfricomSecurity.validateFormSubmission(this.form)) {
            // Security validation failed - message already shown by security system
            return;
        }
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission with additional security checks
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Log successful submission
            window.eastAfricomSecurity.logSecurityEvent('form_submitted', {
                formType: 'contact',
                userFingerprint: window.eastAfricomSecurity.getUserFingerprint()
            });
            
            this.showSuccessMessage();
            this.form.reset();
            
            this.inputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
        } catch (error) {
            this.showErrorMessage();
            window.eastAfricomSecurity.logSecurityEvent('form_submission_error', {
                error: error.message
            });
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async submitChineseForm() {
        // Handle Chinese form submission
        const submitButton = this.chineseForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Check if security system is available
        if (typeof window.eastAfricomSecurity === 'undefined') {
            this.showErrorMessage('安全系统未加载。请刷新页面。');
            return;
        }
        
        // Validate form with security system
        if (!window.eastAfricomSecurity.validateFormSubmission(this.chineseForm)) {
            // Security validation failed - message already shown by security system
            return;
        }
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        submitButton.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Log successful submission
            window.eastAfricomSecurity.logSecurityEvent('chinese_form_submitted', {
                formType: 'chinese_contact',
                userFingerprint: window.eastAfricomSecurity.getUserFingerprint()
            });
            
            this.showSuccessMessage('谢谢！您的消息已成功发送。');
            this.chineseForm.reset();
        } catch (error) {
            this.showErrorMessage('抱歉，发送消息时出错。请重试。');
            window.eastAfricomSecurity.logSecurityEvent('chinese_form_submission_error', {
                error: error.message
            });
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    showSuccessMessage(customMessage) {
        const form = customMessage ? this.chineseForm : this.form;
        const message = document.createElement('div');
        message.className = 'success-message';
        message.style.cssText = `
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 12px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        `;
        message.innerHTML = `<i class="fas fa-check-circle"></i> ${customMessage || 'Thank you! Your message has been sent successfully.'}`;
        
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage(customMessage) {
        const form = customMessage ? this.chineseForm : this.form;
        const message = document.createElement('div');
        message.className = 'error-message';
        message.style.cssText = `
            background: #D32F2F;
            color: white;
            padding: 1rem;
            border-radius: 12px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        `;
        message.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${customMessage || 'Sorry, there was an error sending your message. Please try again.'}`;
        
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Back to top functionality
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) {
            this.createBackToTopButton();
        }
        this.handleScroll();
        this.handleClick();
    }

    createBackToTopButton() {
        this.button = document.createElement('button');
        this.button.id = 'backToTop';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: #8B4513;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(139, 69, 19, 0.3);
        `;
        document.body.appendChild(this.button);
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        });
    }

    handleClick() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Certification and about section animations
class CertificationShowcase {
    constructor() {
        this.certCards = document.querySelectorAll('.certification-card');
        this.init();
    }

    init() {
        this.handleCertificationHover();
        this.animateOnScroll();
    }

    handleCertificationHover() {
        this.certCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.05)';
                card.style.boxShadow = '0 20px 40px rgba(34, 139, 34, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.certCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
}

// Testimonials interaction
class TestimonialCarousel {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.handleTestimonialHover();
        if (this.testimonials.length > 3) {
            this.createCarousel();
        }
    }

    handleTestimonialHover() {
        this.testimonials.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 15px 30px rgba(139, 69, 19, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    createCarousel() {
        // Placeholder for carousel implementation if needed
    }
}

// Performance optimization and loading
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    preloadCriticalResources() {
        // Disabled: These external Unsplash images were causing preload warnings
        // and weren't actually critical for initial page load
        /* 
        const criticalImages = [
            'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&h=1080&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&crop=center'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        */
    }

    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.style.setProperty('--transition-fast', '0.01ms');
            document.body.style.setProperty('--transition-medium', '0.01ms');
            document.body.style.setProperty('--transition-slow', '0.01ms');
        }
    }
}

// Utility functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    },

    formatCurrencyCNY(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: 2
        }).format(amount);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // GeoTargeting is initialized in geo-targeting.js
    // Removed duplicate initialization to prevent double API calls

    // Initialize all components
    new Navigation();
    new HeroSection();
    new ProductShowcase();
    new ContactForm();
    new BackToTop();
    new CertificationShowcase();
    new TestimonialCarousel();
    new PerformanceOptimizer();

    // Add CSS for animations and effects
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-modal {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .wechat-modal {
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Add progressive loading effects
    const elementsToLoad = document.querySelectorAll('.product-card, .testimonial-card, .certification-card');
    elementsToLoad.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            if (Utils.isInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }, index * 100);
    });

    // Handle scroll animations
    const scrollElements = document.querySelectorAll('.fade-in-up');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    });

    scrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        scrollObserver.observe(el);
    });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        AOS.refresh();
    }
});

// Handle window resize
window.addEventListener('resize', Utils.debounce(function() {
    AOS.refresh();
}, 250));

// Error handling
window.addEventListener('error', function(e) {
    // Log errors silently in production
});

// Update currency displays periodically
setInterval(() => {
    if (window.geoTargeting && typeof window.geoTargeting.updateCurrencyRates === 'function') {
        window.geoTargeting.updateCurrencyRates();
    }
}, 300000); // Update every 5 minutes

// Product Order Modal Functions
function openQuoteModal(productType) {
    // Pre-fill contact form based on product type
    const productNames = {
        'arabica-aa-washed': 'Arabica AA Grade - Washed Coffee',
        'arabica-ab-natural': 'Arabica AB Grade - Natural Coffee',
        'arabica-honey-process': 'Arabica Semi-Washed (Honey Process) Coffee',
        'robusta-grade1': 'Robusta Grade 1 - Washed Coffee',
        'specialty-microlot': 'Specialty Microlot - Competition Grade Coffee',
        'commercial-blend': 'Commercial Blend - Bulk Export Coffee',
        'arabica-aa': 'Arabica AA Grade Coffee',
        'commercial-coffee': 'Commercial Grade Coffee',
        'raw-cocoa': 'Raw Cocoa Beans',
        'cocoa-powder': 'Cocoa Powder'
    };
    
    const productName = productNames[productType] || 'Product Quote';
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Pre-fill the message field
        setTimeout(() => {
            const messageField = document.querySelector('#contact textarea');
            if (messageField) {
                messageField.value = `Hello, I would like to get a quote for ${productName}. Please provide pricing and availability details for bulk export orders.`;
                messageField.focus();
            }
            
            // Add highlight effect to contact form
            const contactForm = document.querySelector('.contact-form');
            if (contactForm) {
                contactForm.style.border = '3px solid #FFD700';
                contactForm.style.borderRadius = '15px';
                contactForm.style.transition = 'all 0.3s ease';
                contactForm.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
                
                setTimeout(() => {
                    contactForm.style.border = '';
                    contactForm.style.borderRadius = '';
                    contactForm.style.boxShadow = '';
                }, 3000);
            }
        }, 500);
    }
    
    // Track the order interest
    trackOrderClick(productType, 'product_card');
}

// Enhanced order tracking
function trackOrderClick(productType, source) {
    // You can add analytics tracking here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'order_interest', {
            'product_type': productType,
            'source': source
        });
    }
}