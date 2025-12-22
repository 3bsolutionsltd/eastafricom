// ENHANCED SIMPLE IMPLEMENTATION - Direct and Effective
// Enhanced simple features loading

// 1. Create Enhanced Urgency Banner - DISABLED
function createEnhancedBanner() {
    // Red banner removed - using green top banner from index.html instead
    console.log('Red banner creation skipped - using green theme banner');
}

// 2. Create Enhanced WhatsApp Button with Tooltip
function createEnhancedWhatsApp() {
    const whatsapp = document.createElement('div');
    whatsapp.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; z-index: 9999;">
            <div style="position: relative;">
                <a href="https://wa.me/256776701003?text=Hello Frank! I'm interested in East Africom's premium coffee and cocoa exports. Could you please send me:" target="_blank" 
                   style="display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: linear-gradient(135deg, #25d366, #20c757); border-radius: 50%; color: white; text-decoration: none; font-size: 28px; box-shadow: 0 8px 25px rgba(37,211,102,0.4); animation: whatsappPulse 3s infinite; transition: transform 0.3s ease;"
                   onmouseover="showWhatsAppTooltip()" onmouseout="hideWhatsAppTooltip()" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="fab fa-whatsapp" style="font-size: 28px;"></i>
                </a>
                <div id="whatsappTooltip" style="position: absolute; right: 75px; top: 50%; transform: translateY(-50%); background: white; padding: 15px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); width: 250px; opacity: 0; visibility: hidden; transition: all 0.3s ease;">
                    <div style="font-weight: 600; margin-bottom: 8px; color: #333;">💬 Chat with Frank Asiimwe</div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 10px;">Export Manager • Responds in &lt; 2 min</div>
                    <div style="font-size: 12px; color: #25d366;">✓ Get instant quotes<br>✓ Check availability<br>✓ Shipping details</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(whatsapp.firstElementChild);
    console.log('Enhanced WhatsApp created');
}

