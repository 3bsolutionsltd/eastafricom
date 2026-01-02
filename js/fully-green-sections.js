// Fully Green Theme Section Integration for East Africom Coffee Website
// Creates sections that match the Fully Green WordPress theme structure

class FullyGreenSections {
    constructor() {
        this.init();
    }

    init() {
        // Disabled duplicate coffee process section to avoid redundancy
        // this.createCoffeeProcessSection();
        // Disabled coffee services section as requested by user
        // this.createCoffeeServicesSection();
        this.enhanceExistingSections();
    }

    createCoffeeProcessSection() {
        // Create a coffee process section matching green_process from Fully Green theme
        const processSection = document.createElement('section');
        processSection.className = 'coffee-process';
        
        // Available coffee images - will use the first available one
        const coffeeImages = [
            'images/top-view-coffee-cup-coffee-beans-dark-table-scaled.jpg',
            'images/coffee_bag_beans.jpeg',
            'images/top-view-coffee-cup-coffee-beans-dark-table-scaled-pwpzhuzcqrxko5ck204gcsth8mjrec9r8q0gkv4fwo.jpeg'
        ];
        
        const imageUrl = coffeeImages[0]; // Use the first image
        
        processSection.innerHTML = `
            <div class="container">
                <div class="column_wrapper">
                    <div class="column left">
                        <div class="image" style="background-image: url('${imageUrl}');">
                            <!-- Uganda coffee processing journey -->
                        </div>
                    </div>
                    <div class="column right">
                        <h3>Our Coffee Journey</h3>
                        <h2>From Highland Farms to Premium Export</h2>
                        <p>Experience the complete journey of our premium Uganda coffee, from sustainable farming practices to international quality standards.</p>
                        
                        <div class="item_wrapper">
                            <div class="item">
                                <span class="icon_wrap">
                                    <i class="fas fa-seedling"></i>
                                </span>
                                <p>Sustainable farming practices in Uganda's fertile highlands</p>
                            </div>
                            <div class="item">
                                <span class="icon_wrap">
                                    <i class="fas fa-hand-holding-heart"></i>
                                </span>
                                <p>Hand-picked selection ensuring only premium quality beans</p>
                            </div>
                            <div class="item">
                                <span class="icon_wrap">
                                    <i class="fas fa-industry"></i>
                                </span>
                                <p>Traditional processing methods preserving authentic flavors</p>
                            </div>
                            <div class="item">
                                <span class="icon_wrap">
                                    <i class="fas fa-certificate"></i>
                                </span>
                                <p>International quality certification and export standards</p>
                            </div>
                            <div class="item">
                                <span class="icon_wrap">
                                    <i class="fas fa-shipping-fast"></i>
                                </span>
                                <p>Global shipping to China, Europe, and worldwide markets</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after hero section
        const hero = document.querySelector('.hero');
        if (hero && hero.nextElementSibling) {
            hero.parentNode.insertBefore(processSection, hero.nextElementSibling);
        }
    }

    createCoffeeServicesSection() {
        // Create a services section matching green_services from Fully Green theme
        const servicesSection = document.createElement('section');
        servicesSection.className = 'coffee-services';
        servicesSection.innerHTML = `
            <div class="container">
                <div class="section-header-green">
                    <h3>Premium Services</h3>
                    <h2>Complete Coffee Export Solutions</h2>
                    <p>From farm to international markets, we provide comprehensive services for premium coffee export with quality guarantee.</p>
                </div>
                
                <div class="services_wrapper">
                    <div class="item">
                        <span class="icon_wrap">
                            <i class="fas fa-coffee"></i>
                        </span>
                        <h3>Premium Coffee Sourcing</h3>
                        <p>Direct sourcing from Uganda's finest coffee farms, ensuring quality and traceability from highland farms to your cup.</p>
                    </div>
                    
                    <div class="item">
                        <span class="icon_wrap">
                            <i class="fas fa-leaf"></i>
                        </span>
                        <h3>Sustainable Practices</h3>
                        <p>Environmentally conscious farming and processing methods that preserve nature while delivering premium quality.</p>
                    </div>
                    
                    <div class="item">
                        <span class="icon_wrap">
                            <i class="fas fa-globe"></i>
                        </span>
                        <h3>Global Export</h3>
                        <p>Comprehensive export services to China, Europe, and worldwide markets with complete logistics support.</p>
                    </div>
                    
                    <div class="item">
                        <span class="icon_wrap">
                            <i class="fas fa-medal"></i>
                        </span>
                        <h3>Quality Assurance</h3>
                        <p>Rigorous quality control and international certification ensuring every batch meets premium standards.</p>
                    </div>
                    
                    <div class="item">
                        <span class="icon_wrap">
                            <i class="fas fa-handshake"></i>
                        </span>
                        <h3>Partnership Support</h3>
                        <p>Long-term partnerships with personalized service, competitive pricing, and reliable supply chain management.</p>
                    </div>
                    
                    <div class="item">
                        <span class="icon_wrap">
                            <i class="fas fa-chart-line"></i>
                        </span>
                        <h3>Market Intelligence</h3>
                        <p>Real-time market insights and pricing intelligence to help optimize your coffee procurement strategy.</p>
                    </div>
                </div>
            </div>
        `;

        // Insert the services section
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.parentNode.insertBefore(servicesSection, aboutSection);
        } else {
            // Fallback: append to main content
            const main = document.querySelector('main') || document.body;
            main.appendChild(servicesSection);
        }
    }

    enhanceExistingSections() {
        // Add Fully Green theme classes to existing sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            // Add alternating backgrounds like Fully Green theme
            if (index % 2 === 1) {
                section.classList.add('section-nature-theme');
            }
            
            // Enhance section headers
            const headers = section.querySelectorAll('h2, h3');
            headers.forEach(header => {
                if (header.tagName === 'H2') {
                    header.style.fontWeight = '900';
                    header.style.color = '#000';
                }
                if (header.tagName === 'H3' && header.classList.contains('accent')) {
                    header.classList.add('text-green-accent');
                }
            });
        });

        // Enhance existing service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.classList.add('card-nature-theme');
            
            // Update icons to match Fully Green theme
            const icon = card.querySelector('.icon');
            if (icon) {
                icon.classList.add('icon-nature');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FullyGreenSections();
});

// Initialize when page is fully loaded (for dynamic content)
window.addEventListener('load', () => {
    // Reapply enhancements after all content is loaded
    setTimeout(() => {
        new FullyGreenSections();
    }, 1000);
});