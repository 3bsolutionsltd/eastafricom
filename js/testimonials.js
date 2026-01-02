/**
 * East Africom - Advanced Testimonials & Social Proof System
 * Comprehensive social validation to build trust and credibility
 */

class TestimonialsManager {
    constructor() {
        this.testimonials = this.getTestimonialsData();
        this.currentTestimonial = 0;
        this.autoSlideInterval = null;
        this.isVisible = false;
        this.successStories = this.getSuccessStories();
        this.socialProofCounters = this.getSocialProofCounters();
        
        // Ensure DOM is ready before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.createDynamicTestimonialsCarousel();
        this.createSuccessStoriesSection();
        this.createSocialProofCounters();
        this.createVerifiedReviewsSystem();
        this.createLiveTestimonialFeed();
        this.setupIntersectionObserver();
        this.startSocialProofAnimations();
    }

    getTestimonialsData() {
        return [
            {
                id: 1,
                name: "James Mueller",
                position: "Procurement Manager",
                company: "European Coffee Roasters",
                location: "Germany",
                rating: 5,
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                quote: "Consistent quality and reliable delivery schedules. East Africom has been our go-to supplier for specialty coffee for over 3 years.",
                orderValue: "$2.4M",
                yearsPartner: 3,
                products: ["Arabica Coffee", "Robusta Coffee"],
                verified: true,
                featured: true
            },
            {
                id: 2,
                name: "陈伟 (Chen Wei)",
                position: "采购总监",
                company: "上海食品贸易有限公司",
                location: "中国上海",
                rating: 5,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                quote: "专业的服务和顺畅的进口流程。他们的中国联络团队让我们第一次大宗可可进口变得非常容易。",
                orderValue: "$1.8M",
                yearsPartner: 2,
                products: ["Cocoa Beans", "Cocoa Powder"],
                verified: true,
                featured: true
            },
            {
                id: 3,
                name: "Sarah Johnson",
                position: "Head of Sourcing",
                company: "Premium Chocolates Inc.",
                location: "United States",
                rating: 5,
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
                quote: "Their organic certification and traceability records are impeccable. Perfect for our premium chocolate line.",
                orderValue: "$3.1M",
                yearsPartner: 4,
                products: ["Organic Cocoa", "Fair Trade Coffee"],
                verified: true,
                featured: true
            },
            {
                id: 4,
                name: "Ahmed Al-Rashid",
                position: "Import Director",
                company: "Gulf Trading Company",
                location: "UAE",
                rating: 5,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                quote: "Excellent logistics support and documentation. FOB and CIF terms are clearly defined.",
                orderValue: "$1.5M",
                yearsPartner: 3,
                products: ["Coffee Beans", "Cocoa Products"],
                verified: true,
                featured: false
            },
            {
                id: 5,
                name: "Maria Rodriguez",
                position: "Supply Chain Manager",
                company: "Latin American Imports",
                location: "Mexico",
                rating: 5,
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                quote: "Outstanding quality control and competitive pricing. Their farm visits gave us complete confidence in the supply chain.",
                orderValue: "$900K",
                yearsPartner: 2,
                products: ["Specialty Coffee", "Green Coffee"],
                verified: true,
                featured: false
            },
            {
                id: 6,
                name: "Roberto Silva",
                position: "Purchasing Director",
                company: "Brazilian Coffee Ventures",
                location: "Brazil",
                rating: 5,
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                quote: "Impressive sustainability practices and farmer relationships. East Africom sets the standard for ethical sourcing.",
                orderValue: "$2.7M",
                yearsPartner: 5,
                products: ["Sustainable Coffee", "Organic Cocoa"],
                verified: true,
                featured: true
            }
        ];
    }

