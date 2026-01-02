// East Africom Urgency & Scarcity Module
// Features: Limited-time offers, seasonal pricing, inventory countdown, order deadlines

class UrgencyScarcity {
    constructor() {
        this.harvestSeason = {
            coffee: {
                start: new Date('2025-10-01'),
                end: new Date('2025-12-31'),
                discount: 15 // 15% harvest season discount
            },
            cocoa: {
                start: new Date('2025-09-01'), 
                end: new Date('2025-11-30'),
                discount: 12 // 12% harvest season discount
            }
        };
        
        this.limitedOffers = {
            'november-special': {
                title: 'November Export Special',
                description: 'First 50 containers get FREE quality certification',
                remaining: 23, // containers remaining
                total: 50,
                validUntil: new Date('2025-11-30'),
                benefits: ['Free quality certification', 'Priority shipping', '2% additional discount']
            },
            'year-end-bulk': {
                title: 'Year-End Bulk Pricing',
                description: 'Order 100+ MT and save up to 20%',
                remaining: 1250, // MT remaining
                total: 2000,
                validUntil: new Date('2025-12-20'),
                benefits: ['Up to 20% bulk discount', 'Free storage until Jan', 'Flexible payment terms']
            }
        };
        
        this.marketPressure = {
            priceIncreaseDate: new Date('2025-12-01'),
            increasePercentage: 8,
            lastUpdate: new Date(),
            nextPriceReview: new Date('2025-11-25')
        };
        
        // Ensure DOM is ready before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        // Disabled urgency banner - clean professional layout
        // this.createUrgencyBanner();
        this.addProductUrgencyElements();
        this.createSeasonalPricingDisplay();
        this.setupCountdownTimers();
        this.addInventoryIndicators();
        // this.createFloatingUrgencyReminder();
        this.trackUserBehavior();
    }
    
    // Urgency Banner at top of page
    createUrgencyBanner() {
        const banner = document.createElement('div');
        banner.className = 'urgency-banner';
        banner.id = 'urgencyBanner';
        
        const currentOffer = this.getCurrentBestOffer();
        
        banner.innerHTML = `
            <div class="urgency-content">
                <div class="urgency-icon">⚡</div>
                <div class="urgency-message">
                    <span class="urgency-title">${currentOffer.title}</span>
                    <span class="urgency-detail">${currentOffer.description}</span>
                </div>
                <div class="urgency-countdown" id="bannerCountdown">
                    <div class="countdown-unit">
                        <span class="countdown-number" id="days">00</span>
                        <span class="countdown-label">Days</span>
                    </div>
                    <div class="countdown-unit">
                        <span class="countdown-number" id="hours">00</span>
                        <span class="countdown-label">Hours</span>
                    </div>
                    <div class="countdown-unit">
                        <span class="countdown-number" id="minutes">00</span>
                        <span class="countdown-label">Minutes</span>
                    </div>
                </div>
                <div class="urgency-cta">
                    <button class="urgency-btn" onclick="urgencySystem.claimOffer()">
                        🔥 Claim Now
                    </button>
                </div>
                <button class="banner-close" onclick="urgencySystem.closeBanner()">×</button>
            </div>
        `;
        
        // Insert at top of page
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Add class to body for styling adjustments
        document.body.classList.add('urgency-banner-active');
        
        // Start countdown
        this.startCountdown('bannerCountdown', currentOffer.validUntil);
    }
    
    // Add urgency elements to product cards
    addProductUrgencyElements() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            const productName = card.querySelector('.product-name').textContent;
            const urgencyInfo = this.getProductUrgency(productName);
            
            // Add urgency badge
            const urgencyBadge = document.createElement('div');
            urgencyBadge.className = 'urgency-badge';
            urgencyBadge.innerHTML = urgencyInfo.badge;
            
            // Add to product image
            const productImage = card.querySelector('.product-image');
            productImage.appendChild(urgencyBadge);
            
