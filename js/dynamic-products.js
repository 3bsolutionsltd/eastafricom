/**
 * Dynamic Product Loader
 * Loads products from database and displays them
 */

// Load products from backend
async function loadProducts() {
    try {
        // Add cache-busting timestamp
        const timestamp = new Date().getTime();
        const response = await fetch(`backend/api/products.php?_t=${timestamp}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        const data = await response.json();
        
        // Extract products from the API response structure
        const products = data?.data?.products || data?.products || data || [];
        
        if (products && products.length > 0) {
            displayProducts(products);
            console.log(`✅ Loaded ${products.length} products from database`);
        } else {
            console.warn('No products found in database');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in the product grid
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) {
        console.error('Product grid not found');
        return;
    }
    
    // Clear existing hardcoded products
    productGrid.innerHTML = '';
    
    // Generate product cards
    products.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
    
    // Attach click handlers to all order buttons
    attachOrderButtonHandlers();
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    // Create product slug for quotation modal
    const productSlug = createProductSlug(product.name, product.id);
    
    // Safely get prices with fallbacks
    const priceMin = product.price_min || product.price || product.basePrice || 4.5;
    const priceMax = product.price_max || (priceMin * 1.3) || 6.5;
    
    // Format prices to 2 decimal places
    const formattedPriceMin = parseFloat(priceMin).toFixed(2);
    const formattedPriceMax = parseFloat(priceMax).toFixed(2);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image || 'images/coffee_bag_beans.jpeg'}" alt="${product.name}">
            <div class="product-badge">${product.badge || getBadgeFromCategory(product.category)}</div>
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-specs">${product.description || product.specifications || ''}</p>
            <div class="product-pricing">
                <span class="price" data-currency="USD">$${formattedPriceMin}-${formattedPriceMax}/kg</span>
                <small class="price-note">FOB Mombasa Port</small>
            </div>
            <div class="product-features">
                ${generateFeatureTags(product)}
            </div>
            <div class="product-order-section">
                <button class="order-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> ORDER NOW - Get Quote
                </button>
                <div class="quick-contact">
                    <a href="tel:+256776701003" class="quick-contact-btn">📞 Call</a>
                    <a href="https://wa.me/256776701003" class="quick-contact-btn" target="_blank">💬 WhatsApp</a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Create a product slug for the quotation modal
function createProductSlug(name, id) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Get badge based on category
function getBadgeFromCategory(category) {
    const badges = {
        'Premium Arabica': 'Premium',
        'Commercial Robusta': 'Strong',
        'Ultra Premium': 'Exclusive',
        'Commercial Grade': 'Bulk',
        'Cocoa Products': 'Premium',
        'Specialty': 'Specialty'
    };
    return badges[category] || 'Premium';
}

// Generate feature tags
function generateFeatureTags(product) {
    const tags = [];
    
    // Add defect-free tag if has defect info
    if (product.defects !== undefined && product.defects <= 5) {
        tags.push('<span class="feature-tag defect-free">🛡️ Defect-Free</span>');
    }
    
    // Add organic tag if organic
    if (product.organic || (product.certifications && product.certifications.includes('Organic'))) {
        tags.push('<span class="feature-tag organic">🌿 100% Organic</span>');
    }
    
    // Add certifications
    if (product.certifications) {
        const certs = Array.isArray(product.certifications) 
            ? product.certifications 
            : product.certifications.split(',');
        
        certs.slice(0, 3).forEach(cert => {
            cert = cert.trim();
            if (cert && cert.toLowerCase() !== 'organic') {
                tags.push(`<span class="feature-tag">${escapeHtml(cert)}</span>`);
            }
        });
    }
    
    // Add processing method if available
    if (product.processing) {
        tags.push(`<span class="feature-tag">${escapeHtml(product.processing)}</span>`);
    }
    
    return tags.join('\n                ');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open quotation modal with database product
function openDatabaseQuotationModal(productId) {
    console.log(`Opening quotation modal for product ID: ${productId}`);
    
    // Fetch full product details
    fetch(`backend/api/products.php?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            // Extract products array from API response structure
            const products = data?.data?.products || data?.products || [];
            
            // Find the specific product by ID
            const product = products.find(p => p.id == productId);
            
            if (product) {
                openQuotationModalWithProduct(product);
            } else {
                console.error('Product not found');
                alert('Product not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            alert('Error loading product details. Please try again.');
        });
}

// Open quotation modal with full product data
function openQuotationModalWithProduct(product) {
    // Safely get price with fallback
    // Database stores prices as USD per MT already, no conversion needed
    const basePrice = parseFloat(product.price || product.price_min || product.basePrice || 4500);
    
    // Validate price is reasonable (between $500 and $50,000 per MT)
    const validatedPrice = (basePrice >= 500 && basePrice <= 50000) ? basePrice : 4500;
    
    // Create a quotation-compatible product object
    const quotationProduct = {
        id: product.id,
        name: product.name,
        category: product.category,
        basePrice: validatedPrice, // Price is already in USD per MT
        minOrder: 1,
        tiers: [
            { min: 1, max: 19, price: validatedPrice },
            { min: 20, max: 49, price: Math.round(validatedPrice * 0.95) },
            { min: 50, max: 99, price: Math.round(validatedPrice * 0.90) },
            { min: 100, max: Infinity, price: Math.round(validatedPrice * 0.85) }
        ],
        certifications: product.certifications ? 
            (Array.isArray(product.certifications) ? product.certifications : product.certifications.split(',').map(c => c.trim())) : 
            [],
        moisture: product.moisture || 'Standard',
        screen: product.screen_size || 'Standard',
        cupScore: product.cup_score || 'Premium Quality'
    };
    
    console.log('Opening quotation modal with validated price:', validatedPrice);
    
    // If the openQuotationModal function exists from quotation-modal.js, use it
    if (typeof window.openQuotationModalDirect === 'function') {
        window.openQuotationModalDirect(quotationProduct);
    } else {
        console.error('Quotation modal function not found');
    }
}

// Attach click handlers to order buttons
function attachOrderButtonHandlers() {
    const orderButtons = document.querySelectorAll('.product-order-section .order-btn[data-product-id]');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                openDatabaseQuotationModal(productId);
            }
        });
    });
}

// Make function globally accessible
window.openDatabaseQuotationModal = openDatabaseQuotationModal;

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}