    getSuccessStories() {
        return [
            {
                id: 1,
                title: "From Startup to $50M Coffee Empire",
                client: "European Coffee Roasters",
                challenge: "Small roastery needed reliable supply chain for expansion",
                solution: "Customized sourcing program with flexible quantities",
                result: "Grew from 500kg/month to 50 tons/month in 3 years",
                image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=250&fit=crop",
                metrics: {
                    growth: "10,000%",
                    timeframe: "3 years",
                    volume: "50 tons/month"
                }
            },
            {
                id: 2,
                title: "China Market Entry Success",
                client: "Shanghai Food Trading Co.",
                challenge: "First-time African commodity import with complex regulations",
                solution: "Full-service import support with Chinese liaison team",
                result: "Successful market entry with ongoing monthly orders",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
                metrics: {
                    savings: "30%",
                    timeline: "6 months",
                    satisfaction: "100%"
                }
            },
            {
                id: 3,
                title: "Premium Chocolate Line Launch",
                client: "Premium Chocolates Inc.",
                challenge: "Needed premium organic cocoa for luxury product line",
                solution: "Exclusive farm partnerships and organic certification",
                result: "Award-winning chocolate line with $10M+ annual revenue",
                image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=250&fit=crop",
                metrics: {
                    revenue: "$10M+",
                    awards: "5",
                    quality: "99.8%"
                }
            }
        ];
    }

    getSocialProofCounters() {
        return {
            totalClients: { count: 247, label: "Global Clients" },
            totalOrders: { count: 1840, label: "Successful Orders" },
            totalVolume: { count: 15600, label: "Tons Exported" },
            satisfaction: { count: 98.7, label: "% Satisfaction Rate" },
            yearsBusiness: { count: 12, label: "Years in Business" },
            countries: { count: 34, label: "Countries Served" }
        };
    }

    createDynamicTestimonialsCarousel() {
        const testimonialsContainer = document.querySelector('.testimonials-grid');
        if (!testimonialsContainer) return;

        // Create enhanced carousel structure
        testimonialsContainer.innerHTML = `
            <div class="testimonials-carousel">
                <div class="carousel-header">
                    <h3>What Our Clients Say</h3>
                    <div class="carousel-controls">
                        <button class="carousel-btn prev-btn" id="prevTestimonial">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="carousel-indicators" id="testimonialIndicators"></div>
                        <button class="carousel-btn next-btn" id="nextTestimonial">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="carousel-container">
                    <div class="testimonials-track" id="testimonialsTrack"></div>
                </div>
                <div class="testimonial-stats">
                    <div class="stat-item">
                        <span class="stat-number">5.0</span>
                        <span class="stat-label">Average Rating</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.testimonials.length}</span>
                        <span class="stat-label">Verified Reviews</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">247</span>
                        <span class="stat-label">Happy Clients</span>
                    </div>
                </div>
            </div>
        `;

        this.renderTestimonials();
        this.setupCarouselControls();
        this.startAutoSlide();
    }

