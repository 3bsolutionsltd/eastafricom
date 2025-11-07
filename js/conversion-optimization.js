// CONVERSION OPTIMIZATION - Phase 9
console.log('Conversion optimization features loading...');

// Conversion tracking data
const conversionData = {
    exitIntent: {
        triggered: false,
        threshold: 30, // seconds before exit intent can trigger
        mouseLeaveCount: 0
    },
    leadMagnets: [
        {
            id: 'price-guide',
            title: '📊 2024 Export Price Guide',
            description: 'Get current market prices for all our coffee and cocoa products',
            offer: 'FREE PDF Download',
            formFields: ['email', 'company', 'country'],
            downloadUrl: '#price-guide-download'
        },
        {
            id: 'sample-kit',
            title: '📦 Free Sample Starter Kit',
            description: 'Receive quality samples of our premium products delivered to your location',
            offer: 'FREE Samples + Shipping',
            formFields: ['email', 'company', 'country', 'phone'],
            downloadUrl: '#sample-kit-request'
        },
        {
            id: 'export-guide',
            title: '🌍 Complete Export Guide',
            description: 'Learn about importing procedures, certifications, and shipping processes',
            offer: 'FREE 50-page Guide',
            formFields: ['email', 'company', 'role'],
            downloadUrl: '#export-guide-download'
        }
    ],
    offers: [
        {
            id: 'first-order',
            title: '🎉 First Order Special',
            discount: '15% OFF',
            description: 'Save 15% on your first container order',
            minOrder: '1 container',
            validUntil: '2025-12-31',
            code: 'FIRST15'
        },
        {
            id: 'bulk-discount',
            title: '📦 Bulk Order Bonus',
            discount: '20% OFF',
            description: 'Save 20% when you order 5+ containers',
            minOrder: '5 containers',
            validUntil: '2025-11-30',
            code: 'BULK20'
        }
    ]
};

// User behavior tracking
let userBehavior = {
    timeOnSite: 0,
    pageViews: 0,
    interactions: 0,
    scrollDepth: 0,
    ctaClicks: 0,
    exitAttempts: 0
};

// 1. Exit-Intent Popup System
function createExitIntentPopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div id="exitIntentPopup" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 99999; padding: 20px;">
            <div style="max-width: 600px; margin: 5% auto; background: white; border-radius: 20px; overflow: hidden; position: relative; animation: popupSlideIn 0.5s ease;">
                <!-- Close Button -->
                <button onclick="closeExitIntent()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; z-index: 100; color: #6b7280;">×</button>
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center;">
                    <h2 style="margin: 0; font-size: 28px;">⏰ Wait! Don't Miss Out!</h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Before you go, grab this exclusive offer</p>
                </div>
                
                <!-- Offer Content -->
                <div style="padding: 30px;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="background: #fef3c7; color: #92400e; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                            <h3 style="margin: 0; font-size: 24px;">🎉 Special Exit Offer</h3>
                            <div style="font-size: 32px; font-weight: 700; margin: 10px 0;">15% OFF</div>
                            <div style="font-size: 16px;">Your First Container Order</div>
                        </div>
                        
                        <p style="color: #6b7280; margin-bottom: 20px;">
                            Join 247+ satisfied clients who chose East Africom for premium coffee and cocoa exports
                        </p>
                    </div>
                    
                    <!-- Benefits -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                        <div style="display: flex; align-items: center; font-size: 14px;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            Premium quality guarantee
                        </div>
                        <div style="display: flex; align-items: center; font-size: 14px;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            Free quality certification
                        </div>
                        <div style="display: flex; align-items: center; font-size: 14px;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            Direct from farm pricing
                        </div>
                        <div style="display: flex; align-items: center; font-size: 14px;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            Expert logistics support
                        </div>
                    </div>
                    
                    <!-- Lead Capture Form -->
                    <form id="exitIntentForm" style="margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                            <input type="text" id="exitName" placeholder="Your Name" required style="padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px;">
                            <input type="email" id="exitEmail" placeholder="Email Address" required style="padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                            <input type="text" id="exitCompany" placeholder="Company Name" required style="padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px;">
                            <select id="exitProduct" required style="padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px;">
                                <option value="">Product Interest</option>
                                <option value="coffee">Premium Coffee</option>
                                <option value="cocoa">Premium Cocoa</option>
                                <option value="both">Both Products</option>
                            </select>
                        </div>
                        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                            🎁 Claim 15% Discount + Free Quote
                        </button>
                    </form>
                    
                    <!-- Urgency -->
                    <div style="text-align: center; font-size: 12px; color: #ef4444;">
                        ⏰ This offer expires in <span id="exitTimer">10:00</span> minutes
                    </div>
                </div>
                
                <!-- Social Proof -->
                <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                    <strong style="color: #1f2937;">247+ companies</strong> already saving with East Africom exports • 
                    <strong style="color: #1f2937;">$2.1M+</strong> in transactions this month
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(popup.firstElementChild);
    
    // Add exit intent form handler
    document.getElementById('exitIntentForm').addEventListener('submit', handleExitIntentForm);
}

