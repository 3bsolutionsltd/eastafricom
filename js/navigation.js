// Enhanced Navigation with Fully Green Theme Integration
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.orderBanner = document.querySelector('.order-now-banner');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Banner management
        this.initBannerManagement();
        
        // Scroll effects
        this.initScrollEffects();
        
        // Active link highlighting
        this.initActiveLinks();
        
        // Navigation system initialized
    }
    
    initBannerManagement() {
        // Keep banner visible - don't auto-hide
        if (this.orderBanner) {
            // Order banner initialized
        }
    }
    
    hideBanner() {
        if (this.orderBanner) {
            this.orderBanner.style.transform = 'translateY(-100%)';
            this.navbar.classList.add('banner-hidden');
            document.body.classList.add('banner-hidden');
            
            setTimeout(() => {
                this.orderBanner.style.display = 'none';
            }, 300);
        }
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    initScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class for styling
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Keep navbar always visible
            this.navbar.style.transform = 'translateY(0)'
            
            lastScrollY = currentScrollY;
        });
    }
    
    initActiveLinks() {
        // Highlight active section based on scroll position
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveLink(sectionId);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveLink(activeSection) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Language toggle functionality
function toggleLanguage() {
    const currentLang = document.getElementById('current-lang');
    const altLang = document.getElementById('alt-lang');
    const body = document.body;
    
    if (currentLang.textContent === 'EN') {
        // Switch to Chinese
        currentLang.textContent = '中文';
        altLang.textContent = 'EN';
        body.setAttribute('data-lang', 'zh');
        
        // Update all elements with language attributes
        document.querySelectorAll('[data-zh]').forEach(element => {
            element.textContent = element.getAttribute('data-zh');
        });
    } else {
        // Switch to English
        currentLang.textContent = 'EN';
        altLang.textContent = '中文';
        body.setAttribute('data-lang', 'en');
        
        // Update all elements with language attributes
        document.querySelectorAll('[data-en]').forEach(element => {
            element.textContent = element.getAttribute('data-en');
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80; // Account for fixed navbar
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});