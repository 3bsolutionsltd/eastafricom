// PRICE CALCULATOR - Interactive Tools Phase
console.log('Price calculator loading...');

// Global variables for calculator
let calculatorState = {
    product: '',
    quantity: 0,
    quality: '',
    destination: '',
    basePrice: 0,
    finalPrice: 0
};

// Product pricing data
const productPricing = {
    coffee: {
        base: 3.20,
        qualities: {
            'premium': { multiplier: 1.4, label: 'Premium Arabica' },
            'specialty': { multiplier: 1.2, label: 'Specialty Grade' },
            'commercial': { multiplier: 1.0, label: 'Commercial Grade' },
            'organic': { multiplier: 1.5, label: 'Organic Certified' }
        }
    },
    cocoa: {
        base: 2.80,
        qualities: {
            'fine-flavor': { multiplier: 1.35, label: 'Fine Flavor Beans' },
            'bulk': { multiplier: 1.0, label: 'Bulk Cocoa' },
            'organic': { multiplier: 1.3, label: 'Organic Cocoa' },
            'fairtrade': { multiplier: 1.25, label: 'Fair Trade Cocoa' }
        }
    }
};

// Destination shipping costs
const shippingCosts = {
    'europe': { cost: 180, label: 'Europe (CIF)' },
    'asia': { cost: 220, label: 'Asia (CIF)' },
    'north-america': { cost: 250, label: 'North America (CIF)' },
    'middle-east': { cost: 200, label: 'Middle East (CIF)' },
    'africa': { cost: 120, label: 'Africa (CIF)' }
};

// Bulk discounts
const bulkDiscounts = {
    1: 0,      // 1 container = 0% discount
    2: 0.02,   // 2-4 containers = 2% discount
    5: 0.05,   // 5-9 containers = 5% discount
    10: 0.08,  // 10-19 containers = 8% discount
    20: 0.12   // 20+ containers = 12% discount
};

