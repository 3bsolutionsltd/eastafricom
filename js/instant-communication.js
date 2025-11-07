// East Africom Instant Communication Module
// Features: Live Chat, WhatsApp Integration, Instant Quote Calculator

class InstantCommunication {
    constructor() {
        this.isOnline = true;
        this.responseTime = '< 2 minutes';
        this.businessHours = {
            start: 8, // 8 AM
            end: 18,  // 6 PM
            timezone: 'UTC+3' // East Africa Time
        };
        this.whatsappNumber = '+256776701003';
        
        // Ensure DOM is ready before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.createLiveChatWidget();
        this.enhanceWhatsAppIntegration();
        this.createInstantQuoteCalculator();
        this.setupCommunicationButtons();
        this.trackBusinessHours();
    }

    // Live Chat Widget
    createLiveChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.className = 'live-chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-trigger" id="chatTrigger">
                <div class="chat-icon">
                    <i class="fas fa-comments"></i>
                    <span class="chat-badge" id="chatBadge">💬</span>
                </div>
                <div class="chat-text">
                    <div class="chat-title">Live Chat</div>
                    <div class="chat-status" id="chatStatus">
                        <span class="status-dot online"></span>
                        Online - ${this.responseTime}
                    </div>
                </div>
            </div>
            
            <div class="chat-window" id="chatWindow" style="display: none;">
                <div class="chat-header">
                    <div class="agent-info">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" alt="Frank" class="agent-avatar">
                        <div class="agent-details">
                            <div class="agent-name">Frank Asiimwe</div>
                            <div class="agent-title">Export Manager</div>
                        </div>
                    </div>
                    <button class="chat-close" id="chatClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="message agent-message">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face" alt="Frank" class="message-avatar">
                        <div class="message-content">
                            <div class="message-text">
                                👋 Hello! I'm Frank from East Africom. How can I help you with our premium coffee and cocoa exports today?
                            </div>
                            <div class="message-time">${this.getCurrentTime()}</div>
                        </div>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <button class="quick-btn" onclick="instantComm.sendQuickMessage('I need a quote for coffee')">
                        ☕ Get Coffee Quote
                    </button>
                    <button class="quick-btn" onclick="instantComm.sendQuickMessage('I need a quote for cocoa')">
                        🍫 Get Cocoa Quote
                    </button>
                    <button class="quick-btn" onclick="instantComm.sendQuickMessage('What are your minimum orders?')">
                        📦 Minimum Orders
                    </button>
                    <button class="quick-btn" onclick="instantComm.openQuoteCalculator()">
                        🧮 Price Calculator
                    </button>
                </div>
                
