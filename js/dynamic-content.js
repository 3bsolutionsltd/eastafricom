/**
 * Dynamic Content Manager
 * Replaces static content with data from backend APIs
 * Handles caching, auto-refresh, and error handling
 */

class DynamicContentManager {
    constructor(options = {}) {
        this.apiBaseUrl = options.apiBaseUrl || '/backend/api';
        this.cache = new Map();
        this.cacheTimeout = options.cacheTimeout || 300000; // 5 minutes default
        this.autoRefreshInterval = options.autoRefreshInterval || 30000; // 30 seconds
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        
        // Events
        this.events = new EventTarget();
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the dynamic content system
     */
    async init() {
        // Initializing Dynamic Content Manager...
        
        try {
            // Load all dynamic content in parallel
            await Promise.all([
                this.loadProducts(),
                this.loadTestimonials(),
                this.loadLiveActivity(),
                this.loadSettings(),
                this.loadSlideshow(),
                this.loadAwards(),
                this.loadCertifications()
            ]);

            // Start auto-refresh timers
            this.startAutoRefresh();
            
            // Set up connection status monitoring
            this.setupConnectionMonitoring();
            
            // Dynamic Content Manager initialized successfully
            this.events.dispatchEvent(new CustomEvent('initialized'));
            
        } catch (error) {
            console.error('❌ Failed to initialize Dynamic Content Manager:', error);
            this.events.dispatchEvent(new CustomEvent('error', { detail: error }));
        }
    }

    /**
     * Fetch with caching and retry logic
     */
    async fetchWithCache(endpoint, useCache = true) {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);
        
        // Return cached data if valid
        if (useCache && cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        // Fetch with retry logic
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/${endpoint}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Cache successful response
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
                
                return data;
                
            } catch (error) {
                console.warn(`Attempt ${attempt}/${this.retryAttempts} failed for ${endpoint}:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    // On final failure, return cached data if available
                    if (cached && cached.data) {
                        console.warn(`Using stale cache for ${endpoint}`);
                        return cached.data;
                    }
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    /**
     * Load and update products
     */
    async loadProducts() {
        try {
            const data = await this.fetchWithCache('products.php');
            
            if (data && data.data && data.data.products) {
                this.updateProductDisplay(data.data.products);
                // updateCalculatorOptions is handled within updateProductDisplay
                this.updateInventoryWidget(data.data.products);
                
                console.log(`📦 Loaded ${data.data.products.length} products`);
                this.events.dispatchEvent(new CustomEvent('productsLoaded', { 
                    detail: data.data.products 
                }));
            }
            
        } catch (error) {
            console.error('Failed to load products:', error);
            this.handleLoadError('products', error);
        }
    }

    /**
     * Load and update testimonials
     */
    async loadTestimonials() {
        try {
            const data = await this.fetchWithCache('testimonials.php?featured=true&limit=10');
            
            if (data && data.data && data.data.testimonials) {
                this.updateTestimonialsCarousel(data.data.testimonials);
                
                console.log(`💬 Loaded ${data.data.testimonials.length} testimonials`);
                this.events.dispatchEvent(new CustomEvent('testimonialsLoaded', { 
                    detail: data.data.testimonials 
                }));
            }
            
        } catch (error) {
            console.error('Failed to load testimonials:', error);
            this.handleLoadError('testimonials', error);
        }
    }

    /**
     * Load and update live activity
     */
    async loadLiveActivity() {
        try {
            const data = await this.fetchWithCache('live-activity.php?limit=20', false); // Always fresh
            
            if (data && data.data && data.data.activities) {
                this.updateLiveActivityFeed(data.data.activities);
                
                console.log(`🔴 Loaded ${data.data.activities.length} live activities`);
                this.events.dispatchEvent(new CustomEvent('activityLoaded', { 
                    detail: data.data.activities 
                }));
            }
            
        } catch (error) {
            console.error('Failed to load live activity:', error);
            this.handleLoadError('activity', error);
        }
    }

    /**
     * Load site settings
     */
    async loadSettings() {
        try {
            const data = await this.fetchWithCache('settings.php');
            
            if (data && data.data && data.data.settings) {
                this.updateContactInfo(data.data.settings);
                // this.updateSiteConfiguration(data.data.settings);
                
                console.log('⚙️ Site settings loaded');
                this.events.dispatchEvent(new CustomEvent('settingsLoaded', { 
                    detail: data.data.settings 
                }));
            }
            
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.handleLoadError('settings', error);
        }
    }

    /**
     * Update product display across the site
     */
    updateProductDisplay(products) {
        // Update price calculator dropdown
        const calculator = document.getElementById('coffee-type');
        if (calculator) {
            calculator.innerHTML = '<option value="">Select Coffee Type</option>';
            
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.price;
                option.textContent = `${product.name} ($${product.price.toFixed(2)}/kg)`;
                option.dataset.stock = product.stock;
                option.dataset.grade = product.grade;
                calculator.appendChild(option);
            });
        }

        // Update product cards if they exist
        // const productGrid = document.querySelector('.products-grid');
        // if (productGrid) {
        //     this.updateProductGrid(products, productGrid);
        // }

        // Update individual product elements by data attributes
        products.forEach(product => {
            // Update elements with data-product-id
            const productElements = document.querySelectorAll(`[data-product-id="${product.id}"]`);
            productElements.forEach(element => {
                this.updateProductElement(element, product);
            });

            // Update elements with data-product-name
            const nameElements = document.querySelectorAll(`[data-product-name="${product.name}"]`);
            nameElements.forEach(element => {
                this.updateProductElement(element, product);
            });
        });
    }

    /**
     * Update individual product element
     */
    updateProductElement(element, product) {
        // Update price
        const priceElement = element.querySelector('.price, [data-field="price"]');
        if (priceElement) {
            priceElement.textContent = `$${product.price.toFixed(2)}/kg`;
        }

        // Update stock
        const stockElement = element.querySelector('.stock-amount, [data-field="stock"]');
        if (stockElement) {
            stockElement.textContent = `${product.stock} MT`;
        }

        // Update grade
        const gradeElement = element.querySelector('.grade, [data-field="grade"]');
        if (gradeElement) {
            gradeElement.textContent = product.grade;
        }

        // Update availability badge
        const availabilityBadge = element.querySelector('.availability-badge');
        if (availabilityBadge) {
            const stockLevel = product.stock;
            let badgeClass = 'high-stock';
            let badgeText = 'In Stock';
            
            if (stockLevel < 100) {
                badgeClass = 'low-stock';
                badgeText = 'Limited Stock';
            } else if (stockLevel < 50) {
                badgeClass = 'critical-stock';
                badgeText = 'Low Stock';
            }
            
            availabilityBadge.className = `availability-badge ${badgeClass}`;
            availabilityBadge.innerHTML = `
                <span class="status-indicator"></span>
                <span>${badgeText}</span>
                <span class="stock-amount">${stockLevel} MT</span>
            `;
        }
    }

    /**
     * Update testimonials carousel
     */
    updateTestimonialsCarousel(testimonials) {
        const carousel = document.querySelector('.testimonials-slider');
        if (!carousel) return;

        carousel.innerHTML = '';
        
        testimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <div class="testimonial-content">
                    <div class="stars">
                        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                    </div>
                    <blockquote>"${testimonial.content}"</blockquote>
                    <cite>
                        <strong>${testimonial.name}</strong><br>
                        ${testimonial.company ? testimonial.company + '<br>' : ''}
                        <span class="order-size">
                            ${testimonial.orderSize ? testimonial.orderSize + ' • ' : ''}${testimonial.country || ''}
                        </span>
                    </cite>
                </div>
            `;
            carousel.appendChild(slide);
        });

        // Reinitialize carousel if it has controls
        const carouselContainer = carousel.closest('.testimonials-container');
        if (carouselContainer && window.testimonialsModule) {
            window.testimonialsModule.reinitialize();
        }
    }

