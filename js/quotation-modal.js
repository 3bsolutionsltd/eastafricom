/**
 * Professional B2B Quotation Modal System
 * East Africom - Coffee & Cocoa Export
 */

// Product database with pricing tiers
const productDatabase = {
    'arabica-aa-washed': {
        name: 'Arabica AA Grade - Washed Coffee',
        category: 'Premium Arabica',
        basePrice: 4500, // USD per MT
        minOrder: 1,
        tiers: [
            { min: 1, max: 19, price: 4500 },
            { min: 20, max: 49, price: 4350 },
            { min: 50, max: 99, price: 4200 },
            { min: 100, max: Infinity, price: 4000 }
        ],
        certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance', 'UTZ'],
        moisture: '10-12%',
        screen: 'Screen 18+',
        cupScore: '84+'
    },
    'arabica-ab-natural': {
        name: 'Arabica AB Grade - Natural Coffee',
        category: 'Premium Arabica',
        basePrice: 4200,
        minOrder: 1,
        tiers: [
            { min: 1, max: 19, price: 4200 },
            { min: 20, max: 49, price: 4100 },
            { min: 50, max: 99, price: 4000 },
            { min: 100, max: Infinity, price: 3850 }
        ],
        certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance'],
        moisture: '10-12%',
        screen: 'Screen 16+',
        cupScore: '82+'
    },
    'arabica-honey-process': {
        name: 'Arabica Semi-Washed (Honey Process)',
        category: 'Premium Arabica',
        basePrice: 4800,
        minOrder: 1,
        tiers: [
            { min: 1, max: 19, price: 4800 },
            { min: 20, max: 49, price: 4650 },
            { min: 50, max: 99, price: 4500 },
            { min: 100, max: Infinity, price: 4300 }
        ],
        certifications: ['Organic', 'Fair Trade', 'Specialty Coffee Association'],
        moisture: '10-12%',
        screen: 'Screen 17+',
        cupScore: '85+'
    },
    'robusta-grade1': {
        name: 'Robusta Grade 1 - Washed Coffee',
        category: 'Commercial Robusta',
        basePrice: 2400,
        minOrder: 1,
        tiers: [
            { min: 1, max: 29, price: 2400 },
            { min: 30, max: 69, price: 2300 },
            { min: 70, max: 149, price: 2200 },
            { min: 150, max: Infinity, price: 2100 }
        ],
        certifications: ['Fair Trade', 'UTZ'],
        moisture: '12.5%',
        screen: 'Screen 18',
        cupScore: 'Grade 1'
    },
    'specialty-microlot': {
        name: 'Specialty Microlot - Competition Grade',
        category: 'Ultra Premium',
        basePrice: 6500,
        minOrder: 1,
        tiers: [
            { min: 1, max: 9, price: 6500 },
            { min: 10, max: 19, price: 6300 },
            { min: 20, max: 49, price: 6100 },
            { min: 50, max: Infinity, price: 5900 }
        ],
        certifications: ['Specialty Coffee Association', 'Cup of Excellence'],
        moisture: '10-11%',
        screen: 'Screen 19+',
        cupScore: '87+'
    },
    'commercial-blend': {
        name: 'Commercial Blend - Bulk Export',
        category: 'Commercial Grade',
        basePrice: 2800,
        minOrder: 1,
        tiers: [
            { min: 1, max: 49, price: 2800 },
            { min: 50, max: 99, price: 2700 },
            { min: 100, max: 199, price: 2600 },
            { min: 200, max: Infinity, price: 2500 }
        ],
        certifications: ['Fair Trade', 'Organic (optional)'],
        moisture: '12%',
        screen: 'Mixed Screen',
        cupScore: 'Commercial Grade'
    },
    'raw-cocoa': {
        name: 'Raw Cocoa Beans',
        category: 'Cocoa Products',
        basePrice: 3200,
        minOrder: 1,
        tiers: [
            { min: 1, max: 29, price: 3200 },
            { min: 30, max: 69, price: 3100 },
            { min: 70, max: 149, price: 3000 },
            { min: 150, max: Infinity, price: 2900 }
        ],
        certifications: ['Fair Trade', 'Organic', 'Rainforest Alliance'],
        moisture: '7%',
        fermentation: 'Well fermented',
        cupScore: 'Fine Flavor'
    },
    'cocoa-powder': {
        name: 'Cocoa Powder',
        category: 'Cocoa Products',
        basePrice: 4500,
        minOrder: 1,
        tiers: [
            { min: 1, max: 19, price: 4500 },
            { min: 20, max: 49, price: 4400 },
            { min: 50, max: 99, price: 4300 },
            { min: 100, max: Infinity, price: 4200 }
        ],
        certifications: ['Organic', 'Fair Trade', 'Non-GMO'],
        fatContent: '10-12%',
        fineness: '99.5%',
        cupScore: 'Premium Quality'
    }
};