                <div class="chat-input-area">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                    <button class="chat-send" id="chatSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div class="chat-footer">
                    <div class="contact-options">
                        <button class="contact-btn whatsapp-btn" onclick="instantComm.openWhatsApp()">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                        <button class="contact-btn call-btn" onclick="instantComm.makeCall()">
                            <i class="fas fa-phone"></i> Call Now
                        </button>
                        <button class="contact-btn email-btn" onclick="instantComm.sendEmail()">
                            <i class="fas fa-envelope"></i> Email
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(chatWidget);
        this.setupChatEvents();
    }

    setupChatEvents() {
        const trigger = document.getElementById('chatTrigger');
        const window = document.getElementById('chatWindow');
        const close = document.getElementById('chatClose');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('chatSend');

        // Hide chat window by default
        window.style.display = 'none';

        trigger.addEventListener('click', () => {
            window.style.display = window.style.display === 'none' ? 'block' : 'none';
            if (window.style.display === 'block') {
                input.focus();
                this.logEvent('chat_opened');
            }
        });

        close.addEventListener('click', () => {
            window.style.display = 'none';
            this.logEvent('chat_closed');
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        send.addEventListener('click', () => {
            this.sendMessage();
        });

        // Auto-show chat after 10 seconds for new visitors
        setTimeout(() => {
            if (!localStorage.getItem('chatShown')) {
                this.showChatNotification();
                localStorage.setItem('chatShown', 'true');
            }
        }, 10000);
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const messages = document.getElementById('chatMessages');
        const text = input.value.trim();

        if (!text) return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        messages.appendChild(userMessage);

        // Clear input
        input.value = '';

        // Auto-respond
        setTimeout(() => {
            this.sendAutoResponse(text);
        }, 1000);

        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
        
        this.logEvent('chat_message_sent', { message: text });
    }

    sendQuickMessage(message) {
        const input = document.getElementById('chatInput');
        input.value = message;
        this.sendMessage();
    }

    sendAutoResponse(userMessage) {
        const messages = document.getElementById('chatMessages');
        let response = this.generateResponse(userMessage);

        const agentMessage = document.createElement('div');
        agentMessage.className = 'message agent-message';
        agentMessage.innerHTML = `
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face" alt="Frank" class="message-avatar">
            <div class="message-content">
                <div class="message-text">${response}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        messages.appendChild(agentMessage);
        messages.scrollTop = messages.scrollHeight;
    }

    generateResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('coffee') || msg.includes('arabica') || msg.includes('robusta')) {
            return `☕ Excellent! Our premium coffee varieties start from $4.50/kg FOB Mombasa. We have Arabica AA ($4.50-6.20/kg) and Robusta Grade 1 ($2.80-4.20/kg). What quantity are you looking for? Minimum order is 1 container (19.2 MT).`;
        }
        
        if (msg.includes('cocoa') || msg.includes('chocolate')) {
            return `🍫 Great choice! Our organic cocoa beans are $2.80-3.50/kg and cocoa powder is $4.20-5.80/kg FOB Mombasa. All products are 100% organic certified. What's your monthly requirement?`;
        }
        
        if (msg.includes('price') || msg.includes('quote') || msg.includes('cost')) {
            return `💰 I'd be happy to provide detailed pricing! Prices vary by product, quantity, and season. Would you like me to open our instant quote calculator, or would you prefer a personalized quote? What products interest you most?`;
        }
        
        if (msg.includes('minimum') || msg.includes('order') || msg.includes('quantity')) {
            return `📦 Our minimum order is 1 container (19.2 MT). We offer free shipping for 2+ containers and flexible payment terms. Bulk discounts available for larger orders. What volume are you planning?`;
        }
        
        if (msg.includes('sample') || msg.includes('test')) {
            return `🔬 Absolutely! We provide samples with quality certificates. Sample cost is $50 + shipping, fully refundable on first order. Samples include lab reports and organic certifications. Shall I arrange this?`;
        }
        
        if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('logistics')) {
            return `🚢 Delivery time is 21-28 days to most destinations. We handle FOB/CIF terms and provide full documentation. Free shipping on 2+ containers. Need delivery to a specific port?`;
        }

        if (msg.includes('urgent') || msg.includes('fast') || msg.includes('quick')) {
            return `⚡ For urgent orders, I can fast-track your quote within 2 hours! Call me directly at +256 776 701 003 or continue on WhatsApp for immediate assistance. What's your timeline?`;
        }

        return `Thank you for your inquiry! I'll connect you with our export team for detailed assistance. For immediate help, you can call +256 776 701 003 or continue on WhatsApp. What specific information do you need about our premium coffee and cocoa exports?`;
    }

    // Enhanced WhatsApp Integration
    enhanceWhatsAppIntegration() {
        this.createWhatsAppFloatingButton();
        this.setupWhatsAppLinks();
    }

    createWhatsAppFloatingButton() {
        const whatsappFloat = document.createElement('div');
        whatsappFloat.className = 'whatsapp-float';
        whatsappFloat.innerHTML = `
            <div class="whatsapp-button" onclick="instantComm.openWhatsApp()">
                <i class="fab fa-whatsapp"></i>
                <div class="whatsapp-tooltip">
                    <div class="tooltip-header">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="Frank">
                        <div>
                            <div class="agent-name">Frank Asiimwe</div>
                            <div class="agent-status">Online</div>
                        </div>
                    </div>
                    <div class="tooltip-message">
                        Hi! 👋 Need a quick quote for premium coffee or cocoa? Chat with me on WhatsApp!
                    </div>
                    <div class="tooltip-cta">Click to chat →</div>
                </div>
            </div>
        `;
        document.body.appendChild(whatsappFloat);
    }

    setupWhatsAppLinks() {
        // Enhance existing WhatsApp links with pre-filled messages
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp();
            });
        });
    }

    openWhatsApp() {
        const message = encodeURIComponent(
            `Hello Frank! 👋 I'm interested in East Africom's premium organic coffee and cocoa exports. Could you please provide:\n\n` +
            `✅ Current pricing for coffee/cocoa\n` +
            `✅ Minimum order quantities\n` +
            `✅ Delivery timeframes\n` +
            `✅ Sample availability\n\n` +
            `Company: [Your Company]\n` +
            `Location: [Your Country]\n` +
            `Monthly Requirement: [Quantity in MT]\n\n` +
            `Looking forward to your quick response!`
        );
        
        const whatsappUrl = `https://wa.me/${this.whatsappNumber.replace('+', '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        this.logEvent('whatsapp_opened');
    }

    // Instant Quote Calculator
    createInstantQuoteCalculator() {
        const calculator = document.createElement('div');
        calculator.className = 'quote-calculator-modal';
        calculator.id = 'quoteCalculator';
        calculator.innerHTML = `
            <div class="calculator-overlay" onclick="instantComm.closeQuoteCalculator()"></div>
            <div class="calculator-window">
                <div class="calculator-header">
                    <h3>🧮 Instant Quote Calculator</h3>
                    <button class="calculator-close" onclick="instantComm.closeQuoteCalculator()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="calculator-content">
                    <div class="calculator-step" id="step1">
                        <h4>1. Select Product</h4>
                        <div class="product-selection">
                            <div class="product-option" data-product="arabica-aa" data-price="5.35">
                                <div class="product-icon">☕</div>
                                <div class="product-info">
                                    <div class="product-name">Arabica AA Grade</div>
                                    <div class="product-price">$4.50-6.20/kg</div>
                                    <div class="product-desc">Premium washed process</div>
                                </div>
                            </div>
                            <div class="product-option" data-product="arabica-ab" data-price="4.90">
                                <div class="product-icon">☕</div>
                                <div class="product-info">
                                    <div class="product-name">Arabica AB Grade</div>
                                    <div class="product-price">$4.00-5.80/kg</div>
                                    <div class="product-desc">Natural process</div>
                                </div>
                            </div>
                            <div class="product-option" data-product="robusta" data-price="3.50">
                                <div class="product-icon">☕</div>
                                <div class="product-info">
                                    <div class="product-name">Robusta Grade 1</div>
                                    <div class="product-price">$2.80-4.20/kg</div>
                                    <div class="product-desc">High caffeine content</div>
                                </div>
                            </div>
                            <div class="product-option" data-product="cocoa-beans" data-price="3.15">
                                <div class="product-icon">🍫</div>
                                <div class="product-info">
                                    <div class="product-name">Raw Cocoa Beans</div>
                                    <div class="product-price">$2.80-3.50/kg</div>
                                    <div class="product-desc">Fermented & dried</div>
                                </div>
                            </div>
                            <div class="product-option" data-product="cocoa-powder" data-price="5.00">
                                <div class="product-icon">🍫</div>
                                <div class="product-info">
                                    <div class="product-name">Cocoa Powder</div>
                                    <div class="product-price">$4.20-5.80/kg</div>
                                    <div class="product-desc">Natural & alkalized</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="calculator-step" id="step2" style="display: none;">
                        <h4>2. Quantity & Terms</h4>
                        <div class="quantity-inputs">
                            <div class="input-group">
                                <label>Quantity (MT)</label>
                                <input type="number" id="quantity" min="19.2" value="19.2" step="0.1">
                                <small>Minimum: 19.2 MT (1 container)</small>
                            </div>
                            <div class="input-group">
                                <label>Delivery Terms</label>
                                <select id="deliveryTerms">
                                    <option value="fob">FOB Mombasa</option>
                                    <option value="cif">CIF Your Port (+$200/MT)</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Destination Country</label>
                                <select id="destination">
                                    <option value="china">China</option>
                                    <option value="germany">Germany</option>
                                    <option value="usa">United States</option>
                                    <option value="netherlands">Netherlands</option>
                                    <option value="uae">UAE</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="calculator-step" id="step3" style="display: none;">
                        <h4>3. Your Instant Quote</h4>
                        <div class="quote-results">
                            <div class="quote-summary">
                                <div class="quote-product" id="quoteProduct"></div>
                                <div class="quote-quantity" id="quoteQuantity"></div>
                                <div class="quote-terms" id="quoteTerms"></div>
                            </div>
                            
                            <div class="quote-pricing">
                                <div class="price-row">
                                    <span>Unit Price:</span>
                                    <span id="unitPrice"></span>
                                </div>
                                <div class="price-row">
                                    <span>Subtotal:</span>
                                    <span id="subtotal"></span>
                                </div>
                                <div class="price-row discount" id="discountRow" style="display: none;">
                                    <span>Bulk Discount:</span>
                                    <span id="discount"></span>
                                </div>
                                <div class="price-row shipping" id="shippingRow">
                                    <span>Shipping:</span>
                                    <span id="shipping"></span>
                                </div>
                                <div class="price-row total">
                                    <span>Total Quote:</span>
                                    <span id="totalPrice"></span>
                                </div>
                            </div>
                            
                            <div class="quote-actions">
                                <button class="btn btn-primary" onclick="instantComm.requestOfficialQuote()">
                                    📧 Request Official Quote
                                </button>
                                <button class="btn btn-secondary" onclick="instantComm.shareQuoteWhatsApp()">
                                    💬 Share via WhatsApp
                                </button>
                                <button class="btn btn-outline" onclick="instantComm.callForQuote()">
                                    📞 Call for Details
                                </button>
                            </div>
                            
                            <div class="quote-note">
                                <small>* Prices subject to market conditions and final confirmation</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="calculator-navigation">
                    <button class="nav-btn prev-btn" id="prevBtn" onclick="instantComm.previousStep()" style="display: none;">
                        ← Previous
                    </button>
                    <button class="nav-btn next-btn" id="nextBtn" onclick="instantComm.nextStep()">
                        Next →
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(calculator);
        this.setupCalculatorEvents();
    }

    setupCalculatorEvents() {
        const productOptions = document.querySelectorAll('.product-option');
        productOptions.forEach(option => {
            option.addEventListener('click', () => {
                productOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedProduct = {
                    type: option.dataset.product,
                    price: parseFloat(option.dataset.price),
                    name: option.querySelector('.product-name').textContent
                };
            });
        });
    }

    openQuoteCalculator() {
        document.getElementById('quoteCalculator').style.display = 'block';
        this.currentStep = 1;
        this.logEvent('quote_calculator_opened');
    }

    closeQuoteCalculator() {
        document.getElementById('quoteCalculator').style.display = 'none';
    }

    nextStep() {
        if (this.currentStep === 1 && !this.selectedProduct) {
            alert('Please select a product first');
            return;
        }
        
        if (this.currentStep < 3) {
            document.getElementById(`step${this.currentStep}`).style.display = 'none';
            this.currentStep++;
            document.getElementById(`step${this.currentStep}`).style.display = 'block';
            
            if (this.currentStep === 3) {
                this.calculateQuote();
                document.getElementById('nextBtn').style.display = 'none';
            }
            
            document.getElementById('prevBtn').style.display = 'block';
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            document.getElementById(`step${this.currentStep}`).style.display = 'none';
            this.currentStep--;
            document.getElementById(`step${this.currentStep}`).style.display = 'block';
            
            if (this.currentStep === 1) {
                document.getElementById('prevBtn').style.display = 'none';
            }
            
            document.getElementById('nextBtn').style.display = 'block';
        }
    }

    calculateQuote() {
        const quantity = parseFloat(document.getElementById('quantity').value);
        const terms = document.getElementById('deliveryTerms').value;
        const destination = document.getElementById('destination').value;
        
        let unitPrice = this.selectedProduct.price;
        let subtotal = quantity * unitPrice * 1000; // Convert MT to kg
        
        // Apply bulk discounts
        let discount = 0;
        if (quantity >= 100) {
            discount = subtotal * 0.05; // 5% for 100+ MT
        } else if (quantity >= 50) {
            discount = subtotal * 0.03; // 3% for 50+ MT
        } else if (quantity >= 38.4) {
            discount = subtotal * 0.02; // 2% for 2+ containers
        }
        
        // Shipping costs
        let shipping = 0;
        if (terms === 'cif') {
            shipping = quantity * 200; // $200/MT for CIF
        }
        if (quantity >= 38.4) {
            shipping = 0; // Free shipping for 2+ containers
        }
        
        const total = subtotal - discount + shipping;
        
        // Update display
        document.getElementById('quoteProduct').textContent = this.selectedProduct.name;
        document.getElementById('quoteQuantity').textContent = `${quantity} MT`;
        document.getElementById('quoteTerms').textContent = terms.toUpperCase() + (destination !== 'other' ? ` ${destination}` : '');
        document.getElementById('unitPrice').textContent = `$${unitPrice.toFixed(2)}/kg`;
        document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
        document.getElementById('totalPrice').textContent = `$${total.toLocaleString()}`;
        
        if (discount > 0) {
            document.getElementById('discountRow').style.display = 'flex';
            document.getElementById('discount').textContent = `-$${discount.toLocaleString()}`;
        }
        
        document.getElementById('shippingRow').style.display = 'flex';
        document.getElementById('shipping').textContent = shipping > 0 ? `$${shipping.toLocaleString()}` : 'FREE';
        
        this.currentQuote = {
            product: this.selectedProduct.name,
            quantity,
            unitPrice,
            subtotal,
            discount,
            shipping,
            total,
            terms,
            destination
        };
    }

    requestOfficialQuote() {
        const quote = this.currentQuote;
        const subject = encodeURIComponent(`Official Quote Request - ${quote.product}`);
        const body = encodeURIComponent(
            `Dear East Africom Team,\n\n` +
            `Please provide an official quote for:\n\n` +
            `Product: ${quote.product}\n` +
            `Quantity: ${quote.quantity} MT\n` +
            `Terms: ${quote.terms.toUpperCase()}\n` +
            `Destination: ${quote.destination}\n` +
            `Estimated Total: $${quote.total.toLocaleString()}\n\n` +
            `Company Details:\n` +
            `Company: [Your Company Name]\n` +
            `Contact Person: [Your Name]\n` +
            `Phone: [Your Phone]\n` +
            `Country: [Your Country]\n\n` +
            `Additional Requirements:\n` +
            `[Please specify any special requirements]\n\n` +
            `Thank you for your prompt response.\n\n` +
            `Best regards`
        );
        
        window.location.href = `mailto:frank.asiimwe@eastafricom.com?subject=${subject}&body=${body}`;
        this.logEvent('official_quote_requested', quote);
    }

    shareQuoteWhatsApp() {
        const quote = this.currentQuote;
        const message = encodeURIComponent(
            `🧮 *Instant Quote from East Africom*\n\n` +
            `📦 Product: ${quote.product}\n` +
            `⚖️ Quantity: ${quote.quantity} MT\n` +
            `💰 Estimated Total: $${quote.total.toLocaleString()}\n` +
            `🚢 Terms: ${quote.terms.toUpperCase()}\n\n` +
            `I'm interested in proceeding with this order. Can you confirm availability and provide official documentation?\n\n` +
            `Thank you! 👍`
        );
        
        const whatsappUrl = `https://wa.me/${this.whatsappNumber.replace('+', '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        this.logEvent('quote_shared_whatsapp', quote);
    }

    callForQuote() {
        window.location.href = `tel:${this.whatsappNumber}`;
        this.logEvent('call_initiated_from_calculator');
    }

    // Communication Status Tracking
    trackBusinessHours() {
        setInterval(() => {
            this.updateOnlineStatus();
        }, 60000); // Check every minute
        
        this.updateOnlineStatus();
    }

    updateOnlineStatus() {
        const now = new Date();
        const hour = now.getHours();
        const isBusinessHours = hour >= this.businessHours.start && hour < this.businessHours.end;
        
        const statusElements = document.querySelectorAll('#chatStatus, .agent-status');
        const statusDots = document.querySelectorAll('.status-dot');
        
        if (isBusinessHours) {
            statusElements.forEach(el => {
                el.innerHTML = '<span class="status-dot online"></span>Online - ' + this.responseTime;
            });
            statusDots.forEach(dot => {
                dot.className = 'status-dot online';
            });
        } else {
            statusElements.forEach(el => {
                el.innerHTML = '<span class="status-dot away"></span>Away - Will respond in 2-4 hours';
            });
            statusDots.forEach(dot => {
                dot.className = 'status-dot away';
            });
        }
    }

    showChatNotification() {
        const notification = document.createElement('div');
        notification.className = 'chat-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="Frank">
                <div class="notification-text">
                    <div class="notification-name">Frank from East Africom</div>
                    <div class="notification-message">👋 Need help with coffee or cocoa exports?</div>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 8000);
    }

    // Utility Functions
    getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    makeCall() {
        window.location.href = `tel:${this.whatsappNumber}`;
        this.logEvent('call_initiated');
    }

    sendEmail() {
        window.location.href = `mailto:frank.asiimwe@eastafricom.com?subject=Inquiry about Premium Coffee and Cocoa Exports`;
        this.logEvent('email_initiated');
    }

    logEvent(eventType, data = {}) {
        console.log('Communication Event:', eventType, data);
        
        // Analytics integration
        if (typeof gtag !== 'undefined') {
            gtag('event', eventType, {
                'event_category': 'Communication',
                'event_label': eventType,
                ...data
            });
        }
    }
}

// Global initialization
window.instantComm = new InstantCommunication();

// Create WhatsApp button immediately
function createWhatsAppButtonNow() {
    console.log('Creating WhatsApp button now...');
    
    // Remove any existing WhatsApp button
    const existingWhatsApp = document.querySelector('.whatsapp-float');
    if (existingWhatsApp) {
        existingWhatsApp.remove();
    }
    
    const whatsappFloat = document.createElement('div');
    whatsappFloat.className = 'whatsapp-float';
    whatsappFloat.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        display: block;
        visibility: visible;
    `;
    
    whatsappFloat.innerHTML = `
        <div class="whatsapp-button" style="
            position: relative;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #25d366, #20c757);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
            animation: pulse 2s infinite;
        " onclick="window.open('https://wa.me/256776701003?text=Hello%20East%20Africom!%20I%27m%20interested%20in%20your%20coffee%20and%20cocoa%20exports.', '_blank')">
            <i class="fab fa-whatsapp" style="font-size: 28px;"></i>
        </div>
    `;
    
    document.body.appendChild(whatsappFloat);
    console.log('WhatsApp button created successfully!');
}

// Create live chat widget
function createLiveChatNow() {
    console.log('Creating live chat widget now...');
    
    // Remove any existing chat widget
    const existingChat = document.querySelector('.live-chat-widget');
    if (existingChat) {
        existingChat.remove();
    }
    
    const chatWidget = document.createElement('div');
    chatWidget.className = 'live-chat-widget';
    chatWidget.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        z-index: 10000;
        display: block;
        visibility: visible;
    `;
    
    chatWidget.innerHTML = `
        <div class="chat-trigger" style="
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 15px 20px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            max-width: 280px;
        " onclick="alert('Live chat feature - Contact us at frank.asiimwe@eastafricom.com or +256 776 701 003')">
            <div style="margin-right: 12px; font-size: 24px;">💬</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 2px;">Live Chat</div>
                <div style="font-size: 12px; opacity: 0.9;">
                    <span style="color: #4ade80;">●</span> Online - &lt; 2 minutes
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
    console.log('Live chat widget created successfully!');
}

// Execute immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        createWhatsAppButtonNow();
        createLiveChatNow();
    });
} else {
    createWhatsAppButtonNow();
    createLiveChatNow();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstantCommunication;
}