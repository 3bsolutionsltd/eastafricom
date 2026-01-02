/**
 * East Africom Admin Dashboard JavaScript
 * Manages the admin interface for dynamic content
 */

class AdminDashboard {
    constructor() {
        this.apiBase = '../backend/api';
        this.currentTab = 'dashboard';
        this.data = {
            products: [],
            testimonials: [],
            activities: [],
            settings: {}
        };
        
        this.init();
    }

    async init() {
        console.log('🔧 Initializing Admin Dashboard...');
        
        // Test connection
        await this.testConnection();
        
        // Load initial data
        await this.loadDashboardData();
        
        // Set up auto-refresh
        this.setupAutoRefresh();
        
        console.log('✅ Admin Dashboard initialized');
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.apiBase}/products.php?admin=true`);
            if (response.ok) {
                this.updateConnectionStatus(true);
            } else {
                throw new Error('API response not OK');
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            this.updateConnectionStatus(false);
        }
    }

    updateConnectionStatus(isOnline) {
        const statusIndicator = document.getElementById('connection-status');
        const statusText = document.getElementById('connection-text');
        
        if (isOnline) {
            statusIndicator.className = 'w-2 h-2 rounded-full mr-2 bg-green-500';
            statusText.textContent = 'Connected';
            statusText.className = 'text-sm text-green-600';
        } else {
            statusIndicator.className = 'w-2 h-2 rounded-full mr-2 bg-red-500';
            statusText.textContent = 'Disconnected';
            statusText.className = 'text-sm text-red-600';
        }
    }

    async loadDashboardData() {
        try {
            // Load all data in parallel - use admin=true for products to show inactive ones
            const [products, testimonials, activities, settings, slideshow, awards, certifications, qualityBadges] = await Promise.all([
                this.fetchData('products.php?admin=true'),
                this.fetchData('testimonials.php'),
                this.fetchData('live-activity.php'),
                this.fetchData('settings.php'),
                this.fetchData('slideshow.php'),
                this.fetchData('awards.php'),
                this.fetchData('certifications.php'),
                this.fetchData('quality-badges.php')
            ]);

            this.data.products = products?.data?.products || [];
            this.data.testimonials = testimonials?.data?.testimonials || [];
            this.data.activities = activities?.data?.activities || [];
            this.data.settings = settings?.data?.settings || {};
            this.data.slideshow = slideshow?.data?.slides || [];
            this.data.awards = awards?.data?.awards || [];
            this.data.certifications = certifications?.data?.certifications || [];
            this.data.qualityBadges = qualityBadges?.data?.badges || [];

            this.updateDashboard();
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showNotification('Failed to load dashboard data', 'error');
        }
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.apiBase}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
            return null;
        }
    }

    updateDashboard() {
        // Update stats
        const statSlides = document.getElementById('stat-slides');
        if (statSlides) statSlides.textContent = (this.data.slideshow && this.data.slideshow.length) || 0;
        
        const statAwards = document.getElementById('stat-awards');
        if (statAwards) statAwards.textContent = (this.data.awards && this.data.awards.length) || 0;
        
        const totalProducts = document.getElementById('total-products');
        if (totalProducts) totalProducts.textContent = this.data.products.length;
        
        const totalStock = this.data.products.reduce((sum, product) => sum + (product.stock || 0), 0);
        const totalStockEl = document.getElementById('total-stock');
        if (totalStockEl) totalStockEl.textContent = `${totalStock} MT`;
        
        const totalTestimonials = document.getElementById('total-testimonials');
        if (totalTestimonials) totalTestimonials.textContent = this.data.testimonials.length;
        
        const todayActivities = this.data.activities.filter(activity => {
            const activityDate = new Date(activity.time).toDateString();
            const today = new Date().toDateString();
            return activityDate === today;
        });
        const todayActivity = document.getElementById('today-activity');
        if (todayActivity) todayActivity.textContent = todayActivities.length;

        // Update recent activity
        this.updateDashboardActivity();
        
        // Update current tab content
        this.updateCurrentTabContent();
    }

    updateDashboardActivity() {
        const container = document.getElementById('dashboard-activity');
        const recentActivities = this.data.activities.slice(0, 5);
        
        if (recentActivities.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">No recent activity</p>';
            return;
        }

        container.innerHTML = recentActivities.map(activity => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                        <p class="font-medium text-gray-900">${activity.action}</p>
                        <p class="text-sm text-gray-500">${activity.location}${activity.amount ? ' • ' + activity.amount : ''}</p>
                    </div>
                </div>
                <span class="text-xs text-gray-400">${this.formatTimeAgo(activity.time)}</span>
            </div>
        `).join('');
    }

    updateCurrentTabContent() {
        switch (this.currentTab) {
            case 'slideshow':
                this.renderSlideshowTable();
                break;
            case 'awards':
                this.renderAwardsTable();
                break;
            case 'certifications':
                this.renderCertificationsTable();
                break;
            case 'quality-badges':
                this.renderQualityBadgesTable();
                break;
            case 'products':
                this.renderProductsTable();
                break;
            case 'testimonials':
                this.renderTestimonialsTable();
                break;
            case 'activity':
                this.renderActivityTable();
                break;
            case 'settings':
                this.renderSettingsForm();
                break;
        }
    }

    renderCertificationsTable() {
        const container = document.getElementById('certifications-table');
        
        if (!this.data.certifications || this.data.certifications.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No certifications found. <a href="javascript:void(0)" onclick="openCertificationModal()" class="text-blue-600 hover:underline">Add your first certification</a></p>';
            return;
        }

        container.innerHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certification</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${this.data.certifications.map(cert => `
                        <tr>
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <i class="fas ${cert.icon} text-green-600 text-xl mr-3"></i>
                                    <div class="font-medium text-gray-900">${cert.name}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">${cert.type || 'N/A'}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${cert.valid_until || 'N/A'}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full ${cert.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${cert.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm space-x-2">
                                <button onclick="openCertificationModal(${cert.id})" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteCertification(${cert.id})" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderQualityBadgesTable() {
        const container = document.getElementById('quality-badges-table');
        
        if (!this.data.qualityBadges || this.data.qualityBadges.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No quality badges found.</p>';
            return;
        }

        container.innerHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${this.data.qualityBadges.map(badge => `
                        <tr>
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <i class="fas ${badge.icon} text-green-600 text-xl mr-3"></i>
                                    <div>
                                        <div class="font-medium text-gray-900">${badge.title_en}</div>
                                        <div class="text-sm text-gray-500">${badge.badge_text}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">${badge.description_en.substring(0, 60)}...</td>
                            <td class="px-6 py-4 text-sm">${badge.position}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full ${badge.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${badge.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm space-x-2">
                                <button onclick="openQualityBadgeModal(${badge.id})" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteQualityBadge(${badge.id})" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderProductsTable() {
        const container = document.getElementById('products-table');
        
        if (this.data.products.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No products found</p>';
            return;
        }

        container.innerHTML = `
            <div class="mb-4">
                <button onclick="openAddProductModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-plus mr-2"></i>Add New Product
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${this.data.products.map(product => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    ${product.image_url ? 
                                        `<img src="../${product.image_url}" alt="${product.name}" class="h-12 w-12 object-cover rounded">` :
                                        `<div class="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                            <i class="fas fa-image text-gray-400"></i>
                                        </div>`
                                    }
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900">${product.name}</div>
                                        <div class="text-sm text-gray-500">${product.grade || ''}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${product.price}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.stock} MT</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.category}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-xs">
                                    ${product.defect_free ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1">🛡️</span>' : ''}
                                    ${product.organic ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1">🌿</span>' : ''}
                                    ${product.featured ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">⭐</span>' : ''}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                        ${product.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onclick="openImageUploadModal(${product.id}, '${product.name.replace(/'/g, "\\'")}')" 
                                            class="text-green-600 hover:text-green-900 mr-2" 
                                            title="Upload Image">
                                        <i class="fas fa-camera"></i>
                                    </button>
                                    ${product.image_url ? 
                                        `<button onclick="deleteProductImage(${product.id})" 
                                                class="text-orange-600 hover:text-orange-900 mr-2" 
                                                title="Delete Image">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>` : ''
                                    }
                                    <button onclick="editProduct(${product.id})" 
                                            class="text-blue-600 hover:text-blue-900 mr-2"
                                            title="Edit Product">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteProduct(${product.id})" 
                                            class="text-red-600 hover:text-red-900"
                                            title="Delete Product">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderTestimonialsTable() {
        const container = document.getElementById('testimonials-table');
        
        if (this.data.testimonials.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No testimonials found</p>';
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Size</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${this.data.testimonials.map(testimonial => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="font-medium text-gray-900">${testimonial.name}</div>
                                    <div class="text-sm text-gray-500">${testimonial.country || ''}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${testimonial.company || ''}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${testimonial.orderSize || ''}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${testimonial.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                        ${testimonial.featured ? 'Featured' : 'Regular'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onclick="editTestimonial(${testimonial.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteTestimonial(${testimonial.id})" class="text-red-600 hover:text-red-900">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderSlideshowTable() {
        const container = document.getElementById('slideshow-table');
        
        if (!this.data.slideshow || this.data.slideshow.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No slideshow slides found. <a href="javascript:void(0)" onclick="openSlideshowModal()" class="text-blue-600 hover:underline">Add your first slide</a></p>';
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${this.data.slideshow.map(slide => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">${slide.position}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${slide.chapter}</td>
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-900">${slide.title_en}</div>
                                    <div class="text-sm text-gray-500">${slide.title_zh}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${slide.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                        ${slide.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onclick='openSlideshowModal(${JSON.stringify(slide).replace(/'/g, "\\'")})' class="text-blue-600 hover:text-blue-900">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderAwardsTable() {
        const container = document.getElementById('awards-table');
        
        if (!this.data.awards || this.data.awards.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No awards found. <a href="javascript:void(0)" onclick="openAwardModal()" class="text-blue-600 hover:underline">Add your first award</a></p>';
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Award</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${this.data.awards.map(award => `
                            <tr>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <i class="fas ${award.icon} text-yellow-500 text-xl mr-3"></i>
                                        <div class="font-medium text-gray-900">${award.title}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-900">${award.organization}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${award.year}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        ${award.category || 'General'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${award.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                        ${award.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onclick='openAwardModal(${JSON.stringify(award).replace(/'/g, "\\'")})' class="text-blue-600 hover:text-blue-900">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderActivityTable() {
        const container = document.getElementById('activity-table');
        
        if (this.data.activities.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No activities found</p>';
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${this.data.activities.map(activity => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="font-medium text-gray-900">${activity.action}</div>
                                    <div class="text-sm text-gray-500">${activity.client || ''}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${activity.location}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${activity.amount || ''}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.formatTimeAgo(activity.time)}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${activity.autoGenerated ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                                        ${activity.autoGenerated ? 'Auto' : 'Manual'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onclick="deleteActivity(${activity.id})" class="text-red-600 hover:text-red-900">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderSettingsForm() {
        const container = document.getElementById('settings-form');
        
        const settingsGroups = {
            contact: ['contact_phone', 'contact_email', 'whatsapp_number', 'company_address'],
            business: ['min_order_quantity', 'shipping_lead_time', 'currency'],
            features: ['show_live_activity', 'show_trust_badges', 'auto_refresh_interval']
        };

        container.innerHTML = `
            <form onsubmit="saveSettings(event)" class="space-y-6">
                ${Object.entries(settingsGroups).map(([group, settings]) => `
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="text-lg font-medium text-gray-900 mb-4 capitalize">${group} Settings</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${settings.map(setting => {
                                const value = this.data.settings[setting] || '';
                                const type = typeof value === 'boolean' ? 'checkbox' : 
                                           typeof value === 'number' ? 'number' : 'text';
                                
                                return `
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            ${setting.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </label>
                                        ${type === 'checkbox' ? 
                                            `<input type="checkbox" name="${setting}" ${value ? 'checked' : ''} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">` :
                                            `<input type="${type}" name="${setting}" value="${value}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">`
                                        }
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
                
                <div class="flex justify-end">
                    <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-save mr-2"></i>Save Settings
                    </button>
                </div>
            </form>
        `;
    }

    async saveSettings(formData) {
        try {
            const response = await fetch(`${this.apiBase}/settings.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Settings saved successfully', 'success');
                await this.loadDashboardData();
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('Failed to save settings', 'error');
        }
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} mr-2"></i>
            ${message}
        `;
        
        document.getElementById('notifications').appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    setupAutoRefresh() {
        // Refresh dashboard every 30 seconds
        setInterval(() => {
            if (this.currentTab === 'dashboard') {
                this.loadDashboardData();
            }
        }, 30000);
    }
}

// Global admin instance
let admin;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminDashboard();
});

// Global functions for UI interactions
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabElement = document.getElementById(tabName + '-tab');
    if (tabElement) tabElement.classList.remove('hidden');
    
    // Find and activate the button that was clicked
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    if (typeof admin !== 'undefined') {
        admin.currentTab = tabName;
        admin.updateCurrentTabContent();
    }
}

async function refreshAllData() {
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loader inline-block"></div><span class="ml-2">Refreshing...</span>';
    button.disabled = true;
    
    try {
        await admin.loadDashboardData();
        admin.showNotification('Data refreshed successfully', 'success');
    } catch (error) {
        admin.showNotification('Failed to refresh data', 'error');
    }
    
    button.innerHTML = originalText;
    button.disabled = false;
}

async function generateSampleActivity() {
    try {
        const response = await fetch(`${admin.apiBase}/live-activity.php?generate=true`);
        if (response.ok) {
            admin.showNotification('Sample activity generated', 'success');
            await admin.loadDashboardData();
        } else {
            throw new Error('Failed to generate sample activity');
        }
    } catch (error) {
        admin.showNotification('Failed to generate sample activity', 'error');
    }
}

function openProductModal() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = 'Add New Product';
    content.innerHTML = `
        <form onsubmit="saveProduct(event)" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Price (USD/kg)</label>
                    <input type="number" step="0.01" name="price" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity (MT)</label>
                    <input type="number" name="stock_quantity" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input type="text" name="grade" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="coffee">Coffee</option>
                        <option value="cocoa">Cocoa</option>
                    </select>
                </div>
                <div>
                    <label class="flex items-center mt-6">
                        <input type="checkbox" name="featured" class="w-4 h-4 text-blue-600 border-gray-300 rounded">
                        <span class="ml-2 text-sm text-gray-700">Featured Product</span>
                    </label>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Product</button>
            </div>
        </form>
    `;
    
    modal.classList.remove('hidden');
}

async function saveProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.featured = formData.has('featured');
    data.price = parseFloat(data.price);
    data.stock_quantity = parseInt(data.stock_quantity);
    
    try {
        const response = await fetch(`${admin.apiBase}/products.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            admin.showNotification('Product saved successfully', 'success');
            closeModal();
            await admin.loadDashboardData();
        } else {
            throw new Error('Failed to save product');
        }
    } catch (error) {
        admin.showNotification('Failed to save product', 'error');
    }
}

function saveSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        const input = event.target.querySelector(`[name="${key}"]`);
        if (input.type === 'checkbox') {
            data[key] = input.checked;
        } else if (input.type === 'number') {
            data[key] = parseFloat(value) || 0;
        } else {
            data[key] = value;
        }
    }
    
    admin.saveSettings(data);
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Placeholder functions for other modals
function openTestimonialModal() {
    admin.showNotification('Testimonial modal coming soon', 'warning');
}

function openActivityModal() {
    admin.showNotification('Activity modal coming soon', 'warning');
}

function editProduct(id) {
    const product = admin.data.products.find(p => p.id === id);
    if (!product) {
        admin.showNotification('Product not found', 'error');
        return;
    }

    // Create edit modal HTML
    const modalHTML = `
        <div id="edit-product-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Edit Product</h3>
                    <form id="edit-product-form" class="space-y-4">
                        <div>
                            <label for="edit-name" class="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" id="edit-name" name="name" value="${product.name}" 
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-price" class="block text-sm font-medium text-gray-700">Price (USD/MT)</label>
                            <input type="number" id="edit-price" name="price" value="${product.price}" step="0.01" 
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-stock" class="block text-sm font-medium text-gray-700">Stock Quantity (MT)</label>
                            <input type="number" id="edit-stock" name="stock_quantity" value="${product.stock}" 
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-grade" class="block text-sm font-medium text-gray-700">Grade</label>
                            <input type="text" id="edit-grade" name="grade" value="${product.grade || ''}" 
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-category" class="block text-sm font-medium text-gray-700">Category</label>
                            <select id="edit-category" name="category" 
                                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="coffee" ${product.category === 'coffee' ? 'selected' : ''}>Coffee</option>
                                <option value="cocoa" ${product.category === 'cocoa' ? 'selected' : ''}>Cocoa</option>
                            </select>
                        </div>
                        
                        <div>
                            <label for="edit-description" class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="edit-description" name="description" rows="3" 
                                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">${product.description || ''}</textarea>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex items-center">
                                <input type="checkbox" id="edit-defect-free" name="defect_free" ${product.defect_free ? 'checked' : ''} 
                                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                <label for="edit-defect-free" class="ml-2 block text-sm text-gray-900">🛡️ Defect-Free</label>
                            </div>
                            
                            <div class="flex items-center">
                                <input type="checkbox" id="edit-organic" name="organic" ${product.organic ? 'checked' : ''} 
                                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                <label for="edit-organic" class="ml-2 block text-sm text-gray-900">🌿 100% Organic</label>
                            </div>
                            
                            <div class="flex items-center">
                                <input type="checkbox" id="edit-featured" name="featured" ${product.featured ? 'checked' : ''} 
                                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                <label for="edit-featured" class="ml-2 block text-sm text-gray-900">⭐ Featured Product</label>
                            </div>
                            
                            <div class="flex items-center">
                                <input type="checkbox" id="edit-active" name="active" ${product.active !== false ? 'checked' : ''} 
                                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                <label for="edit-active" class="ml-2 block text-sm text-gray-900">✅ Active</label>
                            </div>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" onclick="closeEditProductModal()" 
                                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                Cancel
                            </button>
                            <button type="submit" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add form submit handler
    document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProductChanges(id);
    });
}

async function saveProductChanges(productId) {
    try {
        const form = document.getElementById('edit-product-form');
        const formData = new FormData(form);
        
        const updateData = {
            id: productId,
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            stock_quantity: parseInt(formData.get('stock_quantity')),
            grade: formData.get('grade'),
            category: formData.get('category'),
            description: formData.get('description'),
            defect_free: formData.has('defect_free'),
            organic: formData.has('organic'),
            featured: formData.has('featured'),
            active: formData.has('active')
        };

        const response = await fetch(`${admin.apiBase}/products.php`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (result.success) {
            admin.showNotification('Product updated successfully', 'success');
            closeEditProductModal();
            // Reload products data
            await admin.loadDashboardData();
        } else {
            throw new Error(result.message || 'Failed to update product');
        }

    } catch (error) {
        console.error('Error updating product:', error);
        admin.showNotification('Failed to update product: ' + error.message, 'error');
    }
}

function closeEditProductModal() {
    const modal = document.getElementById('edit-product-modal');
    if (modal) {
        modal.remove();
    }
}

function deleteProduct(id) {
    const product = admin.data.products.find(p => p.id === id);
    if (!product) {
        admin.showNotification('Product not found', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
        deleteProductConfirmed(id);
    }
}

async function deleteProductConfirmed(productId) {
    try {
        const response = await fetch(`${admin.apiBase}/products.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: productId })
        });

        const result = await response.json();

        if (result.success) {
            admin.showNotification('Product deleted successfully', 'success');
            // Reload products data
            await admin.loadDashboardData();
        } else {
            throw new Error(result.message || 'Failed to delete product');
        }

    } catch (error) {
        console.error('Error deleting product:', error);
        admin.showNotification('Failed to delete product: ' + error.message, 'error');
    }
}

function editTestimonial(id) {
    admin.showNotification('Edit testimonial feature coming soon', 'warning');
}

function deleteTestimonial(id) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        admin.showNotification('Delete testimonial feature coming soon', 'warning');
    }
}