// Open quotation modal with direct product object (for database products)
function openQuotationModalDirect(productObject) {
    const product = productObject;
    const productId = 'db-' + product.id; // Prefix with 'db-' for database products
    
    // Store product in a global registry for price calculation
    if (!window.productRegistry) window.productRegistry = {};
    window.productRegistry[productId] = product;
    
    // Create and show modal
    createAndShowModal(product, productId);
    
    console.log('📊 Quotation modal opened for:', product.name);
}

// Open quotation modal (legacy for hardcoded products)
function openQuotationModal(productId) {
    // Handle numeric IDs or invalid IDs by mapping to default product
    if (typeof productId === 'number' || (!productDatabase[productId] && !window.productRegistry?.[productId])) {
        console.warn('Invalid product ID:', productId, '- using default product');
        // Default to arabica-aa-washed if productId is invalid
        productId = 'arabica-aa-washed';
    }
    
    const product = window.productRegistry?.[productId] || productDatabase[productId];
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Store in registry
    if (!window.productRegistry) window.productRegistry = {};
    window.productRegistry[productId] = product;
    
    // Create and show modal
    createAndShowModal(product, productId);
    
    console.log('📊 Quotation modal opened for:', product.name);
}

// Create and show the modal
function createAndShowModal(product, productId) {
    // Ensure product has required properties with defaults
    const minOrder = product.minOrder || 1;
    const basePrice = product.basePrice || product.price || 4500; // Fallback to a default price
    const category = product.category || 'Coffee Product';
    const cupScore = product.cupScore || 'N/A';
    
    // Validate that basePrice is a valid number
    const validBasePrice = isNaN(basePrice) ? 4500 : basePrice;
    
    console.log('Creating modal for product:', productId, product);
    console.log('Base price:', validBasePrice, 'Min order:', minOrder);
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'quotation-modal';
    modal.className = 'quotation-modal';
    modal.innerHTML = `
        <div class="quotation-modal-overlay" onclick="closeQuotationModal()"></div>
        <div class="quotation-modal-container">
            <!-- Header -->
            <div class="quotation-modal-header">
                <div>
                    <h2>Request Quotation</h2>
                    <p>${product.name}</p>
                </div>
                <button class="close-modal-btn" onclick="closeQuotationModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Content -->
            <div class="quotation-modal-body">
                <form id="quotationForm" onsubmit="handleQuotationSubmit(event, '${productId}')">
                    
                    <!-- Product Summary -->
                    <div class="product-summary-card">
                        <div class="product-badge">${category}</div>
                        <h3>${product.name}</h3>
                        <div class="product-specs">
                            <span><i class="fas fa-certificate"></i> ${cupScore}</span>
                            <span><i class="fas fa-box"></i> Min: ${minOrder} MT</span>
                            <span><i class="fas fa-dollar-sign"></i> From $${validBasePrice.toLocaleString()}/MT</span>
                        </div>
                    </div>

                    <!-- Quantity Calculator -->
                    <div class="form-section">
                        <label class="form-label">
                            <i class="fas fa-calculator"></i> Quantity (Metric Tons)
                        </label>
                        <div class="quantity-input-group">
                            <button type="button" onclick="adjustQuantity('${productId}', -1)" class="qty-btn">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input 
                                type="number" 
                                id="quantity-${productId}" 
                                value="${minOrder}" 
                                min="${minOrder}" 
                                step="1"
                                oninput="calculatePrice('${productId}')"
                                class="quantity-input"
                            >
                            <button type="button" onclick="adjustQuantity('${productId}', 1)" class="qty-btn">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <small class="form-hint">Minimum order: ${minOrder} MT</small>
                    </div>

                    <!-- Price Estimate -->
                    <div id="price-estimate-${productId}" class="price-estimate-card">
                        <div class="price-row">
                            <span>Unit Price:</span>
                            <strong class="unit-price">$${validBasePrice.toLocaleString()}/MT</strong>
                        </div>
                        <div class="price-row">
                            <span>Quantity:</span>
                            <strong class="quantity-display">${minOrder} MT</strong>
                        </div>
                        <div class="price-row total-row">
                            <span>Total Estimate:</span>
                            <strong class="total-price">$${(validBasePrice * minOrder).toLocaleString()}</strong>
                        </div>
                        <small class="price-note">
                            <i class="fas fa-info-circle"></i> 
                            Price subject to final confirmation. Volume discounts available.
                        </small>
                    </div>

                    <!-- Shipping Terms -->
                    <div class="form-section">
                        <label class="form-label">
                            <i class="fas fa-shipping-fast"></i> Shipping Terms
                        </label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="shipping" value="FOB" checked>
                                <div class="radio-content">
                                    <strong>FOB (Free on Board)</strong>
                                    <small>Buyer arranges shipping from port</small>
                                </div>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="shipping" value="CIF">
                                <div class="radio-content">
                                    <strong>CIF (Cost, Insurance & Freight)</strong>
                                    <small>We arrange shipping to your port</small>
                                </div>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="shipping" value="DDP">
                                <div class="radio-content">
                                    <strong>DDP (Delivered Duty Paid)</strong>
                                    <small>Delivered to your warehouse</small>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Certifications -->
                    <div class="form-section">
                        <label class="form-label">
                            <i class="fas fa-award"></i> Required Certifications
                        </label>
                        <div class="checkbox-group">
                            ${product.certifications.map(cert => `
                                <label class="checkbox-option">
                                    <input type="checkbox" name="certifications" value="${cert}">
                                    <span>${cert}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Company Details -->
                    <div class="form-section">
                        <label class="form-label">
                            <i class="fas fa-building"></i> Company Information
                        </label>
                        <div class="form-row">
                            <input type="text" name="company" placeholder="Company Name" required class="form-control">
                            <input type="text" name="country" placeholder="Country" required class="form-control">
                        </div>
                    </div>

                    <!-- Contact Person -->
                    <div class="form-section">
                        <label class="form-label">
                            <i class="fas fa-user"></i> Contact Person
                        </label>
                        <div class="form-row">
                            <input type="text" name="contact_name" placeholder="Full Name" required class="form-control">
                            <input type="email" name="email" placeholder="Email Address" required class="form-control">
                        </div>
                        <input type="tel" name="phone" placeholder="Phone Number (with country code)" required class="form-control">
                    </div>

                    <!-- Additional Requirements -->
                    <div class="form-section">
                        <label class="form-label">
                            <i class="fas fa-file-alt"></i> Additional Requirements (Optional)
                        </label>
                        <textarea 
                            name="requirements" 
                            placeholder="Packaging preferences, delivery timeline, special certifications, etc."
                            rows="4"
                            class="form-control textarea"
                        ></textarea>
                    </div>

                    <!-- File Upload -->
                    <div class="form-section">
                        <label class="form-label">
                            <i class="fas fa-paperclip"></i> Attach Documents (Optional)
                        </label>
                        <div class="file-upload-area" onclick="document.getElementById('file-upload-${productId}').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Click to upload specifications, purchase order, or other documents</p>
                            <small>PDF, DOC, DOCX (Max 5MB)</small>
                            <input 
                                type="file" 
                                id="file-upload-${productId}" 
                                name="documents" 
                                accept=".pdf,.doc,.docx"
                                style="display: none;"
                                onchange="handleFileSelect(event, '${productId}')"
                            >
                        </div>
                        <div id="file-list-${productId}" class="file-list"></div>
                    </div>

                    <!-- Submit Buttons -->
                    <div class="form-actions">
                        <button type="button" onclick="closeQuotationModal()" class="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-paper-plane"></i>
                            Send Quotation Request
                        </button>
                    </div>

                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => calculatePrice(productId), 100);
    requestAnimationFrame(() => modal.classList.add('active'));
}