// 3. Create Enhanced Live Chat with Professional Design
function createEnhancedChat() {
    const chat = document.createElement('div');
    chat.className = 'smart-floating-element live-chat-widget';
    chat.innerHTML = `
        <div style="position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; transition: all 0.5s ease; opacity: 1; transform: translateX(0);">
            <div onclick="toggleChat()" style="background: linear-gradient(135deg, #6ab43e, #4a7c2a); color: white; padding: 15px 20px; border-radius: 25px; cursor: pointer; box-shadow: 2.5px 4.33px 15px 0px rgba(106, 180, 62, 0.3); display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; max-width: 280px;"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 35px rgba(106,180,62,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='2.5px 4.33px 15px 0px rgba(106,180,62,0.3)'">
                <div style="position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="font-size: 24px;">💬</span>
                    <span style="position: absolute; top: -5px; right: -5px; background: #ff4757; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; animation: bounce 2s infinite;">1</span>
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; min-width: 0;">
                    <div style="font-weight: 600; font-size: 16px; line-height: 1.2; margin-bottom: 2px;">Live Chat</div>
                    <div style="font-size: 12px; opacity: 0.9; line-height: 1; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 8px; height: 8px; background: #4ade80; border-radius: 50%; margin-right: 6px; animation: pulse 2s infinite; flex-shrink: 0;"></span>
                        <span>Online • &lt; 2 min response</span>
                    </div>
                </div>
            </div>
            
            <div id="enhancedChatWindow" style="display: none; position: absolute; bottom: 70px; right: 0; width: 380px; height: 500px; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden; border: 1px solid #e5e7eb;">
                <!-- Chat Header -->
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid white;">
                        <div>
                            <div style="font-weight: 600;">Frank Asiimwe</div>
                            <div style="font-size: 12px; opacity: 0.9;">Export Manager</div>
                        </div>
                    </div>
                    <button onclick="toggleChat()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                
                <!-- Messages Area -->
                <div style="padding: 20px; height: 280px; overflow-y: auto;">
                    <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px;">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face" style="width: 30px; height: 30px; border-radius: 50%;">
                        <div style="background: #f3f4f6; padding: 12px 16px; border-radius: 16px 16px 16px 4px; max-width: 80%;">
                            <div style="font-size: 14px; color: #333; line-height: 1.4;">👋 Hello! I'm Frank from East Africom. How can I help you with our premium coffee and cocoa exports today?</div>
                            <div style="font-size: 11px; color: #666; margin-top: 5px;">Just now</div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div style="padding: 15px; border-top: 1px solid #e5e7eb;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                        <button onclick="sendQuickMessage('I need a coffee quote')" style="padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 12px; transition: background 0.2s;">☕ Coffee Quote</button>
                        <button onclick="sendQuickMessage('I need a cocoa quote')" style="padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 12px; transition: background 0.2s;">🍫 Cocoa Quote</button>
                        <button onclick="sendQuickMessage('What are your minimum orders?')" style="padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 12px; transition: background 0.2s;">📦 Min Orders</button>
                        <button onclick="openPriceCalculator()" style="padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 12px; transition: background 0.2s;">🧮 Calculator</button>
                    </div>
                    
                    <!-- Contact Options -->
                    <div style="display: flex; gap: 8px;">
                        <button onclick="window.open('https://wa.me/256776701003')" style="flex: 1; padding: 10px; background: #25d366; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                        <button onclick="window.open('tel:+256776701003')" style="flex: 1; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            📞 Call
                        </button>
                        <button onclick="window.open('mailto:frank.asiimwe@eastafricom.com')" style="flex: 1; padding: 10px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            ✉️ Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(chat.firstElementChild);
    console.log('Enhanced chat created');
}

// 4. Enhanced Testimonials Section
function enhanceTestimonialsSection() {
    const testimonialsSection = document.querySelector('#testimonials .testimonials-grid');
    if (testimonialsSection) {
        testimonialsSection.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin: 20px 0;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h3 style="font-size: 24px; font-weight: 700; color: #2d3436; margin-bottom: 10px;">⭐ What Our Global Clients Say</h3>
                    <div style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">★★★★★</div>
                    <div style="color: #666;">4.9/5 based on 247+ verified reviews</div>
                </div>
                
                <div id="testimonialSlider" style="position: relative; overflow: hidden; height: 280px;">
                    <div id="testimonialTrack" style="display: flex; transition: transform 0.5s ease; height: 100%;">
                        ${getTestimonialSlides()}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                    <button onclick="prevTestimonial()" style="width: 40px; height: 40px; border: none; border-radius: 50%; background: #10b981; color: white; cursor: pointer; font-size: 18px;">‹</button>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span class="indicator active" style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; display: inline-block; cursor: pointer;" onclick="goToSlide(0)"></span>
                        <span class="indicator" style="width: 12px; height: 12px; border-radius: 50%; background: #ddd; display: inline-block; cursor: pointer;" onclick="goToSlide(1)"></span>
                        <span class="indicator" style="width: 12px; height: 12px; border-radius: 50%; background: #ddd; display: inline-block; cursor: pointer;" onclick="goToSlide(2)"></span>
                    </div>
                    <button onclick="nextTestimonial()" style="width: 40px; height: 40px; border: none; border-radius: 50%; background: #10b981; color: white; cursor: pointer; font-size: 18px;">›</button>
                </div>
                
                <!-- Social Proof Stats -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 12px; text-align: center;">
                    <div>
                        <div style="font-size: 24px; font-weight: bold; color: #10b981;">247+</div>
                        <div style="font-size: 12px; color: #666;">Happy Clients</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: bold; color: #10b981;">1,840+</div>
                        <div style="font-size: 12px; color: #666;">Orders Completed</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: bold; color: #10b981;">15,600+</div>
                        <div style="font-size: 12px; color: #666;">Tons Exported</div>
                    </div>
                </div>
            </div>
        `;
        
        startTestimonialRotation();
        // Enhanced testimonials created
    }
}

// Helper Functions
let currentSlide = 0;
const totalSlides = 3;

function getTestimonialSlides() {
    return `
        <div style="width: 100%; flex-shrink: 0; padding: 20px;">
            <div style="text-align: center;">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; border: 3px solid #10b981;">
                <div style="font-style: italic; font-size: 16px; color: #333; margin-bottom: 15px; line-height: 1.5;">"East Africom has been our reliable coffee supplier for 3+ years. Consistent quality and excellent communication. Their harvest season pricing saved us 15%!"</div>
                <div style="font-weight: 600; color: #333;">James Mueller</div>
                <div style="font-size: 14px; color: #666;">Procurement Manager, European Coffee Roasters (Germany)</div>
                <div style="font-size: 12px; color: #10b981; margin-top: 5px;">✓ $2.4M in orders • 3-year partnership</div>
            </div>
        </div>
        <div style="width: 100%; flex-shrink: 0; padding: 20px;">
            <div style="text-align: center;">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b829?w=80&h=80&fit=crop&crop=face" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; border: 3px solid #10b981;">
                <div style="font-style: italic; font-size: 16px; color: #333; margin-bottom: 15px; line-height: 1.5;">"Their organic certification and traceability records are impeccable. Perfect for our premium chocolate line. Quality consistency across shipments is remarkable."</div>
                <div style="font-weight: 600; color: #333;">Sarah Johnson</div>
                <div style="font-size: 14px; color: #666;">Head of Sourcing, Premium Chocolates Inc. (USA)</div>
                <div style="font-size: 12px; color: #10b981; margin-top: 5px;">✓ $3.1M in orders • 4-year partnership</div>
            </div>
        </div>
        <div style="width: 100%; flex-shrink: 0; padding: 20px;">
            <div style="text-align: center;">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; border: 3px solid #10b981;">
                <div style="font-style: italic; font-size: 16px; color: #333; margin-bottom: 15px; line-height: 1.5;">"专业的服务和顺畅的进口流程。他们的中国联络团队让我们第一次大宗可可进口变得非常容易。强烈推荐！"</div>
                <div style="font-weight: 600; color: #333;">陈伟 (Chen Wei)</div>
                <div style="font-size: 14px; color: #666;">采购总监, 上海食品贸易有限公司 (China)</div>
                <div style="font-size: 12px; color: #10b981; margin-top: 5px;">✓ $1.8M in orders • 2-year partnership</div>
            </div>
        </div>
    `;
}