function initializeExitIntent() {
    let mouseLeaveBound = false;
    
    // Track time on site
    setTimeout(() => {
        conversionData.exitIntent.triggered = false; // Reset after threshold
        
        // Mouse leave detection
        document.addEventListener('mouseleave', (e) => {
            if (!mouseLeaveBound && e.clientY <= 0 && !conversionData.exitIntent.triggered) {
                conversionData.exitIntent.mouseLeaveCount++;
                if (conversionData.exitIntent.mouseLeaveCount >= 1) {
                    showExitIntent();
                    mouseLeaveBound = true;
                }
            }
        });
    }, conversionData.exitIntent.threshold * 1000);
}

function showExitIntent() {
    if (conversionData.exitIntent.triggered) return;
    
    conversionData.exitIntent.triggered = true;
    userBehavior.exitAttempts++;
    
    const popup = document.getElementById('exitIntentPopup');
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Start countdown timer
    startExitTimer();
    
    // Track conversion event
    trackConversion('exit_intent_shown');
}

function closeExitIntent() {
    const popup = document.getElementById('exitIntentPopup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function startExitTimer() {
    let timeLeft = 600; // 10 minutes in seconds
    const timer = document.getElementById('exitTimer');
    
    const countdown = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timer.textContent = 'EXPIRED';
            timer.style.color = '#ef4444';
        }
        timeLeft--;
    }, 1000);
}

function handleExitIntentForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('exitName').value,
        email: document.getElementById('exitEmail').value,
        company: document.getElementById('exitCompany').value,
        product: document.getElementById('exitProduct').value
    };
    
    // Track conversion
    trackConversion('exit_intent_conversion', formData);
    
    alert(`🎉 Discount Claimed Successfully!\n\nDiscount Code: FIRST15\nValid for: 15% off your first container\n\nFrank will contact you within 2 hours with:\n✓ Personalized quote\n✓ Product recommendations\n✓ Shipping details\n✓ Payment terms\n\nThank you for choosing East Africom!`);
    
    closeExitIntent();
    document.getElementById('exitIntentForm').reset();
}

// 2. Lead Capture Magnets
function createLeadMagnets() {
    const leadMagnetsContainer = document.createElement('div');
    leadMagnetsContainer.innerHTML = `
        <!-- Lead Magnet Modal -->
        <div id="leadMagnetModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 99999; padding: 20px; overflow-y: auto;">
            <div style="max-width: 500px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 25px; text-align: center; position: relative;">
                    <h2 id="magnetTitle" style="margin: 0; font-size: 22px;">Lead Magnet Title</h2>
                    <p id="magnetDescription" style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Description</p>
                    <button onclick="closeLeedMagnet()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                
                <!-- Form -->
                <div style="padding: 30px;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div id="magnetOffer" style="background: #fef3c7; color: #92400e; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 16px;">
                            FREE Offer
                        </div>
                    </div>
                    
                    <form id="leadMagnetForm">
                        <div id="magnetFormFields">
                            <!-- Dynamic form fields will be inserted here -->
                        </div>
                        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 15px;">
                            📥 Get Free Download
                        </button>
                    </form>
                    
                    <div style="text-align: center; margin-top: 15px; font-size: 12px; color: #6b7280;">
                        🔒 Your information is secure and will never be shared
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Floating Lead Magnets -->
        <div id="floatingMagnets" style="position: fixed; top: 300px; left: 20px; z-index: 998; display: flex; flex-direction: column; gap: 10px;">
            ${conversionData.leadMagnets.map(magnet => `
                <button onclick="openLeadMagnet('${magnet.id}')" style="background: white; border: 2px solid #10b981; color: #10b981; padding: 12px 16px; border-radius: 12px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); transition: transform 0.3s ease; max-width: 200px; text-align: left;" 
                        onmouseover="this.style.transform='translateX(5px)'; this.style.background='#10b981'; this.style.color='white'" 
                        onmouseout="this.style.transform='translateX(0)'; this.style.background='white'; this.style.color='#10b981'">
                    ${magnet.title}
                    <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">${magnet.offer}</div>
                </button>
            `).join('')}
        </div>
    `;
    document.body.appendChild(leadMagnetsContainer.firstElementChild);
    
    // Add form handler
    document.getElementById('leadMagnetForm').addEventListener('submit', handleLeadMagnetForm);
}