function deleteActivity(id) {
    if (confirm('Are you sure you want to delete this activity?')) {
        admin.showNotification('Delete activity feature coming soon', 'warning');
    }
}

function openAddProductModal() {
    // Create add product modal HTML
    const modalHTML = `
        <div id="add-product-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Add New Product</h3>
                    <form id="add-product-form" class="space-y-4">
                        <div>
                            <label for="add-name" class="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" id="add-name" name="name" required
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="add-price" class="block text-sm font-medium text-gray-700">Price (USD/MT)</label>
                            <input type="number" id="add-price" name="price" step="0.01" required
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="add-stock" class="block text-sm font-medium text-gray-700">Stock Quantity (MT)</label>
                            <input type="number" id="add-stock" name="stock_quantity" value="0" required
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="add-grade" class="block text-sm font-medium text-gray-700">Grade</label>
                            <input type="text" id="add-grade" name="grade"
                                   class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="add-category" class="block text-sm font-medium text-gray-700">Category</label>
                            <select id="add-category" name="category" required
                                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="coffee">Coffee</option>
                                <option value="cocoa">Cocoa</option>
                            </select>
                        </div>
                        
                        <div>
                            <label for="add-description" class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="add-description" name="description" rows="3"
                                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="checkbox" id="add-featured" name="featured"
                                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="add-featured" class="ml-2 block text-sm text-gray-900">Featured Product</label>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" onclick="closeAddProductModal()" 
                                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                Cancel
                            </button>
                            <button type="submit" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add form submit handler
    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveNewProduct();
    });
}

async function saveNewProduct() {
    try {
        const form = document.getElementById('add-product-form');
        const formData = new FormData(form);
        
        const productData = {
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            stock_quantity: parseInt(formData.get('stock_quantity')),
            grade: formData.get('grade'),
            category: formData.get('category'),
            description: formData.get('description'),
            featured: formData.has('featured'),
            image_url: 'images/coffee_bag_beans.jpeg' // Default image
        };

        const response = await fetch(`${admin.apiBase}/products.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (result.success) {
            admin.showNotification('Product added successfully', 'success');
            closeAddProductModal();
            // Reload products data
            await admin.loadDashboardData();
        } else {
            throw new Error(result.message || 'Failed to add product');
        }

    } catch (error) {
        console.error('Error adding product:', error);
        admin.showNotification('Failed to add product: ' + error.message, 'error');
    }
}

function closeAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) {
        modal.remove();
    }
}

// Slideshow Management Functions
async function openSlideshowModal(slide = null) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = slide ? 'Edit Slide' : 'Add New Slide';
    
    content.innerHTML = `
        <form id="slide-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <input type="text" id="slide-chapter" value="${slide?.chapter || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Chapter 1" required>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                    <input type="text" id="slide-title-en" value="${slide?.title_en || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title (Chinese)</label>
                    <input type="text" id="slide-title-zh" value="${slide?.title_zh || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle (English)</label>
                <textarea id="slide-subtitle-en" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>${slide?.subtitle_en || ''}</textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle (Chinese)</label>
                <textarea id="slide-subtitle-zh" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>${slide?.subtitle_zh || ''}</textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Slide Image</label>
                <p class="text-xs text-gray-500 mb-2">📐 Recommended size: <strong>1920x1080px (Full HD)</strong> or <strong>1600x900px</strong> • JPG or PNG • Max 2MB</p>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-2 hover:border-blue-500 transition-colors">
                    <input type="file" id="slide-image-file" accept="image/jpeg,image/jpg,image/png" class="hidden" onchange="handleSlideImageUpload(event)">
                    <button type="button" onclick="document.getElementById('slide-image-file').click()" class="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        📁 Upload Image (1920x1080px recommended)
                    </button>
                    <div id="image-preview-container" class="mt-3 hidden">
                        <img id="image-preview" class="w-full h-48 object-cover rounded-lg border border-gray-300">
                        <p id="image-info" class="text-xs text-gray-500 mt-2"></p>
                    </div>
                </div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Or use image URL:</label>
                <input type="text" id="slide-image" value="${slide?.image_url || 'images/coffee_bag_beans.jpg'}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="images/your-image.jpg">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Button Text (English)</label>
                    <input type="text" id="slide-btn-en" value="${slide?.button_text_en || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Button Text (Chinese)</label>
                    <input type="text" id="slide-btn-zh" value="${slide?.button_text_zh || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input type="text" id="slide-link" value="${slide?.button_link || '#'}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input type="number" id="slide-position" value="${slide?.position || 1}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Autoplay Duration (ms)</label>
                <input type="number" id="slide-duration" value="${slide?.autoplay_duration || 6000}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" step="1000" required>
            </div>
            
            <div class="flex items-center">
                <input type="checkbox" id="slide-active" ${!slide || slide.active ? 'checked' : ''} class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="slide-active" class="text-sm font-medium text-gray-700">Active</label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    ${slide ? 'Update' : 'Add'} Slide
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('slide-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSlide(slide?.id);
    });
    
    modal.classList.remove('hidden');
    
    // Show preview if editing existing slide with image
    if (slide?.image_url) {
        const preview = document.getElementById('image-preview');
        const container = document.getElementById('image-preview-container');
        if (preview && container) {
            preview.src = slide.image_url;
            container.classList.remove('hidden');
        }
    }
}

function handleSlideImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image/(jpeg|jpg|png)')) {
        alert('❌ Please upload JPG or PNG image only');
        return;
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
        alert('❌ Image too large! Please use image under 2MB');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('image-preview');
        const container = document.getElementById('image-preview-container');
        const info = document.getElementById('image-info');
        const imageInput = document.getElementById('slide-image');
        
        // Create image to check dimensions
        const img = new Image();
        img.onload = function() {
            preview.src = e.target.result;
            container.classList.remove('hidden');
            
            // Show image info
            const sizeKB = (file.size / 1024).toFixed(1);
            info.textContent = `📏 ${img.width}x${img.height}px • ${sizeKB}KB • ${file.name}`;
            
            // Warn if not recommended size
            if (img.width < 1600 || img.height < 900) {
                info.textContent += ' ⚠️ Image smaller than recommended (1920x1080px)';
                info.classList.add('text-orange-600');
            } else if (img.width === 1920 && img.height === 1080) {
                info.textContent += ' ✅ Perfect size!';
                info.classList.add('text-green-600');
            }
            
            // Save to images folder (in production, this should upload to server)
            const imagePath = 'images/slideshow/' + file.name;
            imageInput.value = imagePath;
            
            // Note: In production, implement actual file upload to server here
            console.log('Image selected:', file.name, `(${img.width}x${img.height})`);
            console.log('⚠️ Remember to manually copy image to:', imagePath);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function saveSlide(slideId) {
    const slideData = {
        id: slideId,
        chapter: document.getElementById('slide-chapter').value,
        title_en: document.getElementById('slide-title-en').value,
        title_zh: document.getElementById('slide-title-zh').value,
        subtitle_en: document.getElementById('slide-subtitle-en').value,
        subtitle_zh: document.getElementById('slide-subtitle-zh').value,
        image_url: document.getElementById('slide-image').value,
        button_text_en: document.getElementById('slide-btn-en').value,
        button_text_zh: document.getElementById('slide-btn-zh').value,
        button_link: document.getElementById('slide-link').value,
        position: parseInt(document.getElementById('slide-position').value),
        autoplay_duration: parseInt(document.getElementById('slide-duration').value),
        active: document.getElementById('slide-active').checked ? 1 : 0
    };
    
    admin.showNotification(`Slide ${slideId ? 'updated' : 'added'} successfully! (Database setup required)`, 'success');
    closeModal();
    
    // Note: Actual API endpoint would need to be created for POST/PUT operations
    console.log('Slide data to save:', slideData);
}

// Awards Management Functions
async function openAwardModal(award = null) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = award ? 'Edit Award' : 'Add New Award';
    
    content.innerHTML = `
        <form id="award-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Award Title</label>
                <input type="text" id="award-title" value="${award?.title || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <input type="text" id="award-org" value="${award?.organization || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input type="number" id="award-year" value="${award?.year || new Date().getFullYear()}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="2000" max="2100" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="award-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${award?.description || ''}</textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Icon (FontAwesome)</label>
                    <input type="text" id="award-icon" value="${award?.icon || 'fa-award'}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="fa-trophy">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input type="text" id="award-category" value="${award?.category || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Excellence">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                <input type="text" id="award-image" value="${award?.image_url || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex items-center">
                <input type="checkbox" id="award-active" ${!award || award.active ? 'checked' : ''} class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="award-active" class="text-sm font-medium text-gray-700">Active</label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    ${award ? 'Update' : 'Add'} Award
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('award-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAward(award?.id);
    });
    
    modal.classList.remove('hidden');
}

async function saveAward(awardId) {
    const awardData = {
        id: awardId,
        title: document.getElementById('award-title').value,
        organization: document.getElementById('award-org').value,
        year: parseInt(document.getElementById('award-year').value),
        description: document.getElementById('award-description').value,
        icon: document.getElementById('award-icon').value,
        category: document.getElementById('award-category').value,
        image_url: document.getElementById('award-image').value,
        active: document.getElementById('award-active').checked ? 1 : 0
    };
    
    admin.showNotification(`Award ${awardId ? 'updated' : 'added'} successfully! (Database setup required)`, 'success');
    closeModal();
    
    // Note: Actual API endpoint would need to be created for POST/PUT operations
    console.log('Award data to save:', awardData);
}

// Certification Management Functions
function openCertificationModal(certId = null) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    const cert = certId ? admin.data.certifications.find(c => c.id === certId) : null;
    
    modalContent.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">${cert ? 'Edit' : 'Add'} Certification</h3>
            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
        
        <form id="certification-form" class="space-y-4">
            <div>
                <label for="cert-icon" class="block text-sm font-medium text-gray-700 mb-1">Icon Class (FontAwesome)</label>
                <input type="text" id="cert-icon" value="${cert?.icon || 'fas fa-certificate'}" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                <p class="text-xs text-gray-500 mt-1">Example: fas fa-certificate, fas fa-flag, fas fa-globe-asia</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="cert-title-en" class="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                    <input type="text" id="cert-title-en" value="${cert?.title_en || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label for="cert-title-zh" class="block text-sm font-medium text-gray-700 mb-1">Title (Chinese)</label>
                    <input type="text" id="cert-title-zh" value="${cert?.title_zh || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="cert-desc-en" class="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea id="cert-desc-en" rows="3" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>${cert?.description_en || ''}</textarea>
                </div>
                <div>
                    <label for="cert-desc-zh" class="block text-sm font-medium text-gray-700 mb-1">Description (Chinese)</label>
                    <textarea id="cert-desc-zh" rows="3" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>${cert?.description_zh || ''}</textarea>
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4">
                <div>
                    <label for="cert-badge1" class="block text-sm font-medium text-gray-700 mb-1">Badge 1</label>
                    <input type="text" id="cert-badge1" value="${cert?.badge1 || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="cert-badge2" class="block text-sm font-medium text-gray-700 mb-1">Badge 2</label>
                    <input type="text" id="cert-badge2" value="${cert?.badge2 || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="cert-badge3" class="block text-sm font-medium text-gray-700 mb-1">Badge 3</label>
                    <input type="text" id="cert-badge3" value="${cert?.badge3 || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="cert-order" class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input type="number" id="cert-order" value="${cert?.display_order || 0}" min="0"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="space-y-2">
                    <div class="flex items-center">
                        <input type="checkbox" id="cert-chinese" ${cert?.chinese_specific ? 'checked' : ''}
                               class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label for="cert-chinese" class="ml-2 text-sm font-medium text-gray-700">Chinese Specific (中国专用)</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="cert-active" ${cert?.active !== false ? 'checked' : ''}
                               class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label for="cert-active" class="ml-2 text-sm font-medium text-gray-700">Active</label>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    ${cert ? 'Update' : 'Add'} Certification
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('certification-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveCertification(cert?.id);
    });
    
    modal.classList.remove('hidden');
}

