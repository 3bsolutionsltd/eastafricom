// Coffee Hero Slideshow with Swiper and Smart UI Management
class CoffeeSlideshow {
    constructor(container, interval = 6000) {
        this.container = document.querySelector(container) || document.querySelector('.coffee-journey-swiper');
        this.textSlides = document.querySelectorAll('.hero-slide-text');
        this.currentSlide = 0;
        this.interval = interval; // 6 seconds for story reading
        this.swiper = null;
        this.isUserInteracting = false;
        
        this.init();
    }
    
    init() {
        // Initializing Coffee Journey Swiper slideshow
        
        if (!this.container) {
            return;
        }
        
        // Initialize Swiper with Fully Green theme styling
        this.initSwiper();
        
        // Show first text slide
        if (this.textSlides && this.textSlides.length > 0) {
            this.textSlides.forEach(textSlide => {
                textSlide.classList.remove('active', 'entering', 'exiting');
            });
            this.textSlides[0].classList.add('active', 'entering');
        }
        
        // Initialize smart UI management
        this.initSmartUIManagement();
        
        // Add hover pause functionality with smart UI
        if (this.container) {
            this.container.addEventListener('mouseenter', () => this.handleSlideShowFocus(true));
            this.container.addEventListener('mouseleave', () => this.handleSlideShowFocus(false));
        }
    }
    
    initSwiper() {
        // Swiper configuration with Fully Green theme styling
        this.swiper = new Swiper(this.container, {
            // Basic settings
            loop: true,
            autoplay: {
                delay: 8000, // 8 seconds for comfortable story reading
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: false,
                stopOnLastSlide: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000,
            observer: true,
            observeParents: true,
            
            // Navigation
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
            },
            
            // Events
            on: {
                slideChange: () => {
                    this.onSlideChange();
                },
                init: () => {
                    // Swiper initialized successfully
                }
            }
        });
        
        // Store globally for dynamic content updates
        window.coffeeSwiperInstance = this.swiper;
    }

    initSmartUIManagement() {
        // Add slideshow focus state management
        const hero = document.querySelector('.hero');
        if (hero) {
            // Mark when slideshow is in active viewing state
            hero.classList.add('coffee-slideshow-active');
            
            // Smart management based on scroll position
            this.initScrollBasedManagement();
        }
    }
    
    initScrollBasedManagement() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero');
            const heroRect = hero.getBoundingClientRect();
            const isHeroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (isHeroVisible && !this.isUserInteracting) {
                    // User is viewing slideshow - minimize distractions
                    document.body.classList.add('coffee-slideshow-active');
                } else {
                    // User has scrolled away - show full UI
                    document.body.classList.remove('coffee-slideshow-active');
                }
            }, 100);
        });
    }
    
    handleSlideShowFocus(isFocused) {
        this.isUserInteracting = isFocused;
        
        if (isFocused) {
            this.pause();
            // Enhance focus state
            document.body.classList.add('coffee-slideshow-active');
        } else {
            this.resume();
            // Check if still in hero view before removing focus
            setTimeout(() => {
                if (!this.isUserInteracting) {
                    const hero = document.querySelector('.hero');
                    const heroRect = hero.getBoundingClientRect();
                    const isHeroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
                    
                    if (!isHeroVisible) {
                        document.body.classList.remove('coffee-slideshow-active');
                    }
                }
            }, 500);
        }
    }
    
    start() {
        this.timer = setInterval(() => {
            this.nextSlide();
        }, this.interval);
    }
    
    pause() {
        this.isPaused = true;
        clearInterval(this.timer);
    }
    
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.start();
        }
    }
    
    nextSlide() {
        if (!this.slides || this.slides.length === 0) return;
        
        const prevSlide = this.currentSlide;
        const nextSlide = (this.currentSlide + 1) % this.slides.length;
        
        // Start text exit animation
        if (this.textSlides && this.textSlides[prevSlide]) {
            this.textSlides[prevSlide].classList.add('exiting');
            this.textSlides[prevSlide].classList.remove('active', 'entering');
        }
        
        // Remove active class from current slide
        this.slides[prevSlide].classList.remove('active');
        
        // Move to next slide
        this.currentSlide = nextSlide;
        
        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
        
        // Start text enter animation after a brief delay
        setTimeout(() => {
            if (this.textSlides && this.textSlides[prevSlide]) {
                this.textSlides[prevSlide].classList.remove('exiting');
            }
            
            if (this.textSlides && this.textSlides[this.currentSlide]) {
                this.textSlides[this.currentSlide].classList.add('active', 'entering');
            }
        }, 300); // Delay for smooth transition
        
        // Update quality indicators
        this.updateQualityBadges();
    }

    onSlideChange() {
        if (!this.swiper) return;
        
        // Get current slide index (accounting for loop)
        this.currentSlide = this.swiper.realIndex;
        
        // Handle text slide transitions with proper cleanup
        if (this.textSlides && this.textSlides.length > 0) {
            // First, hide ALL text slides immediately
            this.textSlides.forEach((textSlide, index) => {
                textSlide.classList.remove('active', 'entering', 'exiting');
                textSlide.style.opacity = '0';
                textSlide.style.visibility = 'hidden';
                textSlide.style.zIndex = '5';
            });
            
            // Then show only the current text slide after a brief delay
            const currentTextSlide = this.textSlides[this.currentSlide];
            if (currentTextSlide) {
                setTimeout(() => {
                    // Ensure all others are still hidden
                    this.textSlides.forEach((slide, index) => {
                        if (index !== this.currentSlide) {
                            slide.classList.remove('active', 'entering', 'exiting');
                            slide.style.opacity = '0';
                            slide.style.visibility = 'hidden';
                        }
                    });
                    
                    // Show current slide
                    currentTextSlide.style.opacity = '1';
                    currentTextSlide.style.visibility = 'visible';
                    currentTextSlide.style.zIndex = '10';
                    currentTextSlide.classList.add('active', 'entering');
                }, 300); // Slightly longer delay for complete transition
            }
        }
        
        // Update quality indicators
        this.updateQualityBadges();
    }

    updateQualityBadges() {
        // Quality badge rotation logic (if present)
        const badges = document.querySelectorAll('.quality-badge');
        badges.forEach((badge, index) => {
            badge.style.animationDelay = `${index * 0.2}s`;
        });
    }
}