function openLeadMagnet(magnetId) {
    const magnet = conversionData.leadMagnets.find(m => m.id === magnetId);
    if (!magnet) return;
    
    // Update modal content
    document.getElementById('magnetTitle').textContent = magnet.title;
    document.getElementById('magnetDescription').textContent = magnet.description;
    document.getElementById('magnetOffer').textContent = magnet.offer;
    
    // Create form fields
    const formFields = document.getElementById('magnetFormFields');
    formFields.innerHTML = magnet.formFields.map(field => {
        const fieldConfigs = {
            email: { type: 'email', placeholder: 'Your Email Address', label: 'Email' },
            company: { type: 'text', placeholder: 'Company Name', label: 'Company' },
            country: { type: 'text', placeholder: 'Country', label: 'Country' },
            phone: { type: 'tel', placeholder: 'Phone Number', label: 'Phone' },
            role: { type: 'text', placeholder: 'Your Role/Position', label: 'Role' }
        };
        
        const config = fieldConfigs[field];
        return `
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333; font-size: 14px;">${config.label}</label>
                <input type="${config.type}" name="${field}" placeholder="${config.placeholder}" required 
                       style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px;">
            </div>
        `;
    }).join('');
    
    // Show modal
    document.getElementById('leadMagnetModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Track event
    trackConversion('lead_magnet_opened', { magnetId });
}

function closeLeedMagnet() {
    document.getElementById('leadMagnetModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleLeadMagnetForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Track conversion
    trackConversion('lead_magnet_conversion', data);
    
    alert(`📥 Download Ready!\n\nThank you for your interest in East Africom!\n\nYour free resource is being prepared and will be sent to ${data.email} within 5 minutes.\n\nFrank will also follow up with additional valuable resources and personalized recommendations.\n\nCheck your email inbox!`);
    
    closeLeedMagnet();
    document.getElementById('leadMagnetForm').reset();
}

// 3. Scroll-Based Lead Capture
function createScrollBasedCapture() {
    let scrollCaptureShown = false;
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        userBehavior.scrollDepth = Math.max(userBehavior.scrollDepth, scrollPercent);
        
        // Show lead capture at 60% scroll
        if (scrollPercent > 60 && !scrollCaptureShown) {
            scrollCaptureShown = true;
            showScrollCapture();
        }
    });
}

function showScrollCapture() {
    // Create slide-in banner
    const banner = document.createElement('div');
    banner.innerHTML = `
        <div id="scrollCapture" style="position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 20px; z-index: 9999; transform: translateY(100%); transition: transform 0.5s ease; box-shadow: 0 -8px 25px rgba(0,0,0,0.2);">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px;">
                <div style="flex: 1;">
                    <h3 style="margin: 0; font-size: 18px;">📈 Interested in Premium Exports?</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Get instant access to current market prices and exclusive bulk discounts</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <input type="email" id="scrollEmail" placeholder="Your email address" style="padding: 10px 15px; border: none; border-radius: 8px; width: 250px;">
                    <button onclick="submitScrollCapture()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; white-space: nowrap;">
                        Get Prices
                    </button>
                </div>
                <button onclick="closeScrollCapture()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; opacity: 0.7;">×</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner.firstElementChild);
    
    // Animate in
    setTimeout(() => {
        document.getElementById('scrollCapture').style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        closeScrollCapture();
    }, 10000);
    
    trackConversion('scroll_capture_shown');
}

function submitScrollCapture() {
    const email = document.getElementById('scrollEmail').value;
    if (!email) return;
    
    trackConversion('scroll_capture_conversion', { email });
    
    alert(`📧 Price List Sent!\n\nThank you! Current market prices have been sent to ${email}.\n\nYou'll also receive:\n✓ Weekly price updates\n✓ Exclusive bulk discounts\n✓ New product notifications\n\nFrank will contact you soon!`);
    
    closeScrollCapture();
}

function closeScrollCapture() {
    const banner = document.getElementById('scrollCapture');
    if (banner) {
        banner.style.transform = 'translateY(100%)';
        setTimeout(() => banner.remove(), 500);
    }
}