            // Add inventory indicator
            const inventoryIndicator = document.createElement('div');
            inventoryIndicator.className = 'inventory-indicator';
            inventoryIndicator.innerHTML = `
                <div class="inventory-bar">
                    <div class="inventory-fill" style="width: ${urgencyInfo.stockLevel}%"></div>
                </div>
                <div class="inventory-text">
                    <span class="stock-status ${urgencyInfo.stockLevel < 30 ? 'low-stock' : 'in-stock'}">
                        ${urgencyInfo.stockText}
                    </span>
                    <span class="stock-detail">${urgencyInfo.stockDetail}</span>
                </div>
            `;
            
            // Add before order button
            const orderSection = card.querySelector('.product-order-section');
            orderSection.insertBefore(inventoryIndicator, orderSection.firstChild);
            
            // Add pricing urgency
            const pricingInfo = card.querySelector('.product-pricing');
            if (urgencyInfo.seasonalDiscount) {
                const seasonalPrice = document.createElement('div');
                seasonalPrice.className = 'seasonal-pricing';
                seasonalPrice.innerHTML = `
                    <div class="original-price">
                        Original: <span class="strikethrough">${urgencyInfo.originalPrice}</span>
                    </div>
                    <div class="seasonal-discount">
                        🍂 Harvest Season: <span class="discount-amount">-${urgencyInfo.seasonalDiscount}%</span>
                    </div>
                    <div class="seasonal-note">Valid until ${urgencyInfo.seasonEndDate}</div>
                `;
                pricingInfo.appendChild(seasonalPrice);
            }
        });
    }
    
    // Seasonal pricing display
    createSeasonalPricingDisplay() {
        const hero = document.querySelector('.hero-content');
        const currentSeason = this.getCurrentSeason();
        
        if (currentSeason) {
            const seasonalDisplay = document.createElement('div');
            seasonalDisplay.className = 'seasonal-pricing-banner';
            seasonalDisplay.innerHTML = `
                <div class="seasonal-content">
                    <div class="seasonal-icon">🍂</div>
                    <div class="seasonal-info">
                        <h3>${currentSeason.title}</h3>
                        <p>${currentSeason.description}</p>
                        <div class="seasonal-savings">
                            Save up to <span class="savings-amount">${currentSeason.maxDiscount}%</span> 
                            on fresh harvest
                        </div>
                    </div>
                    <div class="seasonal-countdown">
                        <div class="countdown-label">Season ends in:</div>
                        <div class="season-countdown" id="seasonCountdown"></div>
                    </div>
                </div>
            `;
            
            // Add after pricing display
            const pricingDisplay = hero.querySelector('.pricing-display');
            pricingDisplay.parentNode.insertBefore(seasonalDisplay, pricingDisplay.nextSibling);
            
            this.startCountdown('seasonCountdown', currentSeason.endDate, true);
        }
    }
    
    // Countdown timer functionality
    startCountdown(elementId, endDate, compact = false) {
        const countdownElement = document.getElementById(elementId);
        if (!countdownElement) return;
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;
            
            if (distance < 0) {
                countdownElement.innerHTML = compact ? "EXPIRED" : "Offer Expired";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            if (compact) {
                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m`;
            } else {
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }
    
    // Inventory indicators
    addInventoryIndicators() {
        // Add to hero section
        const heroStats = document.querySelector('.hero-stats');
        const inventoryStats = document.createElement('div');
        inventoryStats.className = 'inventory-stats';
        inventoryStats.innerHTML = `
            <div class="stat-item urgent">
                <span class="stat-number">23</span>
                <span class="stat-label">Containers Available This Month</span>
                <div class="urgency-pulse"></div>
            </div>
        `;
        heroStats.appendChild(inventoryStats);
        
        // Add market pressure indicator
        const marketPressure = document.createElement('div');
        marketPressure.className = 'market-pressure-alert';
        marketPressure.innerHTML = `
            <div class="pressure-content">
                <div class="pressure-icon">📈</div>
                <div class="pressure-text">
                    <strong>Market Alert:</strong> Prices increasing ${this.marketPressure.increasePercentage}% on 
                    ${this.formatDate(this.marketPressure.priceIncreaseDate)}
                </div>
                <div class="pressure-countdown" id="priceIncreaseCountdown"></div>
            </div>
        `;
        
        // Add after hero section
        const hero = document.querySelector('.hero');
        hero.parentNode.insertBefore(marketPressure, hero.nextSibling);
        
        this.startCountdown('priceIncreaseCountdown', this.marketPressure.priceIncreaseDate, true);
    }
    
    // Floating urgency reminder
    createFloatingUrgencyReminder() {
        const reminder = document.createElement('div');
        reminder.className = 'floating-urgency';
        reminder.id = 'floatingUrgency';
        reminder.style.display = 'none';
        
        reminder.innerHTML = `
            <div class="floating-content">
                <div class="floating-icon">⏰</div>
                <div class="floating-text">
                    <div class="floating-title">Don't Miss Out!</div>
                    <div class="floating-message">Limited harvest season pricing ends soon</div>
                </div>
                <button class="floating-cta" onclick="urgencySystem.scrollToProducts()">
                    View Offers
                </button>
                <button class="floating-close" onclick="urgencySystem.closeFloatingReminder()">×</button>
            </div>
        `;
        
        document.body.appendChild(reminder);
        
        // Show after 30 seconds if user hasn't taken action
        setTimeout(() => {
            if (!localStorage.getItem('urgencyShown')) {
                this.showFloatingReminder();
            }
        }, 30000);
    }
    
    // User behavior tracking for urgency triggers
    trackUserBehavior() {
        let scrollDepth = 0;
        let timeOnPage = 0;
        let hasInteracted = false;
        
        // Track scroll depth
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollDepth = Math.max(scrollDepth, (winScroll / height) * 100);
            
            // Show exit-intent style urgency at 70% scroll
            if (scrollDepth > 70 && !hasInteracted) {
                this.triggerScrollUrgency();
            }
        });
        
        // Track time on page
        setInterval(() => {
            timeOnPage += 1;
            
            // Show urgency after 2 minutes without interaction
            if (timeOnPage === 120 && !hasInteracted) {
                this.triggerTimeUrgency();
            }
        }, 1000);
        
        // Track interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .order-btn, .quick-contact-btn, .chat-trigger')) {
                hasInteracted = true;
            }
        });
    }
    
    // Get current best offer
    getCurrentBestOffer() {
        const currentDate = new Date();
        
        // Check for active limited offers
        for (const [key, offer] of Object.entries(this.limitedOffers)) {
            if (currentDate < offer.validUntil && offer.remaining > 0) {
                return offer;
            }
        }
        
        // Check for seasonal offers
        const season = this.getCurrentSeason();
        if (season) {
            return {
                title: season.title,
                description: season.description,
                validUntil: season.endDate
            };
        }
        
        // Default urgent offer
        return {
            title: 'Limited Time Export Pricing',
            description: 'Lock in current prices before market increase',
            validUntil: this.marketPressure.priceIncreaseDate
        };
    }
    
    // Get product-specific urgency info
    getProductUrgency(productName) {
        const random = Math.floor(Math.random() * 100);
        
        if (productName.includes('Arabica AA')) {
            return {
                badge: '🔥 High Demand',
                stockLevel: 25,
                stockText: 'Low Stock',
                stockDetail: 'Only 3 containers left',
                seasonalDiscount: this.isHarvestSeason('coffee') ? this.harvestSeason.coffee.discount : null,
                originalPrice: '$6.20/kg',
                seasonEndDate: this.formatDate(this.harvestSeason.coffee.end)
            };
        } else if (productName.includes('Specialty Microlot')) {
            return {
                badge: '⭐ Exclusive',
                stockLevel: 15,
                stockText: 'Very Limited',
                stockDetail: 'Single farm lot',
                seasonalDiscount: null,
                originalPrice: '$12.00/kg'
            };
        } else if (productName.includes('Robusta')) {
            return {
                badge: '📈 Price Rising',
                stockLevel: 60,
                stockText: 'Available',
                stockDetail: '12 containers ready',
                seasonalDiscount: this.isHarvestSeason('coffee') ? this.harvestSeason.coffee.discount : null,
                originalPrice: '$4.20/kg',
                seasonEndDate: this.formatDate(this.harvestSeason.coffee.end)
            };
        } else if (productName.includes('Cocoa')) {
            return {
                badge: '🍂 Harvest Fresh',
                stockLevel: 40,
                stockText: 'Fresh Stock',
                stockDetail: 'October harvest',
                seasonalDiscount: this.isHarvestSeason('cocoa') ? this.harvestSeason.cocoa.discount : null,
                originalPrice: productName.includes('Powder') ? '$5.80/kg' : '$3.50/kg',
                seasonEndDate: this.formatDate(this.harvestSeason.cocoa.end)
            };
        }
        
        return {
            badge: '✅ Available',
            stockLevel: 70,
            stockText: 'In Stock',
            stockDetail: 'Ready to ship',
            seasonalDiscount: null
        };
    }
    
    // Check if currently in harvest season
    isHarvestSeason(crop) {
        const now = new Date();
        const season = this.harvestSeason[crop];
        return now >= season.start && now <= season.end;
    }
    
    // Get current season info
    getCurrentSeason() {
        const now = new Date();
        
        if (this.isHarvestSeason('coffee')) {
            return {
                title: '🍂 Coffee Harvest Season',
                description: 'Fresh premium beans direct from farm',
                maxDiscount: this.harvestSeason.coffee.discount,
                endDate: this.harvestSeason.coffee.end
            };
        }
        
        if (this.isHarvestSeason('cocoa')) {
            return {
                title: '🍫 Cocoa Harvest Season', 
                description: 'Premium fresh cocoa beans available',
                maxDiscount: this.harvestSeason.cocoa.discount,
                endDate: this.harvestSeason.cocoa.end
            };
        }
        
        return null;
    }
    
    // Action handlers
    claimOffer() {
        // Track offer claim
        this.logEvent('offer_claimed', { offer: this.getCurrentBestOffer().title });
        
        // Scroll to contact form with urgency message
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        
        // Add urgency message to contact form
        this.addUrgencyToForm();
    }
    
    scrollToProducts() {
        document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
        this.closeFloatingReminder();
    }
    
    closeBanner() {
        const banner = document.getElementById('urgencyBanner');
        if (banner) {
            banner.style.display = 'none';
        }
        // Remove body class when banner is closed
        document.body.classList.remove('urgency-banner-active');
        localStorage.setItem('bannerClosed', Date.now());
    }
    
    showFloatingReminder() {
        document.getElementById('floatingUrgency').style.display = 'block';
        localStorage.setItem('urgencyShown', 'true');
    }
    
    closeFloatingReminder() {
        document.getElementById('floatingUrgency').style.display = 'none';
    }
    
    triggerScrollUrgency() {
        // Show special scroll-based urgency
        const scrollUrgency = document.createElement('div');
        scrollUrgency.className = 'scroll-urgency';
        scrollUrgency.innerHTML = `
            <div class="scroll-urgency-content">
                <div class="urgency-pulse-icon">⚡</div>
                <div class="scroll-message">
                    Still deciding? Secure today's pricing before it changes!
                </div>
                <button onclick="urgencySystem.claimOffer()" class="scroll-urgency-btn">
                    Lock In Price
                </button>
            </div>
        `;
        
        document.body.appendChild(scrollUrgency);
        
        setTimeout(() => {
            scrollUrgency.remove();
        }, 8000);
    }
    
    triggerTimeUrgency() {
        // Show time-based urgency notification
        if (window.instantComm) {
            window.instantComm.showChatNotification();
        }
    }
    
    addUrgencyToForm() {
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            const urgencyNote = document.createElement('div');
            urgencyNote.className = 'form-urgency-note';
            urgencyNote.innerHTML = `
                <div class="urgency-form-message">
                    🔥 <strong>Special Offer Applied:</strong> Mention "HARVEST2025" for seasonal pricing
                </div>
            `;
            
            contactForm.insertBefore(urgencyNote, contactForm.firstChild);
        }
    }
    
    // Utility functions
    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    logEvent(eventType, data = {}) {
        // Analytics integration
        if (typeof gtag !== 'undefined') {
            gtag('event', eventType, {
                'event_category': 'Urgency',
                'event_label': eventType,
                ...data
            });
        }
    }
}

// Advanced urgency features
class AdvancedUrgency extends UrgencyScarcity {
    constructor() {
        super();
        this.setupAdvancedFeatures();
    }
    
    setupAdvancedFeatures() {
        this.createStockTicker();
        this.setupPriceFluctuationAlerts();
        this.createSocialProofUrgency();
        this.setupAbandonmentTriggers();
    }
    
    // Live stock ticker
    createStockTicker() {
        const ticker = document.createElement('div');
        ticker.className = 'stock-ticker';
        ticker.innerHTML = `
            <div class="ticker-content">
                <span class="ticker-item">📦 Container #A1234 - Arabica AA - SOLD to Germany</span>
                <span class="ticker-item">🚢 15 containers shipped to Netherlands this week</span>
                <span class="ticker-item">⚡ 8 quotes requested in last hour</span>
                <span class="ticker-item">🔥 Cocoa powder - Only 5 MT remaining this month</span>
                <span class="ticker-item">📈 Coffee prices up 3% this week due to high demand</span>
            </div>
        `;
        
        // Add after navigation
        const nav = document.querySelector('.navbar');
        nav.parentNode.insertBefore(ticker, nav.nextSibling);
    }
    
    // Price fluctuation alerts
    setupPriceFluctuationAlerts() {
        // Simulate real-time price changes
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every minute
                this.showPriceAlert();
            }
        }, 60000);
    }
    
    showPriceAlert() {
        const alert = document.createElement('div');
        alert.className = 'price-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">📈</div>
                <div class="alert-text">
                    <strong>Price Update:</strong> Arabica AA increased $0.15/kg due to high demand
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="alert-close">×</button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 8000);
    }
    
    // Social proof urgency
    createSocialProofUrgency() {
        const socialProof = document.createElement('div');
        socialProof.className = 'social-urgency';
        socialProof.innerHTML = `
            <div class="social-content">
                <div class="viewer-count">
                    <span class="viewer-number" id="viewerCount">47</span>
                    <span class="viewer-text">buyers viewing this page</span>
                </div>
                <div class="recent-activity">
                    <div class="activity-item">
                        <span class="activity-location">🇩🇪 Germany</span>
                        <span class="activity-action">ordered 2 containers</span>
                        <span class="activity-time">3 minutes ago</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add to hero section
        const heroContent = document.querySelector('.hero-content .container');
        heroContent.appendChild(socialProof);
        
        // Animate viewer count
        this.animateViewerCount();
    }
    
    animateViewerCount() {
        const viewerElement = document.getElementById('viewerCount');
        if (!viewerElement) return;
        
        setInterval(() => {
            const currentCount = parseInt(viewerElement.textContent);
            const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
            const newCount = Math.max(35, Math.min(85, currentCount + change));
            viewerElement.textContent = newCount;
        }, 15000);
    }
    
    // Abandonment triggers
    setupAbandonmentTriggers() {
        let isLeaving = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !isLeaving) {
                isLeaving = true;
                this.showExitIntentUrgency();
            }
        });
        
        document.addEventListener('mouseenter', () => {
            isLeaving = false;
        });
    }
    
    showExitIntentUrgency() {
        const exitModal = document.createElement('div');
        exitModal.className = 'exit-intent-modal';
        exitModal.innerHTML = `
            <div class="exit-modal-overlay"></div>
            <div class="exit-modal-content">
                <div class="exit-header">
                    <h2>⚡ Wait! Don't Miss Out</h2>
                    <button onclick="this.parentElement.parentElement.remove()" class="exit-close">×</button>
                </div>
                <div class="exit-body">
                    <p>Before you go, secure your premium coffee supply at harvest season prices!</p>
                    <div class="exit-offer">
                        <div class="offer-highlight">🔥 EXCLUSIVE: 15% OFF first order</div>
                        <div class="offer-details">Valid for next 10 minutes only</div>
                    </div>
                    <div class="exit-countdown" id="exitCountdown">10:00</div>
                </div>
                <div class="exit-actions">
                    <button onclick="urgencySystem.claimExitOffer()" class="exit-claim-btn">
                        Claim 15% Discount
                    </button>
                    <button onclick="this.parentElement.parentElement.remove()" class="exit-decline-btn">
                        No thanks, I'll pay full price
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(exitModal);
        
        // Start 10-minute countdown
        this.startExitCountdown();
    }
    
    startExitCountdown() {
        let timeLeft = 600; // 10 minutes in seconds
        const countdownElement = document.getElementById('exitCountdown');
        
        const countdown = setInterval(() => {
            timeLeft--;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                document.querySelector('.exit-intent-modal')?.remove();
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    claimExitOffer() {
        this.logEvent('exit_offer_claimed');
        
        // Add discount code to form
        const messageField = document.querySelector('#message');
        if (messageField) {
            messageField.value = 'URGENT REQUEST: Please apply 15% exit discount code HARVEST15 to my order. ';
        }
        
        // Close modal and scroll to contact
        document.querySelector('.exit-intent-modal').remove();
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    }
}

// Global initialization - Execute immediately

// Create urgency banner immediately when script loads
function createUrgencyBannerNow() {
    
    // Remove any existing banner
    const existingBanner = document.getElementById('urgencyBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    const banner = document.createElement('div');
    banner.className = 'urgency-banner';
    banner.id = 'urgencyBanner';
    banner.style.cssText = `
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 15px 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 9999;
        display: block;
        visibility: visible;
    `;
    
    banner.innerHTML = `
        <div class="urgency-content" style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; gap: 15px;">
            <div class="urgency-icon" style="font-size: 24px;">⚡</div>
            <div class="urgency-message" style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
                <span class="urgency-title" style="font-weight: 700; font-size: 16px;">November Export Special</span>
                <span class="urgency-detail" style="font-size: 13px; opacity: 0.9;">First 50 containers get FREE quality certification</span>
            </div>
            <div class="urgency-countdown" style="display: flex; gap: 15px;">
                <div style="text-align: center; min-width: 50px;">
                    <span style="display: block; font-size: 18px; font-weight: bold;">29</span>
                    <span style="font-size: 10px; text-transform: uppercase;">Days</span>
                </div>
                <div style="text-align: center; min-width: 50px;">
                    <span style="display: block; font-size: 18px; font-weight: bold;">19</span>
                    <span style="font-size: 10px; text-transform: uppercase;">Hours</span>
                </div>
                <div style="text-align: center; min-width: 50px;">
                    <span style="display: block; font-size: 18px; font-weight: bold;">01</span>
                    <span style="font-size: 10px; text-transform: uppercase;">Min</span>
                </div>
            </div>
            <div class="urgency-cta">
                <button style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
                    🔥 Claim Now
                </button>
            </div>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; opacity: 0.8;">×</button>
        </div>
    `;
    
    // Insert at top of page
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Add body padding
    document.body.style.paddingTop = '80px';
}

// Urgency banner disabled for clean professional layout
// Execute immediately if DOM is ready, otherwise wait
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', createUrgencyBannerNow);
// } else {
//     createUrgencyBannerNow();
// }

// window.urgencySystem = new UrgencyScarcity();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UrgencyScarcity;
}