// Coffee Bean Animation Effect
class CoffeeEffects {
    constructor() {
        this.init();
    }

    init() {
        this.createFloatingBeans();
        this.initScrollEffects();
    }

    createFloatingBeans() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create floating coffee beans
        for (let i = 0; i < 15; i++) {
            const bean = document.createElement('div');
            bean.className = 'floating-bean';
            bean.innerHTML = '☕';
            bean.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 15}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.3 + 0.1};
                color: #8B4513;
                pointer-events: none;
                z-index: 2;
                animation: float-bean ${Math.random() * 10 + 15}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            hero.appendChild(bean);
        }

        // Add CSS for floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-bean {
                0% { 
                    transform: translateY(100vh) rotate(0deg); 
                    opacity: 0; 
                }
                10% { 
                    opacity: 0.3; 
                }
                90% { 
                    opacity: 0.1; 
                }
                100% { 
                    transform: translateY(-100px) rotate(360deg); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
    }

    initScrollEffects() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            // Parallax effect for slideshow
            const slideshow = document.querySelector('.hero-slideshow');
            if (slideshow) {
                slideshow.style.transform = `translateY(${parallax}px)`;
            }
        });
    }
}

// Coffee Aroma Animation
class CoffeeAroma {
    constructor() {
        this.init();
    }

    init() {
        this.createAromaEffect();
    }