async function saveCertification(certId) {
    const certData = {
        id: certId,
        icon: document.getElementById('cert-icon').value,
        title_en: document.getElementById('cert-title-en').value,
        title_zh: document.getElementById('cert-title-zh').value,
        description_en: document.getElementById('cert-desc-en').value,
        description_zh: document.getElementById('cert-desc-zh').value,
        badge1: document.getElementById('cert-badge1').value,
        badge2: document.getElementById('cert-badge2').value,
        badge3: document.getElementById('cert-badge3').value,
        display_order: parseInt(document.getElementById('cert-order').value),
        chinese_specific: document.getElementById('cert-chinese').checked ? 1 : 0,
        active: document.getElementById('cert-active').checked ? 1 : 0
    };
    
    try {
        const method = certId ? 'PUT' : 'POST';
        const response = await fetch(`${admin.apiBase}/certifications.php`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(certData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            admin.showNotification(`Certification ${certId ? 'updated' : 'added'} successfully!`, 'success');
            closeModal();
            await admin.loadDashboardData();
            admin.renderCertificationsTable();
        } else {
            throw new Error(result.message || 'Failed to save certification');
        }
    } catch (error) {
        console.error('Error saving certification:', error);
        admin.showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteCertification(certId) {
    if (!confirm('Are you sure you want to delete this certification?')) {
        return;
    }
    
    try {
        const response = await fetch(`${admin.apiBase}/certifications.php?id=${certId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            admin.showNotification('Certification deleted successfully', 'success');
            await admin.loadDashboardData();
            admin.renderCertificationsTable();
        } else {
            throw new Error(result.message || 'Failed to delete certification');
        }
    } catch (error) {
        console.error('Error deleting certification:', error);
        admin.showNotification('Error: ' + error.message, 'error');
    }
}

// ============================================
// CONTACT INFORMATION MANAGEMENT
// ============================================

async function loadContactInfo() {
    try {
        const response = await fetch(`${admin.apiBase}/contact-info.php`);
        const result = await response.json();
        
        if (result.success && result.contact) {
            const contact = result.contact;
            
            // Populate form fields
            document.getElementById('street-address').value = contact.street_address || '';
            document.getElementById('po-box').value = contact.po_box || '';
            document.getElementById('city').value = contact.city || '';
            document.getElementById('country').value = contact.country || '';
            document.getElementById('primary-phone').value = contact.primary_phone || '';
            document.getElementById('secondary-phone').value = contact.secondary_phone || '';
            document.getElementById('whatsapp-phone').value = contact.whatsapp_phone || '';
            document.getElementById('primary-email').value = contact.primary_email || '';
            document.getElementById('secondary-email').value = contact.secondary_email || '';
            document.getElementById('facebook-link').value = contact.facebook_link || '';
            document.getElementById('twitter-link').value = contact.twitter_link || '';
            document.getElementById('linkedin-link').value = contact.linkedin_link || '';
            document.getElementById('instagram-link').value = contact.instagram_link || '';
            document.getElementById('years-experience').value = contact.years_experience || '5yrs+';
            document.getElementById('export-tonnage').value = contact.export_tonnage || '200+ tons';
        }
    } catch (error) {
        console.error('Error loading contact info:', error);
        admin.showNotification('Error loading contact information', 'error');
    }
}

// Handle contact info form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-info-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const contactData = {
                street_address: document.getElementById('street-address').value,
                po_box: document.getElementById('po-box').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value,
                primary_phone: document.getElementById('primary-phone').value,
                secondary_phone: document.getElementById('secondary-phone').value,
                whatsapp_phone: document.getElementById('whatsapp-phone').value,
                primary_email: document.getElementById('primary-email').value,
                secondary_email: document.getElementById('secondary-email').value,
                facebook_link: document.getElementById('facebook-link').value,
                twitter_link: document.getElementById('twitter-link').value,
                linkedin_link: document.getElementById('linkedin-link').value,
                instagram_link: document.getElementById('instagram-link').value,
                years_experience: document.getElementById('years-experience').value,
                export_tonnage: document.getElementById('export-tonnage').value
            };
            
            try {
                const response = await fetch(`${admin.apiBase}/contact-info.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    admin.showNotification('Contact information saved successfully!', 'success');
                } else {
                    throw new Error(result.error || 'Failed to save contact information');
                }
            } catch (error) {
                console.error('Error saving contact info:', error);
                admin.showNotification('Error: ' + error.message, 'error');
            }
        });
    }
    
    // Load contact info when tab is shown
    const contactTab = document.querySelector('[onclick*="showTab(\'contact-info\')"]');
    if (contactTab) {
        contactTab.addEventListener('click', function() {
            setTimeout(() => {
                loadContactInfo();
            }, 100);
        });
    }
});

