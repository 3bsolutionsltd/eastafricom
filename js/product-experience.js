// ENHANCED PRODUCT EXPERIENCE - Phase 8
// Enhanced product experience features loading

// Product data with detailed specifications
const productData = {
    coffee: {
        varieties: [
            {
                id: 'arabica-premium',
                name: 'Premium Arabica',
                image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
                price: '$3.80-4.50/kg',
                specs: {
                    origin: 'Mount Elgon Region',
                    altitude: '1,400-2,000m',
                    processing: 'Washed & Natural',
                    screen: '15+ (AA Grade)',
                    moisture: '≤12%',
                    defects: '<5 per 300g'
                },
                characteristics: ['Rich aroma', 'Balanced acidity', 'Chocolate notes', 'Full body'],
                certifications: ['Organic', 'Fair Trade', 'UTZ'],
                availability: 'Year-round',
                minOrder: '1 container (18-20 tons)'
            },
            {
                id: 'robusta-grade1',
                name: 'Robusta Grade 1',
                image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=300&fit=crop',
                price: '$2.80-3.40/kg',
                specs: {
                    origin: 'Central Uganda',
                    altitude: '800-1,200m',
                    processing: 'Washed',
                    screen: '18+ (Grade 1)',
                    moisture: '≤12%',
                    defects: '<10 per 300g'
                },
                characteristics: ['Strong flavor', 'High caffeine', 'Earthy notes', 'Heavy body'],
                certifications: ['HACCP', 'ISO 9001'],
                availability: 'Peak: Mar-Aug',
                minOrder: '1 container (18-20 tons)'
            }
        ]
    },
    cocoa: {
        varieties: [
            {
                id: 'fine-flavor',
                name: 'Fine Flavor Cocoa',
                image: 'https://images.unsplash.com/photo-1541599540903-216c8275ddb8?w=400&h=300&fit=crop',
                price: '$3.20-4.00/kg',
                specs: {
                    origin: 'Western Uganda',
                    variety: 'Trinitario',
                    processing: 'Fermented & Dried',
                    moisture: '≤7%',
                    fat: '50-55%',
                    pH: '5.3-5.8'
                },
                characteristics: ['Fruity notes', 'Low bitterness', 'Floral aroma', 'Premium quality'],
                certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance'],
                availability: 'Peak: Oct-Feb',
                minOrder: '1 container (18-20 tons)'
            },
            {
                id: 'bulk-cocoa',
                name: 'Bulk Cocoa Beans',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                price: '$2.60-3.20/kg',
                specs: {
                    origin: 'Central Uganda',
                    variety: 'Forastero',
                    processing: 'Fermented & Dried',
                    moisture: '≤7%',
                    fat: '50-54%',
                    pH: '5.0-5.6'
                },
                characteristics: ['Consistent quality', 'Good for blending', 'Commercial grade', 'Reliable supply'],
                certifications: ['HACCP', 'ISO 9001'],
                availability: 'Year-round',
                minOrder: '1 container (18-20 tons)'
            }
        ]
    }
};

// Sample request form data
const sampleRequestForm = {
    sampleTypes: [
        { id: 'standard', name: 'Standard Sample (500g)', price: 'Free', shipping: '$25' },
        { id: 'premium', name: 'Premium Sample Kit (1kg)', price: '$15', shipping: '$35' },
        { id: 'custom', name: 'Custom Blend Sample', price: '$25', shipping: '$40' }
    ],
    shippingMethods: [
        { id: 'express', name: 'Express (3-5 days)', cost: '+$20' },
        { id: 'standard', name: 'Standard (7-10 days)', cost: 'Included' },
        { id: 'economy', name: 'Economy (14-21 days)', cost: '-$10' }
    ]
};

// 1. Enhanced Product Gallery Modal
function createProductGalleryModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div id="productGalleryModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 99999; padding: 20px; overflow-y: auto;">
            <div style="max-width: 1200px; margin: 20px auto; background: white; border-radius: 20px; overflow: hidden; position: relative;">
                <!-- Close Button -->
                <button onclick="closeProductGallery()" style="position: absolute; top: 20px; right: 20px; z-index: 100; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;">×</button>
                
                <!-- Product Gallery Content -->
                <div id="galleryContent">
                    <!-- Content will be populated dynamically -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal.firstElementChild);
}