    createAromaEffect() {
        const hero = document.querySelector('.hero-content');
        if (!hero) return;

        // Create aroma particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'aroma-particle';
            particle.innerHTML = '~';
            particle.style.cssText = `
                position: absolute;
                font-size: 24px;
                color: rgba(139, 69, 19, 0.3);
                pointer-events: none;
                z-index: 3;
                left: ${20 + Math.random() * 60}%;
                top: 60%;
                animation: aroma-rise ${3 + Math.random() * 2}s ease-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            hero.appendChild(particle);
        }

        // Add CSS for aroma animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes aroma-rise {
                0% { 
                    transform: translateY(0) scale(1) rotate(0deg); 
                    opacity: 0.6; 
                }
                50% { 
                    transform: translateY(-30px) scale(1.2) rotate(180deg); 
                    opacity: 0.4; 
                }
                100% { 
                    transform: translateY(-60px) scale(0.8) rotate(360deg); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded - prevent multiple instances
if (!window.coffeeSlideShowInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
        new CoffeeSlideshow();
        new CoffeeEffects();
        new CoffeeAroma();
        window.coffeeSlideShowInitialized = true;
    });
}

// Coffee Quality Indicators
class CoffeeQualityIndicators {
    constructor() {
        this.init();
    }

    init() {
        this.addQualityBadges();
        this.initQualityAnimations();
    }

    addQualityBadges() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        const qualityIndicators = document.createElement('div');
        qualityIndicators.className = 'coffee-quality-indicators';
        qualityIndicators.innerHTML = `
            <div class="quality-badge animated">
                <span class="badge-icon">🏆</span>
                <span class="badge-text">Premium Grade</span>
            </div>
            <div class="quality-badge animated">
                <span class="badge-icon">🌱</span>
                <span class="badge-text">100% Organic</span>
            </div>
            <div class="quality-badge animated">
                <span class="badge-icon">⚡</span>
                <span class="badge-text">Fresh Roasted</span>
            </div>
        `;

        qualityIndicators.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 4;
        `;

        heroContent.appendChild(qualityIndicators);

        // Add styles for quality badges
        const style = document.createElement('style');
        style.textContent = `
            .quality-badge {
                background: rgba(255, 255, 255, 0.95);
                color: #8B4513;
                padding: 8px 16px;
                border-radius: 25px;
                font-size: 0.9rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 8px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(139, 69, 19, 0.3);
                animation: badge-glow 3s ease-in-out infinite;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }

            .badge-icon {
                font-size: 1.1rem;
            }

            @keyframes badge-glow {
                0%, 100% { 
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    border-color: rgba(139, 69, 19, 0.3);
                }
                50% { 
                    box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
                    border-color: rgba(139, 69, 19, 0.6);
                }
            }

            @media (max-width: 768px) {
                .coffee-quality-indicators {
                    position: relative !important;
                    top: 0 !important;
                    right: 0 !important;
                    flex-direction: row !important;
                    justify-content: center !important;
                    margin-top: 20px !important;
                }
                
                .quality-badge {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    initQualityAnimations() {
        // Add entrance animations with delays
        setTimeout(() => {
            const badges = document.querySelectorAll('.quality-badge');
            badges.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.animation += ', slideInRight 0.6s ease-out';
                }, index * 200);
            });
        }, 1000);

        // Add slideInRight animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Floating UI Management
let floatingUIVisible = false;

function toggleFloatingUI() {
    floatingUIVisible = !floatingUIVisible;
    
    if (floatingUIVisible) {
        document.body.classList.add('floating-ui-visible');
        document.body.classList.remove('coffee-slideshow-active');
        
        // Show notification
        showFloatingUINotification('Floating buttons are now always visible', 'info');
    } else {
        document.body.classList.remove('floating-ui-visible');
        
        // Show notification
        showFloatingUINotification('Smart UI mode: Buttons auto-hide during coffee journey', 'success');
    }
}

function showFloatingUINotification(message, type) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `floating-ui-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'info' ? 'rgba(52, 152, 219, 0.95)' : 'rgba(46, 204, 113, 0.95)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        backdrop-filter: blur(10px);
        animation: slideInFromRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromRight {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutToRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Add helpful tooltips for smart floating elements
function addSmartUITooltips() {
    // Compare Products button removed - no tooltip needed
    
    // Add tooltip to Live Chat widget
    const chatWidget = document.querySelector('.live-chat-widget');
    if (chatWidget) {
        const chatTrigger = chatWidget.querySelector('div[onclick="toggleChat()"]');
        if (chatTrigger) {
            chatTrigger.title = 'Live Chat - Auto-minimizes during coffee journey. Hover to access.';
        }
    }
}

// Enhanced floating UI management with better user feedback
function enhancedToggleFloatingUI() {
    const currentState = document.body.classList.contains('floating-ui-visible');
    
    if (!currentState) {
        // Show all floating elements
        document.body.classList.add('floating-ui-visible');
        document.body.classList.remove('coffee-slideshow-active');
        
        // Highlight all floating elements briefly
        const floatingElements = document.querySelectorAll('.smart-floating-element, .floating-order-btn, .back-to-top');
        floatingElements.forEach(el => {
            el.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
            setTimeout(() => {
                el.style.boxShadow = '';
            }, 2000);
        });
        
        showFloatingUINotification('🔓 Live Chat now always visible', 'info');
    } else {
        // Return to smart mode
        document.body.classList.remove('floating-ui-visible');
        showFloatingUINotification('🧠 Smart mode: Live Chat auto-hides during coffee journey', 'success');
    }
}

// Initialize slideshow and quality indicators
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slideshow with synchronized text transitions
    const slideshow = new CoffeeSlideshow('.hero-slideshow', 5000);
    
    // Initialize quality indicators
    new CoffeeQualityIndicators();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            slideshow.nextSlide();
        }
        
        // Toggle floating UI with 'F' key
        if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            enhancedToggleFloatingUI();
        }
    });
    
    // Show initial smart UI notification after 2 seconds
    setTimeout(() => {
        showFloatingUINotification('🌿 Fully Green UI: Live Chat auto-hides during Uganda coffee story for natural flow', 'info');
    }, 2000);
    
    // Add tooltip instructions for floating elements
    setTimeout(() => {
        addSmartUITooltips();
    }, 3000);
});