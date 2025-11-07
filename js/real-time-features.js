// Real-time Information Features Module
// Implements live inventory tracking, shipping updates, and market prices

class RealTimeFeatures {
    constructor() {
        this.inventory = {
            coffee: { available: 847, reserved: 123, containers: 15 },
            cocoa: { available: 623, reserved: 87, containers: 8 },
            lastUpdated: new Date()
        };
        this.marketPrices = {
            coffee: { current: 2.45, change: +0.08, trend: 'up' },
            cocoa: { current: 3.12, change: -0.05, trend: 'down' },
            lastUpdated: new Date()
        };
        this.shipments = [];
        this.updateInterval = 30000; // 30 seconds
        this.init();
    }

    init() {
        this.createInventoryWidget();
        this.createMarketPriceWidget();
        this.createShippingTracker();
        this.createAvailabilityBadges();
        this.startRealTimeUpdates();
        this.setupEventListeners();
    }

    createInventoryWidget() {
        const widget = document.createElement('div');
        widget.className = 'realtime-inventory-widget';
        widget.innerHTML = `
            <div class="inventory-header">
                <h3><i class="fas fa-warehouse"></i> Live Inventory</h3>
                <span class="last-updated">Updated: ${this.formatTime(this.inventory.lastUpdated)}</span>
            </div>
            <div class="inventory-grid">
                <div class="inventory-item coffee">
                    <div class="product-name">
                        <i class="fas fa-coffee"></i>
                        <span>Coffee Beans</span>
                    </div>
                    <div class="inventory-stats">
                        <div class="stat">
                            <span class="value">${this.inventory.coffee.available}</span>
                            <span class="label">Tons Available</span>
                        </div>
                        <div class="stat">
                            <span class="value">${this.inventory.coffee.containers}</span>
                            <span class="label">Containers Ready</span>
                        </div>
                        <div class="availability-bar">
                            <div class="bar-fill coffee-fill" style="width: ${this.getAvailabilityPercentage('coffee')}%"></div>
                        </div>
                    </div>
                </div>
                <div class="inventory-item cocoa">
                    <div class="product-name">
                        <i class="fas fa-seedling"></i>
                        <span>Cocoa Beans</span>
                    </div>
                    <div class="inventory-stats">
                        <div class="stat">
                            <span class="value">${this.inventory.cocoa.available}</span>
                            <span class="label">Tons Available</span>
                        </div>
                        <div class="stat">
                            <span class="value">${this.inventory.cocoa.containers}</span>
                            <span class="label">Containers Ready</span>
                        </div>
                        <div class="availability-bar">
                            <div class="bar-fill cocoa-fill" style="width: ${this.getAvailabilityPercentage('cocoa')}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="inventory-alerts">
                <div class="alert urgent">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>High demand detected - Coffee inventory moving fast!</span>
                </div>
            </div>
        `;

        this.addWidgetStyles();
        document.querySelector('.hero-section')?.after(widget);
    }

    createMarketPriceWidget() {
        const widget = document.createElement('div');
        widget.className = 'realtime-market-widget';
        widget.innerHTML = `
            <div class="market-header">
                <h3><i class="fas fa-chart-line"></i> Live Market Prices</h3>
                <span class="market-time">Last updated: ${this.formatTime(this.marketPrices.lastUpdated)}</span>
            </div>
            <div class="price-grid">
                <div class="price-card coffee-price">
                    <div class="price-header">
                        <i class="fas fa-coffee"></i>
                        <span>Coffee (USD/kg)</span>
                    </div>
                    <div class="price-display">
                        <span class="current-price">$${this.marketPrices.coffee.current.toFixed(2)}</span>
                        <span class="price-change ${this.marketPrices.coffee.trend}">
                            <i class="fas fa-arrow-${this.marketPrices.coffee.trend === 'up' ? 'up' : 'down'}"></i>
                            ${this.marketPrices.coffee.change > 0 ? '+' : ''}${this.marketPrices.coffee.change.toFixed(2)}
                        </span>
                    </div>
                    <div class="price-chart">
                        <canvas id="coffee-chart" width="200" height="60"></canvas>
                    </div>
                </div>
                <div class="price-card cocoa-price">
                    <div class="price-header">
                        <i class="fas fa-seedling"></i>
                        <span>Cocoa (USD/kg)</span>
                    </div>
                    <div class="price-display">
                        <span class="current-price">$${this.marketPrices.cocoa.current.toFixed(2)}</span>
                        <span class="price-change ${this.marketPrices.cocoa.trend}">
                            <i class="fas fa-arrow-${this.marketPrices.cocoa.trend === 'up' ? 'up' : 'down'}"></i>
                            ${this.marketPrices.cocoa.change > 0 ? '+' : ''}${this.marketPrices.cocoa.change.toFixed(2)}
                        </span>
                    </div>
                    <div class="price-chart">
                        <canvas id="cocoa-chart" width="200" height="60"></canvas>
                    </div>
                </div>
            </div>
            <div class="market-insights">
                <div class="insight">
                    <i class="fas fa-lightbulb"></i>
                    <span>Optimal buying window: Coffee prices trending upward - Lock in your order now!</span>
                </div>
            </div>
        `;

        document.querySelector('.realtime-inventory-widget')?.after(widget);
        this.drawPriceCharts();
    }

