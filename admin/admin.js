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
            const response = await fetch(`${this.apiBase}/products.php`);
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
            // Load all data in parallel
            const [products, testimonials, activities, settings] = await Promise.all([
                this.fetchData('products.php'),
                this.fetchData('testimonials.php'),
                this.fetchData('live-activity.php'),
                this.fetchData('settings.php')
            ]);

            this.data.products = products?.data?.products || [];
            this.data.testimonials = testimonials?.data?.testimonials || [];
            this.data.activities = activities?.data?.activities || [];
            this.data.settings = settings?.data?.settings || {};

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
        document.getElementById('total-products').textContent = this.data.products.length;
        
        const totalStock = this.data.products.reduce((sum, product) => sum + (product.stock || 0), 0);
        document.getElementById('total-stock').textContent = `${totalStock} MT`;
        
        document.getElementById('total-testimonials').textContent = this.data.testimonials.length;
        
        const todayActivities = this.data.activities.filter(activity => {
            const activityDate = new Date(activity.time).toDateString();
            const today = new Date().toDateString();
            return activityDate === today;
        });
        document.getElementById('today-activity').textContent = todayActivities.length;

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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${this.data.products.map(product => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900">${product.name}</div>
                                        <div class="text-sm text-gray-500">${product.grade || ''}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${product.price}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.stock} MT</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.category}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                        ${product.featured ? 'Featured' : 'Regular'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onclick="editProduct(${product.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">
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
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    event.target.classList.add('active');
    
    admin.currentTab = tabName;
    admin.updateCurrentTabContent();
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
                        
                        <div class="flex items-center">
                            <input type="checkbox" id="edit-featured" name="featured" ${product.featured ? 'checked' : ''} 
                                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="edit-featured" class="ml-2 block text-sm text-gray-900">Featured Product</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="checkbox" id="edit-active" name="active" ${product.active !== false ? 'checked' : ''} 
                                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="edit-active" class="ml-2 block text-sm text-gray-900">Active</label>
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