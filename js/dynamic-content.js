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
        console.log('🔄 Initializing Dynamic Content Manager...');
        
        try {
            // Load all dynamic content in parallel
            await Promise.all([
                this.loadProducts(),
                this.loadTestimonials(),
                this.loadLiveActivity(),
                this.loadSettings()
            ]);

            // Start auto-refresh timers
            this.startAutoRefresh();
            
            // Set up connection status monitoring
            this.setupConnectionMonitoring();
            
            console.log('✅ Dynamic Content Manager initialized successfully');
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
                this.updateCalculatorOptions(data.data.products);
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
                this.updateSiteConfiguration(data.data.settings);
                
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
        const productGrid = document.querySelector('.products-grid');
        if (productGrid) {
            this.updateProductGrid(products, productGrid);
        }

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
        // Refresh products every 5 minutes
        setInterval(() => {
            console.log('🔄 Auto-refreshing products...');
            this.loadProducts();
        }, 300000);
        
        // Refresh live activity every 30 seconds
        setInterval(() => {
            console.log('🔄 Auto-refreshing live activity...');
            this.loadLiveActivity();
        }, this.autoRefreshInterval);
        
        // Refresh testimonials every hour
        setInterval(() => {
            console.log('🔄 Auto-refreshing testimonials...');
            this.loadTestimonials();
        }, 3600000);
        
        // Refresh settings every 10 minutes
        setInterval(() => {
            console.log('🔄 Auto-refreshing settings...');
            this.loadSettings();
        }, 600000);
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