function createPriceCalculator() {
    const calculator = document.createElement('div');
    calculator.innerHTML = `
        <div id="priceCalculatorModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 99999; padding: 20px; overflow-y: auto;">
            <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 25px; text-align: center; position: relative;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 600;">🧮 Instant Price Calculator</h2>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Get accurate pricing in 30 seconds</p>
                    <button onclick="closePriceCalculator()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.8; hover: opacity: 1;">×</button>
                </div>
                
                <!-- Calculator Form -->
                <div style="padding: 30px;">
                    <!-- Product Selection -->
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">1. Select Product</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <button onclick="selectProduct('coffee')" id="coffeeBtn" style="padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.3s ease;">
                                <div style="font-size: 24px; margin-bottom: 5px;">☕</div>
                                <div style="font-weight: 600; color: #333;">Coffee</div>
                                <div style="font-size: 12px; color: #666;">$3.20-4.80/kg</div>
                            </button>
                            <button onclick="selectProduct('cocoa')" id="cocoaBtn" style="padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.3s ease;">
                                <div style="font-size: 24px; margin-bottom: 5px;">🍫</div>
                                <div style="font-weight: 600; color: #333;">Cocoa</div>
                                <div style="font-size: 12px; color: #666;">$2.80-3.80/kg</div>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Quality Selection -->
                    <div id="qualitySection" style="margin-bottom: 25px; display: none;">
                        <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">2. Select Quality Grade</label>
                        <select id="qualitySelect" onchange="updateCalculation()" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; background: white;">
                            <option value="">Choose quality grade...</option>
                        </select>
                    </div>
                    
                    <!-- Quantity Input -->
                    <div id="quantitySection" style="margin-bottom: 25px; display: none;">
                        <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">3. Quantity (20ft containers)</label>
                        <div style="position: relative;">
                            <input type="number" id="quantityInput" placeholder="Enter number of containers" min="1" max="100" onchange="updateCalculation()" style="width: 100%; padding: 12px 50px 12px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px;">
                            <span style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #666; font-size: 14px;">📦</span>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">Each container holds approximately 18-20 tons</div>
                    </div>
                    
                    <!-- Destination Selection -->
                    <div id="destinationSection" style="margin-bottom: 25px; display: none;">
                        <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">4. Destination</label>
                        <select id="destinationSelect" onchange="updateCalculation()" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; background: white;">
                            <option value="">Choose destination...</option>
                        </select>
                    </div>
                    
                    <!-- Price Breakdown -->
                    <div id="priceBreakdown" style="display: none; background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">💰 Price Breakdown</h3>
                        <div id="breakdownDetails"></div>
                        <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 18px; font-weight: 600; color: #333;">Total Price:</span>
                                <span id="totalPrice" style="font-size: 24px; font-weight: 700; color: #10b981;">$0</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div id="actionButtons" style="display: none; display: flex; gap: 12px;">
                        <button onclick="requestOfficialQuote()" style="flex: 1; padding: 15px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">📋 Request Official Quote</button>
                        <button onclick="contactDirectly()" style="flex: 1; padding: 15px; background: #25d366; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">📱 WhatsApp Frank</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(calculator.firstElementChild);
    console.log('Price calculator modal created');
}

function openPriceCalculator() {
    const modal = document.getElementById('priceCalculatorModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        createPriceCalculator();
        setTimeout(() => openPriceCalculator(), 100);
    }
}

function closePriceCalculator() {
    const modal = document.getElementById('priceCalculatorModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetCalculator();
}

function selectProduct(product) {
    calculatorState.product = product;
    
    // Update button styles
    document.getElementById('coffeeBtn').style.border = product === 'coffee' ? '2px solid #10b981' : '2px solid #e5e7eb';
    document.getElementById('coffeeBtn').style.background = product === 'coffee' ? '#f0fdf4' : 'white';
    document.getElementById('cocoaBtn').style.border = product === 'cocoa' ? '2px solid #10b981' : '2px solid #e5e7eb';
    document.getElementById('cocoaBtn').style.background = product === 'cocoa' ? '#f0fdf4' : 'white';
    
    // Show quality section
    const qualitySection = document.getElementById('qualitySection');
    const qualitySelect = document.getElementById('qualitySelect');
    
    qualitySection.style.display = 'block';
    qualitySelect.innerHTML = '<option value="">Choose quality grade...</option>';
    
    // Populate quality options
    const qualities = productPricing[product].qualities;
    Object.entries(qualities).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${value.label} (+${((value.multiplier - 1) * 100).toFixed(0)}%)`;
        qualitySelect.appendChild(option);
    });
    
    // Show other sections
    document.getElementById('quantitySection').style.display = 'block';
    
    // Populate destination options if not already done
    const destinationSelect = document.getElementById('destinationSelect');
    if (destinationSelect.children.length === 1) {
        Object.entries(shippingCosts).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${value.label} (+$${value.cost}/container)`;
            destinationSelect.appendChild(option);
        });
    }
    document.getElementById('destinationSection').style.display = 'block';
    
    updateCalculation();
}

function updateCalculation() {
    const quality = document.getElementById('qualitySelect').value;
    const quantity = parseInt(document.getElementById('quantityInput').value) || 0;
    const destination = document.getElementById('destinationSelect').value;
    
    if (!calculatorState.product || !quality || quantity === 0 || !destination) {
        document.getElementById('priceBreakdown').style.display = 'none';
        document.getElementById('actionButtons').style.display = 'none';
        return;
    }
    
    // Calculate pricing
    const productData = productPricing[calculatorState.product];
    const qualityData = productData.qualities[quality];
    const shippingData = shippingCosts[destination];
    
    // Base calculations
    const basePrice = productData.base;
    const qualityMultiplier = qualityData.multiplier;
    const pricePerKg = basePrice * qualityMultiplier;
    const kgPerContainer = 19000; // Average 19 tons per container
    const totalKg = quantity * kgPerContainer;
    const productCost = totalKg * pricePerKg;
    
    // Bulk discount
    let discountRate = 0;
    if (quantity >= 20) discountRate = bulkDiscounts[20];
    else if (quantity >= 10) discountRate = bulkDiscounts[10];
    else if (quantity >= 5) discountRate = bulkDiscounts[5];
    else if (quantity >= 2) discountRate = bulkDiscounts[2];
    else discountRate = bulkDiscounts[1];
    
    const discountAmount = productCost * discountRate;
    const shippingCost = quantity * shippingData.cost;
    const finalPrice = productCost - discountAmount + shippingCost;
    
    // Update state
    calculatorState.quality = quality;
    calculatorState.quantity = quantity;
    calculatorState.destination = destination;
    calculatorState.finalPrice = finalPrice;
    
    // Display breakdown
    const breakdownDetails = document.getElementById('breakdownDetails');
    breakdownDetails.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>${calculatorState.product.charAt(0).toUpperCase() + calculatorState.product.slice(1)} (${qualityData.label}):</span>
            <span>${totalKg.toLocaleString()} kg × $${pricePerKg.toFixed(2)} = $${productCost.toLocaleString()}</span>
        </div>
        ${discountRate > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10b981;">
            <span>Bulk Discount (${(discountRate * 100).toFixed(0)}%):</span>
            <span>-$${discountAmount.toLocaleString()}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Shipping to ${shippingData.label}:</span>
            <span>${quantity} × $${shippingData.cost} = $${shippingCost.toLocaleString()}</span>
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            📦 ${quantity} container${quantity > 1 ? 's' : ''} • ${totalKg.toLocaleString()} kg total • $${(finalPrice/totalKg).toFixed(2)}/kg final price
        </div>
    `;
    
    document.getElementById('totalPrice').textContent = `$${finalPrice.toLocaleString()}`;
    document.getElementById('priceBreakdown').style.display = 'block';
    document.getElementById('actionButtons').style.display = 'flex';
}