function openProductGallery(productType, productId) {
    const modal = document.getElementById('productGalleryModal');
    const content = document.getElementById('galleryContent');
    
    const products = productData[productType].varieties;
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    content.innerHTML = `
        <!-- Hero Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; height: 400px;">
            <!-- Product Image -->
            <div style="background: url('${product.image}') center/cover; position: relative;">
                <div style="position: absolute; bottom: 20px; left: 20px; background: rgba(255,255,255,0.95); padding: 15px; border-radius: 12px;">
                    <h2 style="margin: 0; font-size: 24px; color: #1f2937;">${product.name}</h2>
                    <div style="font-size: 18px; color: #10b981; font-weight: 600; margin-top: 5px;">${product.price}</div>
                </div>
            </div>
            
            <!-- Product Info -->
            <div style="padding: 40px;">
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin-bottom: 15px;">🌟 Product Characteristics</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        ${product.characteristics.map(char => `
                            <div style="background: #f0fdf4; color: #166534; padding: 8px 12px; border-radius: 8px; font-size: 14px; text-align: center;">
                                ${char}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin-bottom: 15px;">📜 Certifications</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${product.certifications.map(cert => `
                            <span style="background: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                ✓ ${cert}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div style="text-align: center;">
                        <div style="color: #6b7280; font-size: 12px;">AVAILABILITY</div>
                        <div style="font-weight: 600; color: #1f2937;">${product.availability}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #6b7280; font-size: 12px;">MIN ORDER</div>
                        <div style="font-weight: 600; color: #1f2937;">${product.minOrder}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Detailed Specifications -->
        <div style="padding: 40px; background: #f8fafc;">
            <h3 style="text-align: center; color: #1f2937; margin-bottom: 30px;">📋 Detailed Specifications</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                ${Object.entries(product.specs).map(([key, value]) => `
                    <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div style="font-weight: 600; color: #1f2937; font-size: 16px;">${value}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="padding: 30px; display: flex; gap: 15px; justify-content: center; background: white;">
            <button onclick="requestSample('${product.id}')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px;">
                📦 Request Sample
            </button>
            <button onclick="openPriceCalculator()" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px;">
                🧮 Get Quote
            </button>
            <button onclick="openVirtualTour('${productType}')" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px;">
                🌾 Virtual Farm Tour
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProductGallery() {
    const modal = document.getElementById('productGalleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 2. Sample Request Form
function createSampleRequestModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div id="sampleRequestModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 99999; padding: 20px; overflow-y: auto;">
            <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; position: relative;">
                    <h2 style="margin: 0; font-size: 24px;">📦 Request Product Sample</h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Get authentic samples delivered to your location</p>
                    <button onclick="closeSampleRequest()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
                </div>
                
                <!-- Form Content -->
                <div style="padding: 30px;">
                    <form id="sampleRequestForm">
                        <!-- Product Selection -->
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">Product Interest</label>
                            <select id="sampleProduct" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px;">
                                <option value="">Select product...</option>
                                <option value="arabica-premium">Premium Arabica Coffee</option>
                                <option value="robusta-grade1">Robusta Grade 1 Coffee</option>
                                <option value="fine-flavor">Fine Flavor Cocoa</option>
                                <option value="bulk-cocoa">Bulk Cocoa Beans</option>
                            </select>
                        </div>
                        
                        <!-- Sample Type -->
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">Sample Type</label>
                            <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                                ${sampleRequestForm.sampleTypes.map(type => `
                                    <label style="display: flex; align-items: center; padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e5e7eb'">
                                        <input type="radio" name="sampleType" value="${type.id}" style="margin-right: 12px;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; color: #1f2937;">${type.name}</div>
                                            <div style="font-size: 14px; color: #6b7280;">Price: ${type.price} • Shipping: ${type.shipping}</div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Contact Information -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Company Name</label>
                                <input type="text" id="companyName" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Contact Person</label>
                                <input type="text" id="contactPerson" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Email Address</label>
                            <input type="email" id="emailAddress" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                        </div>
                        
                        <!-- Shipping Address -->
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Shipping Address</label>
                            <textarea id="shippingAddress" required rows="3" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; resize: vertical;"></textarea>
                        </div>
                        
                        <!-- Shipping Method -->
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">Shipping Method</label>
                            <select id="shippingMethod" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                                <option value="">Select shipping...</option>
                                ${sampleRequestForm.shippingMethods.map(method => `
                                    <option value="${method.id}">${method.name} (${method.cost})</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <!-- Special Requirements -->
                        <div style="margin-bottom: 30px;">
                            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Special Requirements (Optional)</label>
                            <textarea id="specialRequirements" rows="2" placeholder="Any specific requirements or questions..." style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; resize: vertical;"></textarea>
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                            📦 Submit Sample Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal.firstElementChild);
    
    // Add form submission handler
    document.getElementById('sampleRequestForm').addEventListener('submit', handleSampleRequest);
}

function requestSample(productId = '') {
    const modal = document.getElementById('sampleRequestModal');
    if (!modal) {
        createSampleRequestModal();
        setTimeout(() => requestSample(productId), 100);
        return;
    }
    
    if (productId) {
        const productSelect = document.getElementById('sampleProduct');
        productSelect.value = productId;
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSampleRequest() {
    const modal = document.getElementById('sampleRequestModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleSampleRequest(e) {
    e.preventDefault();
    
    const formData = {
        product: document.getElementById('sampleProduct').value,
        sampleType: document.querySelector('input[name="sampleType"]:checked')?.value,
        company: document.getElementById('companyName').value,
        contact: document.getElementById('contactPerson').value,
        email: document.getElementById('emailAddress').value,
        address: document.getElementById('shippingAddress').value,
        shipping: document.getElementById('shippingMethod').value,
        requirements: document.getElementById('specialRequirements').value
    };
    
    alert(`📦 Sample Request Submitted Successfully!\n\nProduct: ${formData.product}\nCompany: ${formData.company}\nContact: ${formData.contact}\n\nFrank will contact you within 2 hours to confirm details and arrange sample shipment.\n\nExpected delivery: 3-10 business days depending on shipping method.`);
    
    closeSampleRequest();
    document.getElementById('sampleRequestForm').reset();
}

// 3. Virtual Farm Tour
function createVirtualTourModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div id="virtualTourModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 99999;">
            <div style="height: 100%; display: flex; flex-direction: column;">
                <!-- Tour Header -->
                <div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="margin: 0; font-size: 24px;">🌾 Virtual Farm Tour</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Experience our sustainable farming practices</p>
                    </div>
                    <button onclick="closeVirtualTour()" style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer;">×</button>
                </div>
                
                <!-- Tour Content -->
                <div id="tourContent" style="flex: 1; overflow-y: auto; padding: 20px;">
                    <!-- Content will be populated dynamically -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal.firstElementChild);
}

function openVirtualTour(productType) {
    const modal = document.getElementById('virtualTourModal');
    const content = document.getElementById('tourContent');
    
    if (!modal) {
        createVirtualTourModal();
        setTimeout(() => openVirtualTour(productType), 100);
        return;
    }
    
    const tourData = {
        coffee: {
            title: '☕ Coffee Farm Experience',
            stages: [
                {
                    title: 'Mountain Plantations',
                    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop',
                    description: 'Our coffee farms are located in the fertile slopes of Mount Elgon, at altitudes between 1,400-2,000 meters.',
                    highlights: ['High altitude growing', 'Rich volcanic soil', 'Optimal climate conditions', 'Sustainable practices']
                },
                {
                    title: 'Harvesting Process',
                    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop',
                    description: 'Hand-picked by experienced farmers during peak season to ensure only the ripest cherries are selected.',
                    highlights: ['Hand-picking method', 'Selective harvesting', 'Quality control', 'Fair wages for farmers']
                },
                {
                    title: 'Processing & Drying',
                    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
                    description: 'State-of-the-art processing facilities ensure consistent quality and proper fermentation.',
                    highlights: ['Washed processing', 'Controlled fermentation', 'Sun drying', 'Quality testing']
                }
            ]
        },
        cocoa: {
            title: '🍫 Cocoa Farm Journey',
            stages: [
                {
                    title: 'Cocoa Plantations',
                    image: 'https://images.unsplash.com/photo-1541599540903-216c8275ddb8?w=600&h=400&fit=crop',
                    description: 'Our cocoa farms in Western Uganda benefit from ideal tropical conditions and rich soil.',
                    highlights: ['Shade-grown cocoa', 'Biodiversity protection', 'Organic practices', 'Community farming']
                },
                {
                    title: 'Pod Harvesting',
                    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
                    description: 'Careful harvesting of mature cocoa pods ensures the beans inside are at peak quality.',
                    highlights: ['Optimal ripeness', 'Careful handling', 'Immediate processing', 'No damage to trees']
                },
                {
                    title: 'Fermentation & Drying',
                    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=400&fit=crop',
                    description: 'Traditional fermentation methods followed by controlled drying to develop the unique flavor profile.',
                    highlights: ['Traditional fermentation', 'Flavor development', 'Moisture control', 'Quality assurance']
                }
            ]
        }
    };
    
    const tour = tourData[productType] || tourData.coffee;
    
    content.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto;">
            <h3 style="text-align: center; color: white; margin-bottom: 40px; font-size: 28px;">${tour.title}</h3>
            
            ${tour.stages.map((stage, index) => `
                <div style="background: white; border-radius: 20px; margin-bottom: 30px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 300px;">
                        <div style="background: url('${stage.image}') center/cover;"></div>
                        <div style="padding: 30px;">
                            <div style="background: #f0fdf4; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 15px; display: inline-block;">
                                Stage ${index + 1}
                            </div>
                            <h4 style="font-size: 22px; color: #1f2937; margin-bottom: 15px;">${stage.title}</h4>
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">${stage.description}</p>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                ${stage.highlights.map(highlight => `
                                    <div style="display: flex; align-items: center; font-size: 14px; color: #374151;">
                                        <span style="color: #10b981; margin-right: 8px;">✓</span>
                                        ${highlight}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            
            <!-- Call to Action -->
            <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 20px; padding: 40px; text-align: center; margin-top: 40px;">
                <h3 style="color: white; margin-bottom: 15px; font-size: 24px;">Ready to Experience Our Quality?</h3>
                <p style="color: rgba(255,255,255,0.9); margin-bottom: 25px;">See why global buyers trust East Africom for premium ${productType} exports.</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="requestSample()" style="background: white; color: #10b981; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                        📦 Request Samples
                    </button>
                    <button onclick="openPriceCalculator(); closeVirtualTour();" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                        🧮 Get Pricing
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVirtualTour() {
    const modal = document.getElementById('virtualTourModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 4. Enhanced Product Cards with Gallery Links
function enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add view details button
        const productInfo = card.querySelector('.product-info');
        if (productInfo && !productInfo.querySelector('.view-details-btn')) {
            const productName = card.querySelector('.product-name')?.textContent || '';
            let productType = 'coffee';
            let productId = 'arabica-premium';
            
            if (productName.includes('Cocoa') || productName.includes('cocoa')) {
                productType = 'cocoa';
                productId = productName.includes('Fine') ? 'fine-flavor' : 'bulk-cocoa';
            } else if (productName.includes('Robusta')) {
                productId = 'robusta-grade1';
            }
            
            const viewDetailsBtn = document.createElement('button');
            viewDetailsBtn.className = 'view-details-btn';
            viewDetailsBtn.innerHTML = '👁️ View Details';
            viewDetailsBtn.style.cssText = `
                width: 100%;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 15px;
                transition: transform 0.2s ease;
            `;
            
            viewDetailsBtn.onmouseover = () => viewDetailsBtn.style.transform = 'translateY(-2px)';
            viewDetailsBtn.onmouseout = () => viewDetailsBtn.style.transform = 'translateY(0)';
            viewDetailsBtn.onclick = () => openProductGallery(productType, productId);
            
            productInfo.appendChild(viewDetailsBtn);
        }
    });
}

// 5. Product Comparison Tool
function createProductComparison() {
    // Create the comparison modal
    const comparisonModal = document.createElement('div');
    comparisonModal.innerHTML = `
        <div id="productComparisonModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 99999; padding: 20px; overflow-y: auto;">
            <div style="max-width: 1200px; margin: 20px auto; background: white; border-radius: 20px; overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; position: relative;">
                    <h2 style="margin: 0; font-size: 28px;">⚖️ Product Comparison Tool</h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Compare our premium coffee and cocoa products side by side</p>
                    <button onclick="closeProductComparison()" style="position: absolute; top: 15px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer;">×</button>
                </div>
                
                <!-- Comparison Content -->
                <div style="padding: 40px;">
                    <!-- Coffee Comparison -->
                    <div style="margin-bottom: 50px;">
                        <h3 style="text-align: center; color: #1f2937; margin-bottom: 30px; font-size: 24px;">☕ Coffee Products Comparison</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                            <!-- Premium Arabica -->
                            <div style="background: #f8fafc; border-radius: 16px; padding: 25px; border: 2px solid #e5e7eb;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=150&fit=crop" style="width: 200px; height: 150px; border-radius: 12px; object-fit: cover;">
                                    <h4 style="margin: 15px 0 5px 0; color: #1f2937; font-size: 20px;">Premium Arabica</h4>
                                    <div style="color: #10b981; font-weight: 600; font-size: 18px;">$3.80-4.50/kg</div>
                                </div>
                                
                                <div style="display: grid; gap: 12px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Origin:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Mount Elgon</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Altitude:</span>
                                        <span style="font-weight: 600; color: #1f2937;">1,400-2,000m</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Screen Size:</span>
                                        <span style="font-weight: 600; color: #1f2937;">15+ (AA Grade)</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Processing:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Washed & Natural</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Certifications:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Organic, Fair Trade</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                        <span style="color: #6b7280;">Availability:</span>
                                        <span style="font-weight: 600; color: #059669;">Year-round</span>
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px;">
                                    <h5 style="color: #1f2937; margin-bottom: 10px;">Characteristics:</h5>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                        <span style="background: #f0fdf4; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Rich aroma</span>
                                        <span style="background: #f0fdf4; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Balanced acidity</span>
                                        <span style="background: #f0fdf4; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Chocolate notes</span>
                                        <span style="background: #f0fdf4; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Full body</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Robusta Grade 1 -->
                            <div style="background: #f8fafc; border-radius: 16px; padding: 25px; border: 2px solid #e5e7eb;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <img src="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200&h=150&fit=crop" style="width: 200px; height: 150px; border-radius: 12px; object-fit: cover;">
                                    <h4 style="margin: 15px 0 5px 0; color: #1f2937; font-size: 20px;">Robusta Grade 1</h4>
                                    <div style="color: #10b981; font-weight: 600; font-size: 18px;">$2.80-3.40/kg</div>
                                </div>
                                
                                <div style="display: grid; gap: 12px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Origin:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Central Uganda</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Altitude:</span>
                                        <span style="font-weight: 600; color: #1f2937;">800-1,200m</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Screen Size:</span>
                                        <span style="font-weight: 600; color: #1f2937;">18+ (Grade 1)</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Processing:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Washed</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280;">Certifications:</span>
                                        <span style="font-weight: 600; color: #1f2937;">HACCP, ISO 9001</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                        <span style="color: #6b7280;">Availability:</span>
                                        <span style="font-weight: 600; color: #f59e0b;">Peak: Mar-Aug</span>
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px;">
                                    <h5 style="color: #1f2937; margin-bottom: 10px;">Characteristics:</h5>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                        <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Strong flavor</span>
                                        <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px;">High caffeine</span>
                                        <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Earthy notes</span>
                                        <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Heavy body</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Cocoa Comparison -->
                    <div style="margin-bottom: 30px;">
                        <h3 style="text-align: center; color: #1f2937; margin-bottom: 30px; font-size: 24px;">🍫 Cocoa Products Comparison</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                            <!-- Fine Flavor Cocoa -->
                            <div style="background: #fefbf3; border-radius: 16px; padding: 25px; border: 2px solid #fed7aa;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <img src="https://images.unsplash.com/photo-1541599540903-216c8275ddb8?w=200&h=150&fit=crop" style="width: 200px; height: 150px; border-radius: 12px; object-fit: cover;">
                                    <h4 style="margin: 15px 0 5px 0; color: #1f2937; font-size: 20px;">Fine Flavor Cocoa</h4>
                                    <div style="color: #ea580c; font-weight: 600; font-size: 18px;">$3.20-4.00/kg</div>
                                </div>
                                
                                <div style="display: grid; gap: 12px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Origin:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Western Uganda</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Variety:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Trinitario</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Fat Content:</span>
                                        <span style="font-weight: 600; color: #1f2937;">50-55%</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">pH Level:</span>
                                        <span style="font-weight: 600; color: #1f2937;">5.3-5.8</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Certifications:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Organic, Fair Trade</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                        <span style="color: #6b7280;">Availability:</span>
                                        <span style="font-weight: 600; color: #f59e0b;">Peak: Oct-Feb</span>
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px;">
                                    <h5 style="color: #1f2937; margin-bottom: 10px;">Characteristics:</h5>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Fruity notes</span>
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Low bitterness</span>
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Floral aroma</span>
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Premium quality</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Bulk Cocoa -->
                            <div style="background: #fefbf3; border-radius: 16px; padding: 25px; border: 2px solid #fed7aa;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop" style="width: 200px; height: 150px; border-radius: 12px; object-fit: cover;">
                                    <h4 style="margin: 15px 0 5px 0; color: #1f2937; font-size: 20px;">Bulk Cocoa Beans</h4>
                                    <div style="color: #ea580c; font-weight: 600; font-size: 18px;">$2.60-3.20/kg</div>
                                </div>
                                
                                <div style="display: grid; gap: 12px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Origin:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Central Uganda</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Variety:</span>
                                        <span style="font-weight: 600; color: #1f2937;">Forastero</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Fat Content:</span>
                                        <span style="font-weight: 600; color: #1f2937;">50-54%</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">pH Level:</span>
                                        <span style="font-weight: 600; color: #1f2937;">5.0-5.6</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa;">
                                        <span style="color: #6b7280;">Certifications:</span>
                                        <span style="font-weight: 600; color: #1f2937;">HACCP, ISO 9001</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                        <span style="color: #6b7280;">Availability:</span>
                                        <span style="font-weight: 600; color: #059669;">Year-round</span>
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px;">
                                    <h5 style="color: #1f2937; margin-bottom: 10px;">Characteristics:</h5>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Consistent quality</span>
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Good for blending</span>
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Commercial grade</span>
                                        <span style="background: #fef3e2; color: #9a3412; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Reliable supply</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                        <h3 style="color: #1f2937; margin-bottom: 20px;">Ready to Choose Your Product?</h3>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="requestSample(); closeProductComparison();" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px;">
                                📦 Request Samples
                            </button>
                            <button onclick="openPriceCalculator(); closeProductComparison();" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px;">
                                🧮 Get Detailed Quote
                            </button>
                            <button onclick="window.open('https://wa.me/256776701003?text=Hello Frank! I reviewed your product comparison and would like to discuss my specific requirements.', '_blank'); closeProductComparison();" style="background: linear-gradient(135deg, #25d366, #20c757); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px;">
                                📱 Discuss with Frank
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(comparisonModal.firstElementChild);
    
    // Compare Products button has been completely removed
}

function openProductComparison() {
    const modal = document.getElementById('productComparisonModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProductComparison() {
    const modal = document.getElementById('productComparisonModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Initialize Enhanced Product Experience
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        createProductGalleryModal();
        createSampleRequestModal();
        createVirtualTourModal();
        setTimeout(() => {
            enhanceProductCards();
            createProductComparison();
            updateContactButtonsGeoTargeting();
            fadeInProductCards();
        }, 1000);
        // Enhanced product experience features loaded
    });
} else {
    createProductGalleryModal();
    createSampleRequestModal();
    createVirtualTourModal();
    setTimeout(() => {
        enhanceProductCards();
        createProductComparison();
        updateContactButtonsGeoTargeting();
        fadeInProductCards();
    }, 1000);
}

// Update WhatsApp links to WeChat for Chinese users
function updateContactButtonsGeoTargeting() {
    const isChineseUser = window.geoTargeting?.userRegion === 'china' || 
                          ['CN', 'HK', 'MO'].includes(window.geoTargeting?.userCountry);
    
    if (isChineseUser) {
        // Update all WhatsApp buttons to WeChat
        const whatsappButtons = document.querySelectorAll('.quick-contact-btn[href*="wa.me"]');
        whatsappButtons.forEach(btn => {
            btn.href = 'javascript:void(0)';
            btn.onclick = function() { showWeChatQR(); };
            btn.innerHTML = '💬 微信';
            btn.setAttribute('data-zh', '💬 微信');
        });
    }
}

// Fade in product cards with stagger effect
function fadeInProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100); // Stagger by 100ms
    });
}