// 4. Conversion Tracking System
function initializeConversionTracking() {
    // Track page views
    userBehavior.pageViews++;
    
    // Track time on site
    setInterval(() => {
        userBehavior.timeOnSite++;
    }, 1000);
    
    // Track interactions
    document.addEventListener('click', (e) => {
        userBehavior.interactions++;
        
        // Track CTA clicks
        if (e.target.closest('button, .btn, a[href="#contact"]')) {
            userBehavior.ctaClicks++;
            trackConversion('cta_click', {
                element: e.target.textContent?.substring(0, 50),
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', (e) => {
        trackConversion('form_submission', {
            formId: e.target.id || 'unknown',
            timestamp: new Date().toISOString()
        });
    });
}

function trackConversion(eventType, data = {}) {
    const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
        userBehavior: { ...userBehavior },
        data: data,
        sessionId: getSessionId(),
        page: window.location.pathname
    };
    
    // Log to console (in production, this would send to analytics service)
    console.log('Conversion Event:', event);
    
    // Store in localStorage for demo purposes
    const events = JSON.parse(localStorage.getItem('conversionEvents') || '[]');
    events.push(event);
    localStorage.setItem('conversionEvents', JSON.stringify(events.slice(-100))); // Keep last 100 events
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// 5. Conversion Dashboard (Admin View)
function createConversionDashboard() {
    // Add floating dashboard button for demo
    const dashboardBtn = document.createElement('button');
    dashboardBtn.innerHTML = '📊 Analytics';
    dashboardBtn.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
        z-index: 998;
        transition: transform 0.3s ease;
        font-size: 12px;
    `;
    
    dashboardBtn.onmouseover = () => dashboardBtn.style.transform = 'translateY(-2px)';
    dashboardBtn.onmouseout = () => dashboardBtn.style.transform = 'translateY(0)';
    dashboardBtn.onclick = showConversionDashboard;
    
    document.body.appendChild(dashboardBtn);
}

function showConversionDashboard() {
    const events = JSON.parse(localStorage.getItem('conversionEvents') || '[]');
    const stats = calculateConversionStats(events);
    
    alert(`📊 Conversion Analytics Dashboard\n\n` +
          `Session Stats:\n` +
          `• Time on Site: ${Math.floor(userBehavior.timeOnSite / 60)}m ${userBehavior.timeOnSite % 60}s\n` +
          `• Page Views: ${userBehavior.pageViews}\n` +
          `• Interactions: ${userBehavior.interactions}\n` +
          `• CTA Clicks: ${userBehavior.ctaClicks}\n` +
          `• Scroll Depth: ${Math.round(userBehavior.scrollDepth)}%\n` +
          `• Exit Attempts: ${userBehavior.exitAttempts}\n\n` +
          `Total Events: ${events.length}\n` +
          `Conversions: ${stats.conversions}\n` +
          `Lead Magnets: ${stats.leadMagnets}\n` +
          `Exit Intent: ${stats.exitIntent}\n\n` +
          `🎯 Conversion Rate: ${stats.conversionRate}%`);
}

function calculateConversionStats(events) {
    const conversions = events.filter(e => e.type.includes('conversion')).length;
    const leadMagnets = events.filter(e => e.type === 'lead_magnet_conversion').length;
    const exitIntent = events.filter(e => e.type === 'exit_intent_conversion').length;
    const totalVisitors = events.filter(e => e.type === 'page_view').length || 1;
    
    return {
        conversions,
        leadMagnets,
        exitIntent,
        conversionRate: ((conversions / totalVisitors) * 100).toFixed(1)
    };
}

// Add required CSS animations
function addConversionAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popupSlideIn {
            from { transform: scale(0.8) translateY(-50px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes slideInBottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize Conversion Optimization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addConversionAnimations();
        initializeConversionTracking();
        createExitIntentPopup();
        createLeadMagnets();
        createScrollBasedCapture();
        createConversionDashboard();
        
        // Initialize exit intent after page load
        setTimeout(() => {
            initializeExitIntent();
        }, 2000);
        
        // Track page view
        trackConversion('page_view');
        
        console.log('Conversion optimization features loaded!');
    });
} else {
    addConversionAnimations();
    initializeConversionTracking();
    createExitIntentPopup();
    createLeadMagnets();
    createScrollBasedCapture();
    createConversionDashboard();
    
    setTimeout(() => {
        initializeExitIntent();
    }, 2000);
    
    trackConversion('page_view');
    console.log('Conversion optimization features loaded immediately!');
}