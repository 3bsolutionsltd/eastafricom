// Simple Hero Slideshow - FullyGreen Style
// Clean, lightweight slideshow without complex dependencies

class SimpleHeroSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.interval = 5000; // 5 seconds
        this.autoplayTimer = null;
        this.slidesData = [];
        
        // Load slideshow from backend
        this.loadSlideshow();
    }
    
    async loadSlideshow() {
        try {
            console.log('🎬 Loading slideshow from API...');
            const response = await fetch('backend/api/slideshow.php');
            const result = await response.json();
            
            console.log('📊 Slideshow API response:', result);
            
            if (result.success && result.data.slides && result.data.slides.length > 0) {
                console.log(`✅ Loaded ${result.data.slides.length} slides from database`);
                this.slidesData = result.data.slides;
                this.buildSlideshow();
                this.init();
            } else {
                console.warn('⚠️ No slides in database, using fallback');
                this.useFallbackSlides();
            }
        } catch (error) {
            console.error('❌ Slideshow API error:', error);
            this.useFallbackSlides();
        }
    }
    
    buildSlideshow() {
        const heroSlideshow = document.querySelector('.hero-slideshow');
        const slideNav = document.querySelector('.hero-slide-nav');
        const heroSection = document.querySelector('.hero');
        
        if (!heroSlideshow || !slideNav) return;
        
        // Clear existing content
        heroSlideshow.innerHTML = '';
        slideNav.innerHTML = '';
        
        // Build slides
        this.slidesData.forEach((slide, index) => {
            // Create slide element
            const slideDiv = document.createElement('div');
            slideDiv.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            slideDiv.style.backgroundImage = `url('${slide.image_url}')`;
            
            // Add text content overlay for each slide
            const textOverlay = document.createElement('div');
            textOverlay.className = `slide-text-content ${index === 0 ? 'active' : ''}`;
            
            // Build buttons HTML if button data exists
            let buttonsHtml = '';
            if (slide.button_text_en && slide.button_link) {
                // Split button text for multi-line display in circle
                const btnText = slide.button_text_en.replace(/ /g, '<br>');
                buttonsHtml = `
                    <div class="slide-btn-wrap">
                        <a href="${slide.button_link}" class="slide-btn btn-primary">
                            <span>${slide.button_text_en}</span>
                            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                        </a>
                        <a href="#contact" class="slide-btn btn-secondary">
                            <span>CONTACT<br>US</span>
                            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                `;
            }
            
            textOverlay.innerHTML = `
                <div class="slide-chapter" data-animation="fadeInDown">${slide.chapter || ''}</div>
                <h1 class="slide-title" data-animation="fadeInDown">${slide.title_en || ''}</h1>
                <p class="slide-description" data-animation="fadeInDown">${slide.subtitle_en || ''}</p>
                ${buttonsHtml}
            `;
            slideDiv.appendChild(textOverlay);
            
            heroSlideshow.appendChild(slideDiv);
            
            // Create navigation dot
            const dot = document.createElement('button');
            dot.className = `slide-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            slideNav.appendChild(dot);
        });
        
        // Add navigation arrows
        if (heroSection && !heroSection.querySelector('.slide-nav-arrows')) {
            const arrowsDiv = document.createElement('div');
            arrowsDiv.className = 'slide-nav-arrows';
            arrowsDiv.innerHTML = `
                <button class="slide-arrow prev" aria-label="Previous slide">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="slide-arrow next" aria-label="Next slide">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
            heroSection.appendChild(arrowsDiv);
            
            // Add arrow click events
            arrowsDiv.querySelector('.prev').addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoplay();
            });
            arrowsDiv.querySelector('.next').addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoplay();
            });
        }
        
        // Update references
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.slide-dot');
        this.textContents = document.querySelectorAll('.slide-text-content');
        
        // Set autoplay duration from first slide
        if (this.slidesData[0].autoplay_duration) {
            this.interval = parseInt(this.slidesData[0].autoplay_duration) * 1000;
        }
    }
    
    useFallbackSlides() {
        // Use existing hardcoded slides if API fails
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.slide-dot');
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        if (!this.slides || this.slides.length === 0) {
            return;
        }
        
        // Add click event to dots
        if (this.dots && this.dots.length > 0) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.resetAutoplay();
                });
            });
        }
        
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
        if (!this.slides || !this.dots) return;
        
        // Remove active class from current slide and dot
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.remove('active');
        }
        if (this.textContents && this.textContents[this.currentSlide]) {
            this.textContents[this.currentSlide].classList.remove('active');
        }
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide and dot
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.add('active');
        }
        if (this.textContents && this.textContents[this.currentSlide]) {
            this.textContents[this.currentSlide].classList.add('active');
        }
    }
    
    nextSlide() {
        if (!this.slides || this.slides.length === 0) return;
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        if (!this.slides || this.slides.length === 0) return;
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
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