// ============================================
// PRODUCT IMAGE UPLOAD
// ============================================

function openImageUploadModal(productId, productName) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = `Upload Image for ${productName}`;
    modalContent.innerHTML = `
        <form id="image-upload-form" enctype="multipart/form-data">
            <input type="hidden" name="product_id" value="${productId}">
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Select Product Image
                </label>
                <input type="file" 
                       name="image" 
                       id="product-image-input"
                       accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                       required>
                <p class="text-xs text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, GIF, WebP (Max 5MB)
                </p>
            </div>
            
            <div id="image-preview" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <img id="preview-img" src="" alt="Preview" class="max-w-full h-48 object-contain border rounded">
            </div>
            
            <div class="flex justify-end space-x-2">
                <button type="button" 
                        onclick="closeModal()" 
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" 
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <i class="fas fa-upload mr-2"></i>Upload Image
                </button>
            </div>
        </form>
    `;
    
    modal.classList.remove('hidden');
    
    // Image preview
    const fileInput = document.getElementById('product-image-input');
    const previewDiv = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewDiv.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    const form = document.getElementById('image-upload-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch(`${admin.apiBase}/product-image.php`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                admin.showNotification('Image uploaded successfully!', 'success');
                closeModal();
                await admin.loadDashboardData();
                admin.renderProductsTable();
            } else {
                throw new Error(result.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            admin.showNotification('Error: ' + error.message, 'error');
        }
    });
}