function requestOfficialQuote() {
    const details = `Product: ${calculatorState.product.charAt(0).toUpperCase() + calculatorState.product.slice(1)}
Quality: ${productPricing[calculatorState.product].qualities[calculatorState.quality].label}
Quantity: ${calculatorState.quantity} containers (${(calculatorState.quantity * 19).toLocaleString()} tons)
Destination: ${shippingCosts[calculatorState.destination].label}
Estimated Total: $${calculatorState.finalPrice.toLocaleString()}`;
    
    alert(`📋 Official Quote Request Sent!\n\n${details}\n\nFrank will send you a detailed quote within 2 hours with:\n✓ Current market pricing\n✓ Quality specifications\n✓ Shipping timeline\n✓ Payment terms\n✓ Certifications included`);
    
    closePriceCalculator();
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
}

function contactDirectly() {
    const message = `Hello Frank! I used your price calculator and got an estimate of $${calculatorState.finalPrice.toLocaleString()} for ${calculatorState.quantity} containers of ${calculatorState.product}. Can you confirm pricing and availability?`;
    const whatsappUrl = `https://wa.me/256776701003?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closePriceCalculator();
}

function resetCalculator() {
    calculatorState = { product: '', quantity: 0, quality: '', destination: '', basePrice: 0, finalPrice: 0 };
    document.getElementById('qualitySection').style.display = 'none';
    document.getElementById('quantitySection').style.display = 'none';
    document.getElementById('destinationSection').style.display = 'none';
    document.getElementById('priceBreakdown').style.display = 'none';
    document.getElementById('actionButtons').style.display = 'none';
    
    // Reset form values
    document.getElementById('qualitySelect').value = '';
    document.getElementById('quantityInput').value = '';
    document.getElementById('destinationSelect').value = '';
    
    // Reset button styles
    document.getElementById('coffeeBtn').style.border = '2px solid #e5e7eb';
    document.getElementById('coffeeBtn').style.background = 'white';
    document.getElementById('cocoaBtn').style.border = '2px solid #e5e7eb';
    document.getElementById('cocoaBtn').style.background = 'white';
}

// Initialize calculator when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        createPriceCalculator();
        console.log('Price calculator initialized!');
    });
} else {
    createPriceCalculator();
    console.log('Price calculator initialized immediately!');
}