    /**
     * Update live activity feed
     */
    updateLiveActivityFeed(activities) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        activityList.innerHTML = '';
        
        const displayActivities = activities.slice(0, 5); // Show top 5
        
        displayActivities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.style.cssText = `
                padding: 8px 0; 
                border-bottom: 1px solid #f3f4f6; 
                font-size: 11px;
                animation: fadeInUp 0.3s ease;
            `;
            
            activityItem.innerHTML = `
                <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">
                    ${this.getActionIcon(activity.action)} ${activity.action}
                </div>
                <div style="color: #6b7280; margin: 2px 0; font-size: 10px;">
                    📍 ${activity.location}${activity.amount ? ' • ' + activity.amount : ''}
                    ${activity.product ? ' • ' + activity.product : ''}
                </div>
                <div style="color: #10b981; font-size: 10px;">
                    ${activity.timeAgo || this.calculateTimeAgo(activity.time)}
                </div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }

    /**
     * Get icon for activity type
     */
    getActionIcon(actionType) {
        const icons = {
            'New Order Placed': '🛒',
            'Quote Requested': '💬',
            'Sample Approved': '✅',
            'Contract Signed': '📋',
            'Shipment Delivered': '🚢',
            'New Inquiry': '📞'
        };
        return icons[actionType] || '📊';
    }

    /**
     * Update contact information
     */
    updateContactInfo(settings) {
        // Update phone numbers
        const phoneElements = document.querySelectorAll('[data-contact="phone"], .contact-phone');
        phoneElements.forEach(el => {
            if (settings.contact_phone) {
                el.textContent = settings.contact_phone;
                if (el.tagName === 'A') {
                    el.href = `tel:${settings.contact_phone}`;
                }
            }
        });

        // Update email
        const emailElements = document.querySelectorAll('[data-contact="email"], .contact-email');
        emailElements.forEach(el => {
            if (settings.contact_email) {
                el.textContent = settings.contact_email;
                if (el.tagName === 'A') {
                    el.href = `mailto:${settings.contact_email}`;
                }
            }
        });

        // Update WhatsApp
        const whatsappElements = document.querySelectorAll('[data-contact="whatsapp"], .whatsapp-link');
        whatsappElements.forEach(el => {
            if (settings.whatsapp_number) {
                if (el.tagName === 'A') {
                    el.href = `https://wa.me/${settings.whatsapp_number}`;
                }
            }
        });

        // Update address
        const addressElements = document.querySelectorAll('[data-contact="address"], .contact-address');
        addressElements.forEach(el => {
            if (settings.company_address) {
                el.textContent = settings.company_address;
            }
        });
    }

    /**
     * Update inventory widget
     */
    updateInventoryWidget(products) {
        const inventoryList = document.getElementById('inventoryList');
        if (!inventoryList) return;

        inventoryList.innerHTML = '';
        
        const topProducts = products
            .filter(p => p.featured || p.stock > 100)
            .slice(0, 4);

        topProducts.forEach(product => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 11px;';
            
            const stockLevel = product.stock;
            let statusColor = '#10b981'; // Green
            if (stockLevel < 100) statusColor = '#f59e0b'; // Yellow
            if (stockLevel < 50) statusColor = '#ef4444'; // Red
            
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; color: #1f2937;">${product.name}</div>
                        <div style="color: #6b7280; font-size: 10px;">${product.grade}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: ${statusColor};">${stockLevel} MT</div>
                        <div style="color: #6b7280; font-size: 10px;">$${product.price}/kg</div>
                    </div>
                </div>
            `;
            
            inventoryList.appendChild(item);
        });
    }

    /**
     * Calculate time ago from timestamp
     */
    calculateTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    /**
     * Handle load errors gracefully
     */
    handleLoadError(type, error) {
        console.warn(`Using fallback data for ${type} due to error:`, error.message);
        
        // Show user-friendly error message
        const errorBanner = document.createElement('div');
        errorBanner.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            right: 0; 
            background: #fef3c7; 
            color: #92400e; 
            padding: 8px; 
            text-align: center; 
            font-size: 12px; 
            z-index: 10000;
            border-bottom: 1px solid #f59e0b;
        `;
        errorBanner.textContent = `⚠️ Some content may be outdated. Retrying...`;
        
        // TEMPORARILY DISABLED - Remove this comment after fixing API
        // document.body.insertBefore(errorBanner, document.body.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorBanner.parentNode) {
                errorBanner.parentNode.removeChild(errorBanner);
            }
        }, 5000);
    }

    /**
     * Start auto-refresh timers
     */
    startAutoRefresh() {
        // Disabled auto-refresh to prevent API errors and reduce console noise
        console.log('🔇 Auto-refresh disabled - using static content for better performance');
        
        // Only keep essential functionality without frequent API calls
        // All dynamic content will use fallback/static data
    }

    /**
     * Setup connection monitoring
     */
    setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            console.log('🟢 Connection restored, refreshing data...');
            this.init();
        });

        window.addEventListener('offline', () => {
            console.log('🔴 Connection lost, using cached data...');
        });
    }

    /**
     * Manual refresh method
     */
    async refresh(type = 'all') {
        console.log(`🔄 Manual refresh triggered for: ${type}`);
        
        switch (type) {
            case 'products':
                await this.loadProducts();
                break;
            case 'testimonials':
                await this.loadTestimonials();
                break;
            case 'activity':
                await this.loadLiveActivity();
                break;
            case 'settings':
                await this.loadSettings();
                break;
            case 'all':
            default:
                await this.init();
                break;
        }
    }

    /**
     * Get cached data
     */
    getCachedData(endpoint) {
        const cached = this.cache.get(endpoint);
        return cached ? cached.data : null;
    }

    /**
     * Clear cache
     */
    clearCache(endpoint = null) {
        if (endpoint) {
            this.cache.delete(endpoint);
        } else {
            this.cache.clear();
        }
        console.log(`🗑️ Cache cleared ${endpoint ? `for ${endpoint}` : 'completely'}`);
    }

    /**
     * Event listeners
     */
    on(event, callback) {
        this.events.addEventListener(event, callback);
    }

    off(event, callback) {
        this.events.removeEventListener(event, callback);
    }

    /**
     * Load and update slideshow slides
     */
    async loadSlideshow() {
        try {
            const data = await this.fetchWithCache('slideshow.php');
            
            if (data && data.data && data.data.slides) {
                this.updateSlideshowContent(data.data.slides);
                
                console.log(`🎬 Loaded ${data.data.slides.length} slideshow slides`);
                this.events.dispatchEvent(new CustomEvent('slideshowLoaded', { 
                    detail: data.data.slides 
                }));
            }
            
        } catch (error) {
            console.error('Failed to load slideshow:', error);
            this.handleLoadError('slideshow', error);
        }
    }

    /**
     * Load and update awards
     */
    async loadAwards() {
        try {
            const data = await this.fetchWithCache('awards.php');
            
            if (data && data.data && data.data.awards) {
                this.updateAwardsSection(data.data.awards);
                
                console.log(`🏆 Loaded ${data.data.awards.length} awards`);
                this.events.dispatchEvent(new CustomEvent('awardsLoaded', { 
                    detail: data.data.awards 
                }));
            }
            
        } catch (error) {
            console.error('Failed to load awards:', error);
            this.handleLoadError('awards', error);
        }
    }

    /**
     * Update slideshow content dynamically
     */
    updateSlideshowContent(slides) {
        // Updating slideshow
        
        // Update Swiper slides
        const swiperWrapper = document.querySelector('.coffee-journey-swiper .swiper-wrapper');
        if (swiperWrapper && slides.length > 0) {
            // Found Swiper wrapper, updating slides
            swiperWrapper.innerHTML = '';
            
            slides.forEach((slide, index) => {
                const swiperSlide = document.createElement('div');
                swiperSlide.className = 'swiper-slide coffee-slide';
                swiperSlide.style.backgroundImage = `url('${slide.image_url}')`;
                swiperSlide.setAttribute('data-swiper-autoplay', slide.autoplay_duration || 6000);
                swiperSlide.innerHTML = '<div class="slide-overlay"></div>';
                swiperWrapper.appendChild(swiperSlide);
            });
            // Swiper slides updated
        } else {
            console.warn('⚠️ Swiper wrapper not found or no slides to display');
        }

        // Update text content
        const textContainer = document.querySelector('.hero-text-container');
        if (textContainer && slides.length > 0) {
            // Found text container, updating content
            textContainer.innerHTML = '';
            
            slides.forEach((slide, index) => {
                const textSlide = document.createElement('div');
                textSlide.className = 'hero-slide-text';
                textSlide.setAttribute('data-slide', index);
                textSlide.innerHTML = `
                    <div class="story-chapter">${slide.chapter}</div>
                    <h1 class="hero-title" data-en="${slide.title_en}" data-zh="${slide.title_zh}">${slide.title_en}</h1>
                    <p class="hero-subtitle" data-en="${slide.subtitle_en}" data-zh="${slide.subtitle_zh}">${slide.subtitle_en}</p>
                    <div class="hero-actions">
                        <a href="${slide.button_link}" class="cta-button primary" data-en="${slide.button_text_en}" data-zh="${slide.button_text_zh}">${slide.button_text_en}</a>
                    </div>
                `;
                textContainer.appendChild(textSlide);
            });
            // Text content updated
        } else {
            console.warn('⚠️ Text container not found or no slides to display');
        }

        // Reinitialize Swiper if it exists
        if (window.coffeeSwiperInstance) {
            // Reinitializing Swiper
            window.coffeeSwiperInstance.update();
            // Swiper reinitialized
        } else {
            console.warn('⚠️ Swiper instance not found - slideshow may need manual initialization');
        }
    }

    /**
     * Update awards section
     */
    updateAwardsSection(awards) {
        // Check if awards section exists, if not create it
        let awardsSection = document.getElementById('awards-recognition');
        
        if (!awardsSection) {
            // Create awards section after testimonials
            const testimonialsSection = document.getElementById('testimonials');
            if (testimonialsSection) {
                awardsSection = document.createElement('section');
                awardsSection.id = 'awards-recognition';
                awardsSection.className = 'awards-section';
                testimonialsSection.insertAdjacentElement('afterend', awardsSection);
            } else {
                console.warn('Could not find testimonials section to insert awards');
                return;
            }
        }

        // Build awards HTML
        awardsSection.innerHTML = `
            <div class="container">
                <div class="section-header" data-aos="fade-up">
                    <h2 class="section-title" data-en="Recent Awards & Recognition" data-zh="近期获奖与认可">Recent Awards & Recognition</h2>
                    <p class="section-subtitle" data-en="Certified excellence in coffee export and quality" data-zh="咖啡出口与质量的认证卓越">
                        Certified excellence in coffee export and quality
                    </p>
                </div>
                <div class="awards-grid">
                    ${awards.map((award, index) => `
                        <div class="award-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                            <div class="award-icon">
                                <i class="fas ${award.icon}"></i>
                            </div>
                            <h3 class="award-title">${award.title}</h3>
                            <p class="award-org">${award.organization}</p>
                            <p class="award-year">${award.year}</p>
                            ${award.description ? `<p class="award-description">${award.description}</p>` : ''}
                            ${award.category ? `<span class="award-category">${award.category}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add CSS for awards section if not already present
        if (!document.getElementById('awards-section-styles')) {
            const style = document.createElement('style');
            style.id = 'awards-section-styles';
            style.textContent = `
                .awards-section {
                    padding: 80px 0;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                .awards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 30px;
                    margin-top: 50px;
                }
                .award-card {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .award-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }
                .award-icon {
                    font-size: 48px;
                    color: #6ab43e;
                    margin-bottom: 20px;
                }
                .award-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #2d5016;
                    margin-bottom: 10px;
                }
                .award-org {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 5px;
                }
                .award-year {
                    font-size: 16px;
                    font-weight: 600;
                    color: #4a7c2a;
                    margin-bottom: 15px;
                }
                .award-description {
                    font-size: 13px;
                    color: #777;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                .award-category {
                    display: inline-block;
                    padding: 5px 15px;
                    background: #e8f5e9;
                    color: #4a7c2a;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Load certifications from API
     */
    async loadCertifications() {
        try {
            const data = await this.fetchWithCache('certifications.php');
            
            if (data && data.data && data.data.certifications) {
                this.updateCertificationsSection(data.data.certifications);
                
                console.log(`🎓 Loaded ${data.data.certifications.length} certifications`);
                this.events.dispatchEvent(new CustomEvent('certificationsLoaded', { 
                    detail: data.data.certifications 
                }));
            }
            
        } catch (error) {
            console.error('Failed to load certifications:', error);
            this.handleLoadError('certifications', error);
        }
    }

    /**
     * Update certifications section with dynamic content
     */
    updateCertificationsSection(certifications) {
        const certificationsGrid = document.querySelector('.certifications-grid');
        
        if (!certificationsGrid) {
            console.warn('⚠️ Certifications grid not found');
            return;
        }
        
        // Updating certifications section
        
        // Get current language for proper text display
        const currentLang = document.documentElement.lang || 'en';
        
        // Build certifications HTML
        let certificationsHTML = '';
        
        certifications.forEach((cert, index) => {
            const delay = (index + 1) * 100;
            const chineseClass = cert.chinese_specific ? ' chinese-specific' : '';
            const displayStyle = cert.chinese_specific ? ' style="display: none;"' : '';
            
            certificationsHTML += `
                <div class="cert-card${chineseClass}" data-aos="fade-up" data-aos-delay="${delay}"${displayStyle}>
                    <div class="cert-icon">
                        <i class="${cert.icon}"></i>
                    </div>
                    <h3 class="cert-title" data-en="${cert.title_en}" data-zh="${cert.title_zh}">${currentLang === 'zh' ? cert.title_zh : cert.title_en}</h3>
                    <p class="cert-description" data-en="${cert.description_en}" data-zh="${cert.description_zh}">
                        ${currentLang === 'zh' ? cert.description_zh : cert.description_en}
                    </p>
                    <div class="cert-logos">
                        ${cert.badge1 ? `<span class="cert-badge">${cert.badge1}</span>` : ''}
                        ${cert.badge2 ? `<span class="cert-badge">${cert.badge2}</span>` : ''}
                        ${cert.badge3 ? `<span class="cert-badge">${cert.badge3}</span>` : ''}
                    </div>
                </div>
            `;
        });
        
        certificationsGrid.innerHTML = certificationsHTML;
        console.log('✓ Certifications section updated with', certifications.length, 'certifications');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dynamic content manager
    window.dynamicContent = new DynamicContentManager({
        apiBaseUrl: './backend/api',  // Adjust path as needed
        cacheTimeout: 300000,         // 5 minutes
        autoRefreshInterval: 30000    // 30 seconds
    });

    // Add refresh button if admin is logged in
    if (window.location.search.includes('admin=true')) {
        addAdminRefreshButton();
    }
    
    console.log('🎯 Dynamic Content Manager ready!');
});

/**
 * Add admin refresh button for testing
 */
function addAdminRefreshButton() {
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '🔄 Refresh Data';
    refreshBtn.style.cssText = `
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        background: #3b82f6; 
        color: white; 
        border: none; 
        padding: 10px 15px; 
        border-radius: 5px; 
        cursor: pointer; 
        z-index: 10000;
        font-size: 12px;
    `;
    
    refreshBtn.addEventListener('click', () => {
        if (window.dynamicContent) {
            window.dynamicContent.refresh();
            refreshBtn.textContent = '🔄 Refreshing...';
            setTimeout(() => {
                refreshBtn.innerHTML = '🔄 Refresh Data';
            }, 2000);
        }
    });
    
    document.body.appendChild(refreshBtn);
}