async function deleteProductImage(productId) {
    if (!confirm('Are you sure you want to delete this product image?')) {
        return;
    }
    
    try {
        const response = await fetch(`${admin.apiBase}/product-image.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: productId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            admin.showNotification('Image deleted successfully', 'success');
            await admin.loadDashboardData();
            admin.renderProductsTable();
        } else {
            throw new Error(result.error || 'Failed to delete image');
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        admin.showNotification('Error: ' + error.message, 'error');
    }
}


// Quality Badges Management Functions
async function openQualityBadgeModal(badgeId = null) {
    const badge = badgeId ? admin.data.qualityBadges.find(b => b.id === badgeId) : null;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = badge ? 'Edit Quality Badge' : 'Add New Quality Badge';
    
    content.innerHTML = `
        <form id="quality-badge-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Icon (FontAwesome)</label>
                <input type="text" id="badge-icon" value="${badge?.icon || 'fa-shield-alt'}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="fa-shield-alt" required>
                <p class="text-xs text-gray-500 mt-1">FontAwesome icon class</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                    <input type="text" id="badge-title-en" value="${badge?.title_en || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title (Chinese)</label>
                    <input type="text" id="badge-title-zh" value="${badge?.title_zh || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                <textarea id="badge-desc-en" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>${badge?.description_en || ''}</textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (Chinese)</label>
                <textarea id="badge-desc-zh" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>${badge?.description_zh || ''}</textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                    <input type="text" id="badge-text" value="${badge?.badge_text || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Guaranteed" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input type="number" id="badge-position" value="${badge?.position || 1}" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>
            
            <div>
                <label class="flex items-center">
                    <input type="checkbox" id="badge-active" ${!badge || badge.active ? 'checked' : ''}  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <span class="text-sm font-medium text-gray-700">Active</span>
                </label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    ${badge ? 'Update' : 'Add'} Badge
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('quality-badge-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            id: badgeId || null,
            icon: document.getElementById('badge-icon').value,
            title_en: document.getElementById('badge-title-en').value,
            title_zh: document.getElementById('badge-title-zh').value,
            description_en: document.getElementById('badge-desc-en').value,
            description_zh: document.getElementById('badge-desc-zh').value,
            badge_text: document.getElementById('badge-text').value,
            position: parseInt(document.getElementById('badge-position').value),
            active: document.getElementById('badge-active').checked ? 1 : 0
        };
        
        try {
            const response = await fetch(`/quality-badges.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                admin.showNotification(result.message, 'success');
                closeModal();
                await admin.loadDashboardData();
                admin.renderQualityBadgesTable();
            } else {
                throw new Error(result.error || 'Failed to save quality badge');
            }
        } catch (error) {
            admin.showNotification('Error: ' + error.message, 'error');
        }
    });
    
    modal.classList.remove('hidden');
}

async function deleteQualityBadge(badgeId) {
    if (!confirm('Are you sure you want to delete this quality badge?')) {
        return;
    }
    
    try {
        const response = await fetch(`/quality-badges.php?id=${badgeId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            admin.showNotification('Quality badge deleted successfully', 'success');
            await admin.loadDashboardData();
            admin.renderQualityBadgesTable();
        } else {
            throw new Error(result.error || 'Failed to delete quality badge');
        }
    } catch (error) {
        admin.showNotification('Error: ' + error.message, 'error');
    }
}
