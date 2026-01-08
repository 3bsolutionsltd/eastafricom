<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>East Africom - Admin Dashboard</title>
    <!-- Authentication Check - Must be first -->
    <script src="auth-check.js?v=<?php echo time(); ?>"></script>
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio"></script>
    <script>
        // Suppress Tailwind production warning in development
        if (window.Tailwind) {
            window.Tailwind.config = { corePlugins: { preflight: false } };
        }
    </script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .tab-btn.active {
            background-color: #3b82f6;
            color: white;
        }
        .loader {
            border: 2px solid #f3f4f6;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .status-online { color: #10b981; }
        .status-offline { color: #ef4444; }
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        .notification.success { background-color: #10b981; }
        .notification.error { background-color: #ef4444; }
        .notification.warning { background-color: #f59e0b; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-gray-900">East Africom Admin</h1>
                    <div class="ml-4 flex items-center">
                        <span class="w-2 h-2 rounded-full mr-2" id="connection-status"></span>
                        <span class="text-sm text-gray-500" id="connection-text">Connecting...</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-600" id="userInfo">Loading...</span>
                    <button onclick="refreshAllData()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-sync-alt mr-2"></i>Refresh All
                    </button>
                    <a href="../index.html" target="_blank" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                        <i class="fas fa-external-link-alt mr-2"></i>View Site
                    </a>
                    <button id="logoutBtn" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Navigation Tabs -->
        <div class="mb-6">
            <nav class="flex flex-wrap gap-2">
                <button onclick="showTab('dashboard')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm active whitespace-nowrap">
                    <i class="fas fa-chart-dashboard mr-1"></i>Dashboard
                </button>
                <button onclick="showTab('products')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-coffee mr-1"></i>Products
                </button>
                <button onclick="showTab('contact-info')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-address-card mr-1"></i>Contact
                </button>
                <button onclick="showTab('slideshow')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-images mr-1"></i>Slideshow
                </button>
                <button onclick="showTab('testimonials')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-quote-left mr-1"></i>Reviews
                </button>
                <button onclick="showTab('awards')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-trophy mr-1"></i>Awards
                </button>
                <button onclick="showTab('certifications')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-certificate mr-1"></i>Certifications
                </button>
                <button onclick="showTab('quality-badges')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-shield-alt mr-1"></i>Quality
                </button>
                <button onclick="showTab('activity')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-chart-line mr-1"></i>Activity
                </button>
                <button onclick="showTab('sections')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-th-large mr-1"></i>Sections
                </button>
                <button onclick="showTab('settings')" class="tab-btn px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
                    <i class="fas fa-cog mr-1"></i>Settings
                </button>
            </nav>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard-tab" class="tab-content">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <!-- Stats Cards -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-500">Slideshow Slides</h3>
                        <i class="fas fa-images text-blue-500"></i>
                    </div>
                    <p class="text-3xl font-bold text-gray-900" id="stat-slides">-</p>
                    <p class="text-xs text-gray-500 mt-1">Active slides</p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-500">Awards</h3>
                        <i class="fas fa-trophy text-yellow-500"></i>
                    </div>
                    <p class="text-3xl font-bold text-gray-900" id="stat-awards">-</p>
                    <p class="text-xs text-gray-500 mt-1">Recognition items</p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-lg">
                            <i class="fas fa-coffee text-blue-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Products</p>
                            <p class="text-2xl font-semibold text-gray-900" id="total-products">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-lg">
                            <i class="fas fa-warehouse text-green-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Stock</p>
                            <p class="text-2xl font-semibold text-gray-900" id="total-stock">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="flex items-center">
                        <div class="p-2 bg-purple-100 rounded-lg">
                            <i class="fas fa-star text-purple-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Testimonials</p>
                            <p class="text-2xl font-semibold text-gray-900" id="total-testimonials">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="flex items-center">
                        <div class="p-2 bg-orange-100 rounded-lg">
                            <i class="fas fa-chart-line text-orange-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Today's Activity</p>
                            <p class="text-2xl font-semibold text-gray-900" id="today-activity">-</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div class="p-6">
                    <div id="dashboard-activity" class="space-y-3">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading activity...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Products Tab -->
        <div id="products-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-900">Products Management</h2>
                    <button onclick="openProductModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-plus mr-2"></i>Add Product
                    </button>
                </div>
                <div class="p-6">
                    <div id="products-table">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading products...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Testimonials Tab -->
        <div id="testimonials-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-900">Testimonials Management</h2>
                    <button onclick="openTestimonialModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-plus mr-2"></i>Add Testimonial
                    </button>
                </div>
                <div class="p-6">
                    <div id="testimonials-table">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading testimonials...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Slideshow Tab -->
        <div id="slideshow-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-900">Slideshow Management</h2>
                    <button onclick="openSlideshowModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-plus mr-2"></i>Add Slide
                    </button>
                </div>
                <div class="p-6">
                    <div id="slideshow-table">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading slideshow...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Awards Tab -->
        <div id="awards-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-900">Awards & Recognition</h2>
                    <button onclick="openAwardModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-plus mr-2"></i>Add Award
                    </button>
                </div>
                <div class="p-6">
                    <div id="awards-table">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading awards...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Certifications Tab -->
        <div id="certifications-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-900">Certifications & Standards</h2>
                    <button onclick="openCertificationModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-plus mr-2"></i>Add Certification
                    </button>
                </div>
                <div class="p-6">
                    <div id="certifications-table">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading certifications...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quality Badges Tab -->
        <div id="quality-badges-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-900">Quality Assurance Badges</h2>
                    <button onclick="openQualityBadgeModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-plus mr-2"></i>Add Badge
                    </button>
                </div>
                <div class="p-6">
                    <div id="quality-badges-table">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading quality badges...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Live Activity Tab -->
        <div id="activity-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-900">Live Activity Management</h2>
                    <div class="space-x-2">
                        <button onclick="generateSampleActivity()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                            <i class="fas fa-magic mr-2"></i>Generate Sample
                        </button>
                        <button onclick="openActivityModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            <i class="fas fa-plus mr-2"></i>Add Activity
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div id="activity-table">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading activity...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Settings Tab -->
        <div id="settings-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">Admin Settings</h2>
                </div>
                
                <!-- Password Change Section -->
                <div class="mx-6 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">🔐 Password Management</h3>
                    <p class="text-gray-600 mb-4">Keep your account secure by regularly updating your password</p>
                    <a href="change-password.html" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-key mr-2"></i>Change Password
                    </a>
                </div>
                
                <div class="p-6">
                    <div id="settings-form">
                        <div class="flex items-center justify-center py-8">
                            <div class="loader"></div>
                            <span class="ml-3 text-gray-500">Loading settings...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Info Tab -->
        <div id="contact-info-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">Contact & Address Information</h2>
                    <p class="text-sm text-gray-500 mt-1">Manage your company's contact details and address</p>
                </div>
                <div class="p-6">
                    <form id="contact-info-form" class="space-y-6">
                        <!-- Company Address Section -->
                        <div class="border-b pb-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-building text-blue-500 mr-2"></i>
                                Company Address
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                    <input type="text" id="street-address" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="Mulago - Kampala" placeholder="Enter street address">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">P.O Box</label>
                                    <input type="text" id="po-box" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="421481 - Mbarara" placeholder="Enter P.O Box">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input type="text" id="city" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="Kampala" placeholder="Enter city">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input type="text" id="country" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="UGANDA" placeholder="Enter country">
                                </div>
                            </div>
                        </div>

                        <!-- Contact Numbers Section -->
                        <div class="border-b pb-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-phone text-green-500 mr-2"></i>
                                Phone Numbers
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Primary Phone</label>
                                    <input type="tel" id="primary-phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="+256 776 701 003" placeholder="+256 XXX XXX XXX">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                                    <input type="tel" id="secondary-phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="+256 754 701 003" placeholder="+256 XXX XXX XXX">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                                    <input type="tel" id="whatsapp-phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="+256 776 701 003" placeholder="+256 XXX XXX XXX">
                                </div>
                            </div>
                        </div>

                        <!-- Email Addresses Section -->
                        <div class="border-b pb-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-envelope text-red-500 mr-2"></i>
                                Email Addresses
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
                                    <input type="email" id="primary-email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="frank.asiimwe@eastafricom.com" placeholder="email@company.com">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Secondary Email</label>
                                    <input type="email" id="secondary-email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="" placeholder="support@company.com">
                                </div>
                            </div>
                        </div>

                        <!-- Social Media Section -->
                        <div class="border-b pb-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-share-alt text-purple-500 mr-2"></i>
                                Social Media Links
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                                    <input type="url" id="facebook-link" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://facebook.com/yourpage">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Twitter/X</label>
                                    <input type="url" id="twitter-link" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://twitter.com/yourpage">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                                    <input type="url" id="linkedin-link" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://linkedin.com/company/yourcompany">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                                    <input type="url" id="instagram-link" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://instagram.com/yourpage">
                                </div>
                            </div>
                        </div>

                        <!-- Company Stats -->
                        <div class="pb-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-chart-bar text-orange-500 mr-2"></i>
                                Company Statistics
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                                    <input type="text" id="years-experience" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="5yrs+" placeholder="e.g., 5yrs+">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Export Tonnage</label>
                                    <input type="text" id="export-tonnage" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="200+ tons" placeholder="e.g., 200+ tons">
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" onclick="loadContactInfo()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                <i class="fas fa-undo mr-2"></i>Reset
                            </button>
                            <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                <i class="fas fa-save mr-2"></i>Save Contact Info
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Section Manager Tab -->
        <div id="sections-tab" class="tab-content hidden">
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">Section Visibility Manager</h2>
                    <p class="text-sm text-gray-500 mt-1">Control which sections appear on your website</p>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <!-- Hero Section -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-blue-100 rounded-lg">
                                    <i class="fas fa-images text-blue-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Hero Slideshow</h3>
                                    <p class="text-sm text-gray-500">Main slideshow at the top of the page</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-hero" onchange="toggleSection('hero', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Trust Widget -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-green-100 rounded-lg">
                                    <i class="fas fa-shield-alt text-green-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Trust Widget</h3>
                                    <p class="text-sm text-gray-500">Certifications and partner logos</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-trust-widget" onchange="toggleSection('trustWidget', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- About Section -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-purple-100 rounded-lg">
                                    <i class="fas fa-info-circle text-purple-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">About Section</h3>
                                    <p class="text-sm text-gray-500">Company information and mission</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-about" onchange="toggleSection('about', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Green Process -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-green-100 rounded-lg">
                                    <i class="fas fa-leaf text-green-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Green Process</h3>
                                    <p class="text-sm text-gray-500">Sustainability and organic practices</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-green-process" onchange="toggleSection('greenProcess', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Green Services -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-emerald-100 rounded-lg">
                                    <i class="fas fa-concierge-bell text-emerald-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Green Services</h3>
                                    <p class="text-sm text-gray-500">Services we provide</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-green-services" onchange="toggleSection('greenServices', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Products Section -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-yellow-100 rounded-lg">
                                    <i class="fas fa-coffee text-yellow-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Products Section</h3>
                                    <p class="text-sm text-gray-500">Coffee varieties and offerings</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-products" onchange="toggleSection('products', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Awards Section -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-orange-100 rounded-lg">
                                    <i class="fas fa-trophy text-orange-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Awards & Recognition</h3>
                                    <p class="text-sm text-gray-500">Achievements and accolades</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-awards" onchange="toggleSection('awards', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Testimonials -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-indigo-100 rounded-lg">
                                    <i class="fas fa-quote-left text-indigo-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Testimonials</h3>
                                    <p class="text-sm text-gray-500">Customer reviews and feedback</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-testimonials" onchange="toggleSection('testimonials', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <!-- Contact Section -->
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                            <div class="flex items-center space-x-4">
                                <div class="p-3 bg-red-100 rounded-lg">
                                    <i class="fas fa-envelope text-red-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Contact Section</h3>
                                    <p class="text-sm text-gray-500">Contact form and information</p>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="toggle-contact" onchange="toggleSection('contact', this.checked)">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="mt-6 flex justify-end space-x-3">
                        <button onclick="resetSections()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            <i class="fas fa-undo mr-2"></i>Reset to Defaults
                        </button>
                        <button onclick="saveSections()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            <i class="fas fa-save mr-2"></i>Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div id="modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden z-50">
        <div class="flex justify-center items-center h-full p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 id="modal-title" class="text-lg font-medium text-gray-900">Modal Title</h3>
                        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div id="modal-content">
                        <!-- Modal content will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Notification Container -->
    <div id="notifications"></div>

    <script src="section-manager.js?v=<?php echo time(); ?>"></script>
    <script src="admin.js?v=<?php echo time(); ?>"></script>
    <script>
        // Update user info in header
        window.updateUserInfo = function(user) {
            const userInfoEl = document.getElementById('userInfo');
            if (userInfoEl && user) {
                userInfoEl.innerHTML = `<i class="fas fa-user-circle mr-1"></i> ${user.username}`;
            }
        };
    </script>
</body>
</html>