    createShippingTracker() {
        // Generate sample shipments
        this.shipments = [
            {
                id: 'EA2024-1847',
                client: 'Swiss Premium Coffee Ltd.',
                product: 'Arabica Coffee',
                quantity: '45 tons',
                status: 'In Transit',
                location: 'Port of Mombasa',
                eta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                progress: 65
            },
            {
                id: 'EA2024-1822',
                client: 'German Chocolate Co.',
                product: 'Premium Cocoa',
                quantity: '32 tons',
                status: 'Customs Cleared',
                location: 'Hamburg Port',
                eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                progress: 85
            },
            {
                id: 'EA2024-1863',
                client: 'Nordic Foods AS',
                product: 'Robusta Coffee',
                quantity: '28 tons',
                status: 'Loading',
                location: 'Kampala Warehouse',
                eta: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                progress: 25
            }
        ];

        const tracker = document.createElement('div');
        tracker.className = 'shipping-tracker';
        tracker.innerHTML = `
            <div class="tracker-header">
                <h3><i class="fas fa-ship"></i> Live Shipping Tracker</h3>
                <button class="track-shipment-btn" onclick="realTimeFeatures.showTrackingModal()">
                    <i class="fas fa-search"></i> Track Your Shipment
                </button>
            </div>
            <div class="shipments-grid">
                ${this.shipments.map(shipment => `
                    <div class="shipment-card" data-shipment="${shipment.id}">
                        <div class="shipment-header">
                            <span class="shipment-id">#${shipment.id}</span>
                            <span class="shipment-status status-${shipment.status.toLowerCase().replace(' ', '-')}">
                                ${shipment.status}
                            </span>
                        </div>
                        <div class="shipment-details">
                            <div class="detail">
                                <i class="fas fa-user"></i>
                                <span>${shipment.client}</span>
                            </div>
                            <div class="detail">
                                <i class="fas fa-box"></i>
                                <span>${shipment.product} - ${shipment.quantity}</span>
                            </div>
                            <div class="detail">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${shipment.location}</span>
                            </div>
                            <div class="detail">
                                <i class="fas fa-calendar"></i>
                                <span>ETA: ${shipment.eta.toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="shipment-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${shipment.progress}%"></div>
                            </div>
                            <span class="progress-text">${shipment.progress}% Complete</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelector('.realtime-market-widget')?.after(tracker);
    }

    createAvailabilityBadges() {
        // Add live availability badges to product cards
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            const productName = card.querySelector('h3, .product-title')?.textContent.toLowerCase();
            if (productName?.includes('coffee') || productName?.includes('cocoa')) {
                const type = productName.includes('coffee') ? 'coffee' : 'cocoa';
                const available = this.inventory[type].available;
                
                const badge = document.createElement('div');
                badge.className = 'availability-badge';
                badge.innerHTML = `
                    <div class="live-indicator">
                        <span class="pulse-dot"></span>
                        <span>LIVE</span>
                    </div>
                    <div class="stock-info">
                        <span class="stock-amount">${available} tons</span>
                        <span class="stock-label">In Stock</span>
                    </div>
                `;
                
                card.style.position = 'relative';
                card.appendChild(badge);
            }
        });
    }

    showTrackingModal() {
        const modal = document.createElement('div');
        modal.className = 'tracking-modal-overlay';
        modal.innerHTML = `
            <div class="tracking-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-search"></i> Track Your Shipment</h3>
                    <button class="close-modal" onclick="this.closest('.tracking-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="tracking-form">
                        <input type="text" placeholder="Enter your tracking number (e.g., EA2024-1847)" 
                               class="tracking-input" id="trackingInput">
                        <button class="track-btn" onclick="realTimeFeatures.performTracking()">
                            <i class="fas fa-search"></i> Track
                        </button>
                    </div>
                    <div class="quick-track">
                        <h4>Recent Shipments:</h4>
                        <div class="quick-track-buttons">
                            ${this.shipments.map(shipment => `
                                <button class="quick-track-btn" onclick="realTimeFeatures.quickTrack('${shipment.id}')">
                                    ${shipment.id}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="tracking-result" id="trackingResult"></div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    performTracking() {
        const input = document.getElementById('trackingInput').value.trim();
        const result = document.getElementById('trackingResult');
        
        const shipment = this.shipments.find(s => s.id === input);
        
        if (shipment) {
            result.innerHTML = this.generateTrackingResult(shipment);
        } else {
            result.innerHTML = `
                <div class="tracking-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <h4>Shipment not found</h4>
                    <p>Please check your tracking number or contact our support team.</p>
                    <button class="contact-support-btn" onclick="realTimeFeatures.contactSupport()">
                        <i class="fas fa-phone"></i> Contact Support
                    </button>
                </div>
            `;
        }
    }

    quickTrack(shipmentId) {
        document.getElementById('trackingInput').value = shipmentId;
        this.performTracking();
    }

    generateTrackingResult(shipment) {
        const timeline = this.generateShippingTimeline(shipment);
        
        return `
            <div class="tracking-success">
                <div class="shipment-overview">
                    <h4><i class="fas fa-box"></i> Shipment #${shipment.id}</h4>
                    <div class="overview-grid">
                        <div class="overview-item">
                            <span class="label">Status:</span>
                            <span class="value status-${shipment.status.toLowerCase().replace(' ', '-')}">${shipment.status}</span>
                        </div>
                        <div class="overview-item">
                            <span class="label">Current Location:</span>
                            <span class="value">${shipment.location}</span>
                        </div>
                        <div class="overview-item">
                            <span class="label">Expected Delivery:</span>
                            <span class="value">${shipment.eta.toLocaleDateString()}</span>
                        </div>
                        <div class="overview-item">
                            <span class="label">Progress:</span>
                            <span class="value">${shipment.progress}% Complete</span>
                        </div>
                    </div>
                </div>
                <div class="shipping-timeline">
                    <h5>Shipping Timeline</h5>
                    ${timeline}
                </div>
                <div class="tracking-actions">
                    <button class="action-btn" onclick="realTimeFeatures.subscribeToUpdates('${shipment.id}')">
                        <i class="fas fa-bell"></i> Subscribe to Updates
                    </button>
                    <button class="action-btn" onclick="realTimeFeatures.downloadTrackingReport('${shipment.id}')">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                </div>
            </div>
        `;
    }

    generateShippingTimeline(shipment) {
        const stages = [
            { name: 'Order Confirmed', status: 'completed', date: '2024-10-15' },
            { name: 'Processing', status: 'completed', date: '2024-10-18' },
            { name: 'Quality Check', status: 'completed', date: '2024-10-20' },
            { name: 'Packed & Loaded', status: 'completed', date: '2024-10-23' },
            { name: 'In Transit', status: shipment.progress >= 50 ? 'completed' : 'current', date: '2024-10-25' },
            { name: 'Customs Clearance', status: shipment.progress >= 80 ? 'completed' : 'pending', date: '2024-10-30' },
            { name: 'Final Delivery', status: shipment.progress >= 100 ? 'completed' : 'pending', date: shipment.eta.toISOString().split('T')[0] }
        ];

        return stages.map(stage => `
            <div class="timeline-item ${stage.status}">
                <div class="timeline-marker">
                    <i class="fas fa-${stage.status === 'completed' ? 'check' : stage.status === 'current' ? 'clock' : 'circle'}"></i>
                </div>
                <div class="timeline-content">
                    <h6>${stage.name}</h6>
                    <span class="timeline-date">${stage.date}</span>
                </div>
            </div>
        `).join('');
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.simulateInventoryUpdate();
            this.simulateMarketUpdate();
            this.updateTimestamps();
        }, this.updateInterval);

        // Immediate visual updates every 5 seconds
        setInterval(() => {
            this.updateLiveIndicators();
        }, 5000);
    }

    simulateInventoryUpdate() {
        // Simulate realistic inventory changes
        const coffeeChange = Math.floor(Math.random() * 20) - 10; // -10 to +10
        const cocoaChange = Math.floor(Math.random() * 15) - 7; // -7 to +8
        
        this.inventory.coffee.available = Math.max(0, this.inventory.coffee.available + coffeeChange);
        this.inventory.cocoa.available = Math.max(0, this.inventory.cocoa.available + cocoaChange);
        this.inventory.lastUpdated = new Date();

        this.updateInventoryDisplay();
    }

    simulateMarketUpdate() {
        // Simulate market price fluctuations
        const coffeeChange = (Math.random() - 0.5) * 0.20; // -0.10 to +0.10
        const cocoaChange = (Math.random() - 0.5) * 0.15; // -0.075 to +0.075
        
        this.marketPrices.coffee.current += coffeeChange;
        this.marketPrices.coffee.change = coffeeChange;
        this.marketPrices.coffee.trend = coffeeChange > 0 ? 'up' : 'down';
        
        this.marketPrices.cocoa.current += cocoaChange;
        this.marketPrices.cocoa.change = cocoaChange;
        this.marketPrices.cocoa.trend = cocoaChange > 0 ? 'up' : 'down';
        
        this.marketPrices.lastUpdated = new Date();

        this.updateMarketDisplay();
    }

    updateInventoryDisplay() {
        const widget = document.querySelector('.realtime-inventory-widget');
        if (widget) {
            // Update coffee inventory
            const coffeeStats = widget.querySelector('.inventory-item.coffee .inventory-stats');
            coffeeStats.querySelector('.stat .value').textContent = this.inventory.coffee.available;
            
            // Update cocoa inventory
            const cocoaStats = widget.querySelector('.inventory-item.cocoa .inventory-stats');
            cocoaStats.querySelector('.stat .value').textContent = this.inventory.cocoa.available;
            
            // Update availability bars
            widget.querySelector('.coffee-fill').style.width = `${this.getAvailabilityPercentage('coffee')}%`;
            widget.querySelector('.cocoa-fill').style.width = `${this.getAvailabilityPercentage('cocoa')}%`;
            
            // Update timestamp
            widget.querySelector('.last-updated').textContent = `Updated: ${this.formatTime(this.inventory.lastUpdated)}`;
        }

        // Update availability badges
        this.updateAvailabilityBadges();
    }

    updateMarketDisplay() {
        const widget = document.querySelector('.realtime-market-widget');
        if (widget) {
            // Update coffee price
            const coffeeCard = widget.querySelector('.price-card.coffee-price');
            coffeeCard.querySelector('.current-price').textContent = `$${this.marketPrices.coffee.current.toFixed(2)}`;
            const coffeeChange = coffeeCard.querySelector('.price-change');
            coffeeChange.className = `price-change ${this.marketPrices.coffee.trend}`;
            coffeeChange.innerHTML = `
                <i class="fas fa-arrow-${this.marketPrices.coffee.trend === 'up' ? 'up' : 'down'}"></i>
                ${this.marketPrices.coffee.change > 0 ? '+' : ''}${this.marketPrices.coffee.change.toFixed(2)}
            `;
            
            // Update cocoa price
            const cocoaCard = widget.querySelector('.price-card.cocoa-price');
            cocoaCard.querySelector('.current-price').textContent = `$${this.marketPrices.cocoa.current.toFixed(2)}`;
            const cocoaChange = cocoaCard.querySelector('.price-change');
            cocoaChange.className = `price-change ${this.marketPrices.cocoa.trend}`;
            cocoaChange.innerHTML = `
                <i class="fas fa-arrow-${this.marketPrices.cocoa.trend === 'up' ? 'up' : 'down'}"></i>
                ${this.marketPrices.cocoa.change > 0 ? '+' : ''}${this.marketPrices.cocoa.change.toFixed(2)}
            `;
            
            // Update timestamp
            widget.querySelector('.market-time').textContent = `Last updated: ${this.formatTime(this.marketPrices.lastUpdated)}`;
        }
    }

    updateAvailabilityBadges() {
        document.querySelectorAll('.availability-badge').forEach(badge => {
            const card = badge.closest('.product-card, .product-item');
            const productName = card?.querySelector('h3, .product-title')?.textContent.toLowerCase();
            
            if (productName?.includes('coffee')) {
                badge.querySelector('.stock-amount').textContent = `${this.inventory.coffee.available} tons`;
            } else if (productName?.includes('cocoa')) {
                badge.querySelector('.stock-amount').textContent = `${this.inventory.cocoa.available} tons`;
            }
        });
    }

    updateLiveIndicators() {
        document.querySelectorAll('.live-indicator .pulse-dot').forEach(dot => {
            dot.style.animation = 'none';
            setTimeout(() => {
                dot.style.animation = 'pulse 2s infinite';
            }, 10);
        });
    }

    updateTimestamps() {
        document.querySelectorAll('.last-updated, .market-time').forEach(timestamp => {
            const isInventory = timestamp.textContent.includes('Updated:');
            const time = isInventory ? this.inventory.lastUpdated : this.marketPrices.lastUpdated;
            const prefix = isInventory ? 'Updated: ' : 'Last updated: ';
            timestamp.textContent = prefix + this.formatTime(time);
        });
    }

    getAvailabilityPercentage(product) {
        const max = product === 'coffee' ? 1000 : 800; // Max capacity
        return Math.min(100, (this.inventory[product].available / max) * 100);
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }

    drawPriceCharts() {
        // Simple price trend visualization
        setTimeout(() => {
            ['coffee', 'cocoa'].forEach(product => {
                const canvas = document.getElementById(`${product}-chart`);
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    const width = canvas.width;
                    const height = canvas.height;
                    
                    // Generate sample price data
                    const points = 20;
                    const data = [];
                    let currentPrice = this.marketPrices[product].current;
                    
                    for (let i = 0; i < points; i++) {
                        currentPrice += (Math.random() - 0.5) * 0.1;
                        data.push(currentPrice);
                    }
                    
                    // Draw chart
                    ctx.clearRect(0, 0, width, height);
                    ctx.strokeStyle = product === 'coffee' ? '#8B4513' : '#D2691E';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    
                    const stepX = width / (points - 1);
                    const minPrice = Math.min(...data);
                    const maxPrice = Math.max(...data);
                    const priceRange = maxPrice - minPrice || 1;
                    
                    data.forEach((price, index) => {
                        const x = index * stepX;
                        const y = height - ((price - minPrice) / priceRange) * height;
                        
                        if (index === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    });
                    
                    ctx.stroke();
                }
            });
        }, 100);
    }

    subscribeToUpdates(shipmentId) {
        // Simulate subscription
        const modal = document.createElement('div');
        modal.className = 'subscription-modal-overlay';
        modal.innerHTML = `
            <div class="subscription-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-bell"></i> Subscription Confirmed</h3>
                    <button class="close-modal" onclick="this.closest('.subscription-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h4>You're all set!</h4>
                        <p>You'll receive real-time updates for shipment <strong>#${shipmentId}</strong> via:</p>
                        <ul>
                            <li><i class="fas fa-envelope"></i> Email notifications</li>
                            <li><i class="fas fa-sms"></i> SMS alerts</li>
                            <li><i class="fas fa-mobile-alt"></i> Push notifications</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
        }, 4000);
    }

    downloadTrackingReport(shipmentId) {
        // Simulate report download
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-download"></i>
                <span>Downloading tracking report for #${shipmentId}...</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.innerHTML = `
                <div class="notification-content success">
                    <i class="fas fa-check"></i>
                    <span>Report downloaded successfully!</span>
                </div>
            `;
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }, 2000);
    }

    contactSupport() {
        // Redirect to WhatsApp support
        window.open('https://wa.me/256776701003?text=Hi%20Frank,%20I%20need%20help%20tracking%20my%20shipment.', '_blank');
    }

    setupEventListeners() {
        // Click on inventory items for details
        document.addEventListener('click', (e) => {
            if (e.target.closest('.inventory-item')) {
                const item = e.target.closest('.inventory-item');
                const product = item.classList.contains('coffee') ? 'coffee' : 'cocoa';
                this.showInventoryDetails(product);
            }
        });

        // Click on shipment cards for details
        document.addEventListener('click', (e) => {
            if (e.target.closest('.shipment-card')) {
                const shipmentId = e.target.closest('.shipment-card').dataset.shipment;
                this.showShipmentDetails(shipmentId);
            }
        });
    }

    showInventoryDetails(product) {
        const data = this.inventory[product];
        const modal = document.createElement('div');
        modal.className = 'inventory-details-modal-overlay';
        modal.innerHTML = `
            <div class="inventory-details-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-${product === 'coffee' ? 'coffee' : 'seedling'}"></i> ${product.charAt(0).toUpperCase() + product.slice(1)} Inventory Details</h3>
                    <button class="close-modal" onclick="this.closest('.inventory-details-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="inventory-breakdown">
                        <div class="breakdown-item">
                            <h4>Available Stock</h4>
                            <div class="stock-details">
                                <div class="detail-row">
                                    <span>Total Available:</span>
                                    <span>${data.available} tons</span>
                                </div>
                                <div class="detail-row">
                                    <span>Reserved Orders:</span>
                                    <span>${data.reserved} tons</span>
                                </div>
                                <div class="detail-row">
                                    <span>Ready to Ship:</span>
                                    <span>${data.containers} containers</span>
                                </div>
                            </div>
                        </div>
                        <div class="breakdown-item">
                            <h4>Quality Grades Available</h4>
                            <div class="grades-list">
                                <div class="grade-item">
                                    <span class="grade">Premium Grade A</span>
                                    <span class="quantity">${Math.floor(data.available * 0.4)} tons</span>
                                </div>
                                <div class="grade-item">
                                    <span class="grade">Grade A</span>
                                    <span class="quantity">${Math.floor(data.available * 0.35)} tons</span>
                                </div>
                                <div class="grade-item">
                                    <span class="grade">Grade B</span>
                                    <span class="quantity">${Math.floor(data.available * 0.25)} tons</span>
                                </div>
                            </div>
                        </div>
                        <div class="inventory-actions">
                            <button class="action-btn primary" onclick="window.openCalculator?.()">
                                <i class="fas fa-calculator"></i> Calculate Price
                            </button>
                            <button class="action-btn" onclick="window.open('https://wa.me/256776701003?text=Hi%20Frank,%20I%27m%20interested%20in%20${product}%20inventory.', '_blank')">
                                <i class="fas fa-phone"></i> Reserve Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showShipmentDetails(shipmentId) {
        const shipment = this.shipments.find(s => s.id === shipmentId);
        if (!shipment) return;

        const modal = document.createElement('div');
        modal.className = 'shipment-details-modal-overlay';
        modal.innerHTML = `
            <div class="shipment-details-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-ship"></i> Shipment Details: #${shipment.id}</h3>
                    <button class="close-modal" onclick="this.closest('.shipment-details-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.generateTrackingResult(shipment)}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    addWidgetStyles() {
        if (document.getElementById('realtime-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'realtime-styles';
        styles.textContent = `
            /* Real-time Features Styles */
            .realtime-inventory-widget, .realtime-market-widget, .shipping-tracker {
                background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
                border-radius: 15px;
                padding: 30px;
                margin: 30px 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border: 1px solid #e9ecef;
            }

            .inventory-header, .market-header, .tracker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e9ecef;
            }

            .inventory-header h3, .market-header h3, .tracker-header h3 {
                color: #2c3e50;
                margin: 0;
                font-size: 1.4em;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .last-updated, .market-time {
                color: #6c757d;
                font-size: 0.9em;
                background: #e9ecef;
                padding: 5px 10px;
                border-radius: 15px;
            }

            .inventory-grid, .price-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 25px;
                margin-bottom: 20px;
            }

            .inventory-item, .price-card {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
            }

            .inventory-item:hover, .price-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                cursor: pointer;
            }

            .product-name, .price-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                font-weight: 600;
                color: #2c3e50;
            }

            .inventory-stats {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .stat {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .stat .value {
                font-size: 1.8em;
                font-weight: 700;
                color: #27ae60;
            }

            .stat .label {
                color: #6c757d;
                font-size: 0.9em;
            }

            .availability-bar {
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
            }

            .bar-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .coffee-fill {
                background: linear-gradient(90deg, #8B4513, #A0522D);
            }

            .cocoa-fill {
                background: linear-gradient(90deg, #D2691E, #CD853F);
            }

            .inventory-alerts {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
            }

            .alert {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #856404;
                font-weight: 500;
            }

            .price-display {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .current-price {
                font-size: 2em;
                font-weight: 700;
                color: #2c3e50;
            }

            .price-change {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 5px 10px;
                border-radius: 15px;
                font-weight: 600;
            }

            .price-change.up {
                background: #d4edda;
                color: #155724;
            }

            .price-change.down {
                background: #f8d7da;
                color: #721c24;
            }

            .price-chart {
                height: 60px;
                background: #f8f9fa;
                border-radius: 8px;
                padding: 5px;
            }

            .market-insights {
                background: #e1f5fe;
                border: 1px solid #81d4fa;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
            }

            .insight {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #01579b;
                font-weight: 500;
            }

            .shipments-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }

            .shipment-card {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .shipment-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }

            .shipment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .shipment-id {
                font-weight: 700;
                color: #2c3e50;
            }

            .shipment-status {
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 0.8em;
                font-weight: 600;
                text-transform: uppercase;
            }

            .status-in-transit {
                background: #fff3cd;
                color: #856404;
            }

            .status-customs-cleared {
                background: #d1ecf1;
                color: #0c5460;
            }

            .status-loading {
                background: #f8d7da;
                color: #721c24;
            }

            .shipment-details {
                margin-bottom: 15px;
            }

            .detail {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                color: #495057;
                font-size: 0.9em;
            }

            .detail i {
                width: 16px;
                color: #6c757d;
            }

            .shipment-progress {
                margin-top: 15px;
            }

            .progress-bar {
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 5px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #28a745, #20c997);
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .progress-text {
                font-size: 0.8em;
                color: #6c757d;
                font-weight: 500;
            }

            .track-shipment-btn {
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .track-shipment-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,123,255,0.3);
            }

            .availability-badge {
                position: absolute;
                top: 15px;
                right: 15px;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.8em;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 3px;
                box-shadow: 0 2px 10px rgba(40,167,69,0.3);
            }

            .live-indicator {
                display: flex;
                align-items: center;
                gap: 5px;
                font-weight: 600;
                font-size: 0.7em;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .pulse-dot {
                width: 6px;
                height: 6px;
                background: #fff;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
            }

            .stock-info {
                text-align: center;
            }

            .stock-amount {
                font-weight: 700;
                font-size: 1.1em;
            }

            .stock-label {
                font-size: 0.7em;
                opacity: 0.9;
            }

            /* Modal Styles */
            .tracking-modal-overlay, .subscription-modal-overlay, 
            .inventory-details-modal-overlay, .shipment-details-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .tracking-modal, .subscription-modal, 
            .inventory-details-modal, .shipment-details-modal {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 1px solid #e9ecef;
                background: #f8f9fa;
                border-radius: 15px 15px 0 0;
            }

            .modal-body {
                padding: 30px;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 1.5em;
                color: #6c757d;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .close-modal:hover {
                background: #e9ecef;
                color: #495057;
            }

            .tracking-form {
                display: flex;
                gap: 10px;
                margin-bottom: 25px;
            }

            .tracking-input {
                flex: 1;
                padding: 12px 15px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 1em;
                transition: border-color 0.3s ease;
            }

            .tracking-input:focus {
                outline: none;
                border-color: #007bff;
            }

            .track-btn {
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .track-btn:hover {
                background: #0056b3;
                transform: translateY(-1px);
            }

            .quick-track h4 {
                margin-bottom: 15px;
                color: #2c3e50;
            }

            .quick-track-buttons {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .quick-track-btn {
                background: #6c757d;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 6px;
                font-size: 0.9em;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .quick-track-btn:hover {
                background: #495057;
            }

            .tracking-result {
                margin-top: 25px;
                padding-top: 25px;
                border-top: 1px solid #e9ecef;
            }

            .tracking-error {
                text-align: center;
                padding: 30px;
                color: #721c24;
            }

            .tracking-error i {
                font-size: 3em;
                margin-bottom: 15px;
                opacity: 0.7;
            }

            .contact-support-btn {
                background: #28a745;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 15px;
                transition: all 0.3s ease;
            }

            .contact-support-btn:hover {
                background: #1e7e34;
                transform: translateY(-1px);
            }

            .tracking-success {
                animation: fadeIn 0.5s ease;
            }

            .shipment-overview {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
            }

            .overview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }

            .overview-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .overview-item .label {
                font-size: 0.8em;
                color: #6c757d;
                text-transform: uppercase;
                font-weight: 600;
            }

            .overview-item .value {
                font-weight: 700;
                color: #2c3e50;
            }

            .shipping-timeline {
                margin-bottom: 25px;
            }

            .shipping-timeline h5 {
                margin-bottom: 20px;
                color: #2c3e50;
            }

            .timeline-item {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 15px;
                padding: 10px;
                border-radius: 8px;
                transition: all 0.3s ease;
            }

            .timeline-item.completed {
                background: #d4edda;
            }

            .timeline-item.current {
                background: #fff3cd;
            }

            .timeline-item.pending {
                background: #f8f9fa;
                opacity: 0.7;
            }

            .timeline-marker {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8em;
                flex-shrink: 0;
            }

            .timeline-item.completed .timeline-marker {
                background: #28a745;
                color: white;
            }

            .timeline-item.current .timeline-marker {
                background: #ffc107;
                color: #212529;
            }

            .timeline-item.pending .timeline-marker {
                background: #e9ecef;
                color: #6c757d;
            }

            .timeline-content h6 {
                margin: 0 0 5px 0;
                color: #2c3e50;
                font-weight: 600;
            }

            .timeline-date {
                font-size: 0.8em;
                color: #6c757d;
            }

            .tracking-actions {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }

            .action-btn {
                background: #6c757d;
                color: white;
                border: none;
                padding: 10px 18px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .action-btn:hover {
                background: #495057;
                transform: translateY(-1px);
            }

            .action-btn.primary {
                background: #007bff;
            }

            .action-btn.primary:hover {
                background: #0056b3;
            }

            .success-message {
                text-align: center;
                padding: 20px;
            }

            .success-message i {
                font-size: 3em;
                color: #28a745;
                margin-bottom: 15px;
            }

            .success-message ul {
                text-align: left;
                margin: 20px 0;
                padding: 0;
                list-style: none;
            }

            .success-message li {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
                color: #495057;
            }

            .download-notification {
                position: fixed;
                top: 100px;
                right: 30px;
                background: #007bff;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,123,255,0.3);
                z-index: 10001;
                animation: slideInRight 0.3s ease;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
            }

            .notification-content.success {
                color: #fff;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideInRight {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .realtime-inventory-widget, .realtime-market-widget, .shipping-tracker {
                    margin: 20px 10px;
                    padding: 20px;
                }

                .inventory-grid, .price-grid, .shipments-grid {
                    grid-template-columns: 1fr;
                }

                .inventory-header, .market-header, .tracker-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }

                .tracking-form {
                    flex-direction: column;
                }

                .overview-grid {
                    grid-template-columns: 1fr 1fr;
                }

                .tracking-actions {
                    flex-direction: column;
                }

                .availability-badge {
                    position: static;
                    margin: 10px 0;
                    align-self: flex-end;
                }
            }
        `;

        document.head.appendChild(styles);
    }
}

// Initialize Real-time Features
let realTimeFeatures;

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        realTimeFeatures = new RealTimeFeatures();
    }, 1000);
});

// Global access for modal functions
window.realTimeFeatures = realTimeFeatures;