function nextTestimonial() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateTestimonialSlider();
}

function prevTestimonial() {
    currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    updateTestimonialSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateTestimonialSlider();
}

function updateTestimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.style.background = index === currentSlide ? '#10b981' : '#ddd';
        });
    }
}

function startTestimonialRotation() {
    setInterval(() => {
        nextTestimonial();
    }, 6000);
}

// Utility Functions
function toggleChat() {
    const chatWindow = document.getElementById('enhancedChatWindow');
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
}

function showWhatsAppTooltip() {
    const tooltip = document.getElementById('whatsappTooltip');
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
}

function hideWhatsAppTooltip() {
    const tooltip = document.getElementById('whatsappTooltip');
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
}

function claimOffer() {
    alert('🔥 Excellent! Frank will contact you within 2 hours about the November Export Special with FREE quality certification. Check your WhatsApp/email!');
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
}

function sendQuickMessage(message) {
    alert(`Message sent: "${message}"\n\nFrank will respond via WhatsApp within 2 minutes!`);
}

function openPriceCalculator() {
    alert('🧮 Price Calculator opening...\nInstant quotes for:\n• Coffee: $2.80-4.50/kg\n• Cocoa: $2.20-3.80/kg\n\nFrank will send detailed pricing in 30 seconds!');
}

function startCountdown() {
    const endDate = new Date('2025-11-30 23:59:59');
    
    setInterval(() => {
        const now = new Date();
        const timeLeft = endDate - now;
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        const daysEl = document.getElementById('daysLeft');
        const hoursEl = document.getElementById('hoursLeft');
        
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
    }, 1000);
}

// Add Enhanced Animations
function addEnhancedAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes whatsappPulse {
            0% { transform: scale(1); box-shadow: 0 8px 25px rgba(37,211,102,0.4); }
            50% { transform: scale(1.05); box-shadow: 0 12px 35px rgba(37,211,102,0.6); }
            100% { transform: scale(1); box-shadow: 0 8px 25px rgba(37,211,102,0.4); }
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-5px); }
            60% { transform: translateY(-3px); }
        }
        
        /* Enhanced Experience Badge Styling */
        .experience-badge {
            position: absolute !important;
            top: 20px !important;
            right: 20px !important;
            background: linear-gradient(135deg, #FFD700, #FFA500) !important;
            color: #8B4513 !important;
            padding: 1rem !important;
            border-radius: 15px !important;
            text-align: center !important;
            z-index: 999 !important;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4) !important;
            animation: badge-float 3s ease-in-out infinite !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            backdrop-filter: blur(10px) !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            min-width: 80px !important;
            min-height: 80px !important;
        }
        
        .badge-number {
            font-size: 1.5rem !important;
            font-weight: 900 !important;
            display: block !important;
            text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.3) !important;
            line-height: 1.2 !important;
            margin-bottom: 2px !important;
            color: #8B4513 !important;
        }
        
        .badge-text {
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            opacity: 0.9 !important;
            display: block !important;
            line-height: 1.1 !important;
            color: #8B4513 !important;
        }
        
        @keyframes badge-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
        
        /* Enhanced Button Styling for Calculator */
        .btn-secondary {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            color: white !important;
            border: 2px solid #10b981 !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .btn-secondary:hover {
            background: linear-gradient(135deg, #059669, #047857) !important;
            color: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3) !important;
        }
        
        .instant-calc-btn {
            background: linear-gradient(135deg, #f59e0b, #d97706) !important;
            border-color: #f59e0b !important;
        }
        
        .instant-calc-btn:hover {
            background: linear-gradient(135deg, #d97706, #b45309) !important;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3) !important;
        }
    `;
    document.head.appendChild(style);
}

// EXECUTE ALL FEATURES
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addEnhancedAnimations();
        createEnhancedBanner();
        createEnhancedWhatsApp();
        createEnhancedChat();
        setTimeout(enhanceTestimonialsSection, 500); // Small delay for DOM
        // All enhanced features loaded
    });
} else {
    addEnhancedAnimations();
    createEnhancedBanner();
    createEnhancedWhatsApp();
    createEnhancedChat();
    setTimeout(enhanceTestimonialsSection, 500);
    console.log('All enhanced features loaded immediately!');
}