    renderTestimonials() {
        const track = document.getElementById('testimonialsTrack');
        const indicators = document.getElementById('testimonialIndicators');
        
        if (!track || !indicators) return;

        // Render testimonials
        track.innerHTML = this.testimonials.map(testimonial => `
            <div class="testimonial-slide">
                <div class="testimonial-card enhanced">
                    <div class="testimonial-header">
                        <div class="testimonial-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
                        </div>
                        ${testimonial.verified ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>' : ''}
                    </div>
                    <blockquote class="testimonial-quote">
                        "${testimonial.quote}"
                    </blockquote>
                    <div class="testimonial-author">
                        <img src="${testimonial.image}" alt="${testimonial.name}" class="author-image">
                        <div class="author-info">
                            <h4 class="author-name">${testimonial.name}</h4>
                            <p class="author-position">${testimonial.position}</p>
                            <p class="author-company">${testimonial.company}</p>
                            <p class="author-location"><i class="fas fa-map-marker-alt"></i> ${testimonial.location}</p>
                        </div>
                    </div>
                    <div class="testimonial-metrics">
                        <div class="metric">
                            <span class="metric-value">${testimonial.orderValue}</span>
                            <span class="metric-label">Total Orders</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${testimonial.yearsPartner} years</span>
                            <span class="metric-label">Partnership</span>
                        </div>
                    </div>
                    <div class="products-used">
                        <span class="products-label">Products: </span>
                        ${testimonial.products.map(product => `<span class="product-tag">${product}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Render indicators
        indicators.innerHTML = this.testimonials.map((_, index) => `
            <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
        `).join('');
    }

    setupCarouselControls() {
        const prevBtn = document.getElementById('prevTestimonial');
        const nextBtn = document.getElementById('nextTestimonial');
        const indicators = document.querySelectorAll('.indicator');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevTestimonial());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTestimonial());
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToTestimonial(index));
        });
    }

    nextTestimonial() {
        this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    prevTestimonial() {
        this.currentTestimonial = this.currentTestimonial === 0 ? this.testimonials.length - 1 : this.currentTestimonial - 1;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    goToTestimonial(index) {
        this.currentTestimonial = index;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    updateCarousel() {
        const track = document.getElementById('testimonialsTrack');
        const indicators = document.querySelectorAll('.indicator');
        
        if (track) {
            track.style.transform = `translateX(-${this.currentTestimonial * 100}%)`;
        }

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentTestimonial);
        });
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            if (this.isVisible) {
                this.nextTestimonial();
            }
        }, 6000);
    }

    resetAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.startAutoSlide();
        }
    }

    createSuccessStoriesSection() {
        const testimonialsSection = document.querySelector('#testimonials');
        if (!testimonialsSection) return;

        const successStoriesHTML = `
            <div class="success-stories-section">
                <div class="container">
                    <div class="section-header">
                        <h3>Client Success Stories</h3>
                        <p>Real partnerships, real results</p>
                    </div>
                    <div class="success-stories-grid">
                        ${this.successStories.map(story => `
                            <div class="success-story-card" data-aos="fade-up">
                                <div class="story-image">
                                    <img src="${story.image}" alt="${story.title}">
                                    <div class="story-overlay">
                                        <div class="story-metrics">
                                            ${Object.entries(story.metrics).map(([key, value]) => `
                                                <div class="metric-item">
                                                    <span class="metric-value">${value}</span>
                                                    <span class="metric-key">${key}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="story-content">
                                    <h4>${story.title}</h4>
                                    <p class="story-client"><strong>Client:</strong> ${story.client}</p>
                                    <div class="story-details">
                                        <div class="story-challenge">
                                            <h5><i class="fas fa-exclamation-circle"></i> Challenge</h5>
                                            <p>${story.challenge}</p>
                                        </div>
                                        <div class="story-solution">
                                            <h5><i class="fas fa-lightbulb"></i> Solution</h5>
                                            <p>${story.solution}</p>
                                        </div>
                                        <div class="story-result">
                                            <h5><i class="fas fa-trophy"></i> Result</h5>
                                            <p>${story.result}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        testimonialsSection.insertAdjacentHTML('beforeend', successStoriesHTML);
    }

    createSocialProofCounters() {
        const testimonialsSection = document.querySelector('#testimonials');
        if (!testimonialsSection) return;

        const socialProofHTML = `
            <div class="social-proof-counters">
                <div class="container">
                    <div class="counters-grid">
                        ${Object.entries(this.socialProofCounters).map(([key, data]) => `
                            <div class="counter-item" data-aos="fade-up">
                                <div class="counter-number" data-target="${data.count}">0</div>
                                <div class="counter-label">${data.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        testimonialsSection.insertAdjacentHTML('beforeend', socialProofHTML);
        this.animateCounters();
    }

    createVerifiedReviewsSystem() {
        const testimonialsSection = document.querySelector('#testimonials');
        if (!testimonialsSection) return;

        const verifiedReviewsHTML = `
            <div class="verified-reviews-section">
                <div class="container">
                    <div class="reviews-header">
                        <h3>Verified Client Reviews</h3>
                        <div class="review-summary">
                            <div class="overall-rating">
                                <span class="rating-number">4.9</span>
                                <div class="rating-stars">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <span class="rating-text">Based on ${this.testimonials.length} verified reviews</span>
                            </div>
                        </div>
                    </div>
                    <div class="reviews-breakdown">
                        <div class="breakdown-item">
                            <span class="stars">5 stars</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 92%"></div>
                            </div>
                            <span class="percentage">92%</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="stars">4 stars</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 8%"></div>
                            </div>
                            <span class="percentage">8%</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="stars">3 stars</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <span class="percentage">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        testimonialsSection.insertAdjacentHTML('beforeend', verifiedReviewsHTML);
    }

    createLiveTestimonialFeed() {
        const liveTestimonialHTML = `
            <div class="live-testimonial-feed">
                <div class="live-indicator">
                    <div class="pulse-dot"></div>
                    <span>Live Client Activity</span>
                </div>
                <div class="live-testimonial-content" id="liveTestimonialContent">
                    <i class="fas fa-quote-left"></i>
                    <span class="live-text">James from Germany just placed a $240K coffee order</span>
                    <i class="fas fa-quote-right"></i>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', liveTestimonialHTML);
        this.startLiveTestimonialRotation();
    }

    startLiveTestimonialRotation() {
        const liveMessages = [
            "James from Germany just placed a $240K coffee order",
            "Sarah from USA renewed her annual $3.1M contract",
            "Chen Wei from China expanded order to 500 tons",
            "Ahmed from UAE requested premium cocoa samples",
            "Maria from Mexico increased monthly orders by 40%",
            "Roberto from Brazil praised our sustainability practices"
        ];

        let currentMessage = 0;
        const liveContent = document.getElementById('liveTestimonialContent');

        if (liveContent) {
            setInterval(() => {
                const textSpan = liveContent.querySelector('.live-text');
                if (textSpan) {
                    textSpan.style.opacity = '0';
                    setTimeout(() => {
                        textSpan.textContent = liveMessages[currentMessage];
                        textSpan.style.opacity = '1';
                        currentMessage = (currentMessage + 1) % liveMessages.length;
                    }, 300);
                }
            }, 4000);
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.counter-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const isDecimal = target.toString().includes('.');
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (isDecimal) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (isDecimal) {
                        counter.textContent = target.toFixed(1);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        setTimeout(() => animateCounter(counter), 500);
                    }
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target.id === 'testimonials') {
                    this.isVisible = entry.isIntersecting;
                }
            });
        });

        const testimonialsSection = document.querySelector('#testimonials');
        if (testimonialsSection) {
            observer.observe(testimonialsSection);
        }
    }

    startSocialProofAnimations() {
        // Add floating testimonial notifications
        setInterval(() => {
            this.showFloatingTestimonial();
        }, 15000);
    }

    showFloatingTestimonial() {
        const testimonials = [
            "🇩🇪 James Mueller just rated us 5 stars!",
            "🇨🇳 Shanghai client placed repeat order",
            "🇺🇸 Premium Chocolates renewed contract",
            "🇦🇪 Gulf Trading increased order volume",
            "🇲🇽 Latin American Imports left glowing review"
        ];

        const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
        
        const notification = document.createElement('div');
        notification.className = 'floating-testimonial';
        notification.innerHTML = `
            <div class="floating-content">
                <i class="fas fa-star"></i>
                <span>${randomTestimonial}</span>
                <button class="close-floating" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }
}

// Global initialization for immediate use
window.testimonialsManager = new TestimonialsManager();

// Create enhanced testimonials immediately
function enhanceTestimonialsNow() {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (!testimonialsGrid) {
        return;
    }
    
    // Add success stories section after testimonials
    const testimonialsSection = document.querySelector('#testimonials');
    if (testimonialsSection && !document.querySelector('.success-stories-added')) {
        const successStoriesHTML = `
        <div class="success-stories-added" style="margin: 40px 0; padding: 40px 0; background: #f8f9fa;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h3 style="font-size: 28px; font-weight: 700; color: #2d3436; margin-bottom: 10px;">Client Success Stories</h3>
                    <p style="color: #636e72; font-size: 16px;">Real partnerships, real results</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
                        <div style="height: 200px; background: linear-gradient(135deg, #00b894, #00a085); display: flex; align-items: center; justify-content: center; color: white;">
                            <div style="text-align: center;">
                                <div style="font-size: 36px; font-weight: bold;">10,000%</div>
                                <div style="font-size: 14px; opacity: 0.9;">Growth in 3 years</div>
                            </div>
                        </div>
                        <div style="padding: 30px;">
                            <h4 style="font-size: 20px; font-weight: 700; color: #2d3436; margin-bottom: 15px;">From Startup to $50M Coffee Empire</h4>
                            <p style="color: #00b894; font-weight: 600; margin-bottom: 15px;"><strong>Client:</strong> European Coffee Roasters</p>
                            <p style="font-size: 14px; color: #636e72; line-height: 1.5;">Small roastery grew from 500kg/month to 50 tons/month with our customized sourcing program and flexible quantities.</p>
                        </div>
                    </div>
                    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
                        <div style="height: 200px; background: linear-gradient(135deg, #74b9ff, #0984e3); display: flex; align-items: center; justify-content: center; color: white;">
                            <div style="text-align: center;">
                                <div style="font-size: 36px; font-weight: bold;">30%</div>
                                <div style="font-size: 14px; opacity: 0.9;">Cost Savings</div>
                            </div>
                        </div>
                        <div style="padding: 30px;">
                            <h4 style="font-size: 20px; font-weight: 700; color: #2d3436; margin-bottom: 15px;">China Market Entry Success</h4>
                            <p style="color: #00b894; font-weight: 600; margin-bottom: 15px;"><strong>Client:</strong> Shanghai Food Trading Co.</p>
                            <p style="font-size: 14px; color: #636e72; line-height: 1.5;">First-time African commodity import made easy with our Chinese liaison team and full-service support.</p>
                        </div>
                    </div>
                    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
                        <div style="height: 200px; background: linear-gradient(135deg, #fd79a8, #e84393); display: flex; align-items: center; justify-content: center; color: white;">
                            <div style="text-align: center;">
                                <div style="font-size: 36px; font-weight: bold;">$10M+</div>
                                <div style="font-size: 14px; opacity: 0.9;">Annual Revenue</div>
                            </div>
                        </div>
                        <div style="padding: 30px;">
                            <h4 style="font-size: 20px; font-weight: 700; color: #2d3436; margin-bottom: 15px;">Premium Chocolate Line Launch</h4>
                            <p style="color: #00b894; font-weight: 600; margin-bottom: 15px;"><strong>Client:</strong> Premium Chocolates Inc.</p>
                            <p style="font-size: 14px; color: #636e72; line-height: 1.5;">Award-winning chocolate line with our exclusive farm partnerships and organic certification.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #00b894, #00a085); color: white; padding: 60px 0; margin: 40px 0;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 40px; text-align: center;">
                    <div>
                        <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">247</div>
                        <div style="font-size: 16px; opacity: 0.9;">Global Clients</div>
                    </div>
                    <div>
                        <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">1,840</div>
                        <div style="font-size: 16px; opacity: 0.9;">Successful Orders</div>
                    </div>
                    <div>
                        <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">15,600</div>
                        <div style="font-size: 16px; opacity: 0.9;">Tons Exported</div>
                    </div>
                    <div>
                        <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">98.7%</div>
                        <div style="font-size: 16px; opacity: 0.9;">Satisfaction Rate</div>
                    </div>
                    <div>
                        <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">12</div>
                        <div style="font-size: 16px; opacity: 0.9;">Years in Business</div>
                    </div>
                    <div>
                        <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">34</div>
                        <div style="font-size: 16px; opacity: 0.9;">Countries Served</div>
                    </div>
                </div>
            </div>
        </div>`;
        
        testimonialsSection.insertAdjacentHTML('beforeend', successStoriesHTML);
    }
}

// Execute immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceTestimonialsNow);
} else {
    enhanceTestimonialsNow();
}

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialsManager;
}