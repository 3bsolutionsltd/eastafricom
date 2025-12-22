// Simple Hero Slideshow - FullyGreen Style
// Clean, lightweight slideshow without complex dependencies

class SimpleHeroSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.slide-dot');
        this.currentSlide = 0;
        this.interval = 5000; // 5 seconds
        this.autoplayTimer = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎬 Simple Hero Slideshow initialized with', this.slides.length, 'slides');
        
        // Add click event to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => this.stopAutoplay());
            heroSection.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }
    
    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    startAutoplay() {
        this.stopAutoplay(); // Clear any existing timer
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.interval);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SimpleHeroSlideshow();
    });
} else {
    new SimpleHeroSlideshow();
}