// Close modal
function closeQuotationModal() {
    const modal = document.getElementById('quotation-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Adjust quantity
function adjustQuantity(productId, delta) {
    const input = document.getElementById(`quantity-${productId}`);
    // Get product from registry (supports both database and hardcoded products)
    const product = window.productRegistry?.[productId] || productDatabase[productId];
    
    if (!product) {
        console.error('Product not found for quantity adjustment:', productId);
        return;
    }
    
    const currentValue = parseInt(input.value) || product.minOrder;
    const newValue = Math.max(product.minOrder, currentValue + delta);
    input.value = newValue;
    calculatePrice(productId);
}

// Calculate price based on quantity
function calculatePrice(productId) {
    // Get product from registry (supports both database and hardcoded products)
    const product = window.productRegistry?.[productId] || productDatabase[productId];
    
    if (!product) {
        console.error('Product not found for price calculation:', productId);
        return;
    }
    
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value) || product.minOrder || 1;

    // Find applicable tier (if tiers exist)
    let unitPrice = product.basePrice || product.price || 4500; // Fallback pricing
    
    // Validate that unitPrice is a number
    if (isNaN(unitPrice) || unitPrice <= 0) {
        console.warn('Invalid basePrice for product:', productId, 'Using default 4500');
        unitPrice = 4500;
    }
    
    if (product.tiers && Array.isArray(product.tiers)) {
        const tier = product.tiers.find(t => quantity >= t.min && quantity <= t.max);
        if (tier && tier.price && !isNaN(tier.price)) {
            unitPrice = tier.price;
        }
    }
    const totalPrice = unitPrice * quantity;

    // Update display
    const estimateCard = document.getElementById(`price-estimate-${productId}`);
    if (estimateCard) {
        estimateCard.querySelector('.unit-price').textContent = `$${unitPrice.toLocaleString()}/MT`;
        estimateCard.querySelector('.quantity-display').textContent = `${quantity} MT`;
        estimateCard.querySelector('.total-price').textContent = `$${totalPrice.toLocaleString()}`;

        // Add discount badge if applicable
        if (unitPrice < product.basePrice) {
            const discount = Math.round((1 - unitPrice / product.basePrice) * 100);
            if (!estimateCard.querySelector('.discount-badge')) {
                const badge = document.createElement('div');
                badge.className = 'discount-badge';
                badge.innerHTML = `<i class="fas fa-tag"></i> ${discount}% Volume Discount Applied!`;
                estimateCard.appendChild(badge);
            } else {
                estimateCard.querySelector('.discount-badge').innerHTML = `<i class="fas fa-tag"></i> ${discount}% Volume Discount Applied!`;
            }
        } else {
            const existingBadge = estimateCard.querySelector('.discount-badge');
            if (existingBadge) existingBadge.remove();
        }
    }
}

// Handle file selection
function handleFileSelect(event, productId) {
    const file = event.target.files[0];
    if (!file) return;

    const fileList = document.getElementById(`file-list-${productId}`);
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <i class="fas fa-file-pdf"></i>
        <span>${file.name}</span>
        <small>(${(file.size / 1024).toFixed(1)} KB)</small>
        <button type="button" onclick="this.parentElement.remove()" class="remove-file-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    fileList.innerHTML = '';
    fileList.appendChild(fileItem);
}

// Handle form submission
function handleQuotationSubmit(event, productId) {
    event.preventDefault();
    
    const form = event.target;
    const product = window.productRegistry?.[productId] || productDatabase[productId];
    const formData = new FormData(form);
    
    // Get selected certifications
    const certifications = Array.from(form.querySelectorAll('input[name="certifications"]:checked'))
        .map(cb => cb.value);
    
    // Build quotation data
    const quotationData = {
        product: product.name,
        productId: productId,
        quantity: form.querySelector(`#quantity-${productId}`).value,
        shipping: formData.get('shipping'),
        certifications: certifications,
        company: formData.get('company'),
        country: formData.get('country'),
        contactName: formData.get('contact_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        requirements: formData.get('requirements'),
        timestamp: new Date().toISOString()
    };

    console.log('📋 Quotation Request:', quotationData);

    // Send to backend API
    submitQuotationToBackend(quotationData);
}

// Submit quotation to backend
async function submitQuotationToBackend(data) {
    try {
        const response = await fetch('backend/submit-quotation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);
        
        // Get response text first to check if it's valid JSON
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            console.error('Response was:', responseText.substring(0, 500));
            throw new Error('Server returned invalid response. Please check if PHP is running correctly.');
        }

        if (result.success) {
            // Show success message
            showSuccessMessage(data.product, data.email);
            
            // Close modal
            closeQuotationModal();
            
            console.log('✅ Quotation submitted successfully:', result);
        } else {
            // Show error message
            showErrorMessage(result.message || 'Unknown error occurred');
            console.error('❌ Submission failed:', result.message);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        showErrorMessage(`Failed to submit quotation: ${error.message}. Please try again or contact us directly.`);
    }
}

// Show success message
function showSuccessMessage(productName, email) {
    const message = document.createElement('div');
    message.className = 'success-toast';
    message.innerHTML = `
        <div class="success-toast-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>Quotation Request Sent!</strong>
                <p>We'll send a detailed quote for <strong>${productName}</strong> to ${email} within 2 hours.</p>
            </div>
        </div>
    `;
    document.body.appendChild(message);

    setTimeout(() => message.classList.add('show'), 100);
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 6000);
}

// Show error message
function showErrorMessage(errorText) {
    const message = document.createElement('div');
    message.className = 'error-toast';
    message.innerHTML = `
        <div class="error-toast-content">
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <strong>Submission Failed</strong>
                <p>${errorText}</p>
            </div>
        </div>
    `;
    document.body.appendChild(message);

    setTimeout(() => message.classList.add('show'), 100);
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 6000);
}

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuotationModal();
    }
});
