// TRUST & CREDIBILITY BOOSTERS - Phase 7
console.log('Trust & credibility features loading...');

// Trust badges and certifications data
const trustData = {
    certifications: [
        {
            name: 'ISO 9001:2015',
            icon: '🏆',
            description: 'Quality Management System',
            badge: 'International Standard',
            color: '#2563eb'
        },
        {
            name: 'HACCP Certified',
            icon: '🛡️',
            description: 'Food Safety Management',
            badge: 'Food Safety',
            color: '#059669'
        },
        {
            name: 'Organic Certified',
            icon: '🌱',
            description: 'Organic Agriculture Compliance',
            badge: 'Eco-Friendly',
            color: '#16a34a'
        },
        {
            name: 'Fair Trade Certified',
            icon: '🤝',
            description: 'Ethical Trading Standards',
            badge: 'Social Impact',
            color: '#dc2626'
        },
        {
            name: 'Uganda Export Certified',
            icon: '🇺🇬',
            description: 'Government Export License',
            badge: 'Legal Compliance',
            color: '#7c3aed'
        },
        {
            name: 'International Trade Certified',
            icon: '🌍',
            description: 'Global Trade Standards',
            badge: 'Worldwide',
            color: '#ea580c'
        }
    ],
    awards: [
        {
            year: '2024',
            title: 'Best Coffee Exporter - East Africa',
            organization: 'African Coffee Association',
            icon: '🥇'
        },
        {
            year: '2023',
            title: 'Sustainable Agriculture Award',
            organization: 'Uganda Ministry of Agriculture',
            icon: '🌿'
        },
        {
            year: '2023',
            title: 'Top Export Performance',
            organization: 'Uganda Export Promotion Board',
            icon: '📈'
        },
        {
            year: '2022',
            title: 'Quality Excellence in Cocoa',
            organization: 'International Cocoa Organization',
            icon: '🍫'
        }
    ],
    securityGuarantees: [
        {
            title: 'Payment Security',
            description: 'Bank-guaranteed transactions with escrow protection',
            icon: '🔒',
            features: ['Escrow Protection', 'Bank Guarantees', 'Insurance Coverage']
        },
        {
            title: 'Quality Assurance',
            description: 'Pre-shipment inspection and quality certification',
            icon: '✅',
            features: ['Pre-shipment Inspection', 'Quality Certificates', 'Sample Approval']
        },
        {
            title: 'Delivery Guarantee',
            description: 'On-time delivery with tracking and insurance',
            icon: '🚢',
            features: ['Shipment Tracking', 'Delivery Insurance', 'Timeline Guarantee']
        },
        {
            title: 'Support Guarantee',
            description: '24/7 customer support and communication',
            icon: '📞',
            features: ['24/7 Support', 'Direct Communication', 'Issue Resolution']
        }
    ]
};

// Live trust signals
const trustSignals = {
    liveCounters: {
        activeOrders: 127,
        onlineClients: 34,
        shipmentsToday: 8,
        countriesServed: 42
    },
    recentActivity: [
        { action: 'New order placed', location: 'Germany', amount: '$89,000', time: '2 minutes ago' },
        { action: 'Shipment delivered', location: 'Netherlands', amount: '$156,000', time: '8 minutes ago' },
        { action: 'Quality inspection passed', location: 'China', amount: '$234,000', time: '15 minutes ago' },
        { action: 'Contract signed', location: 'USA', amount: '$78,000', time: '23 minutes ago' },
        { action: 'Payment received', location: 'Belgium', amount: '$145,000', time: '31 minutes ago' }
    ]
};

// 1. Enhanced Certifications Section
function enhanceCertificationsSection() {
    const certificationsSection = document.querySelector('#certifications .certifications-grid');
    if (certificationsSection) {
        certificationsSection.innerHTML = `
            <!-- Trust Header -->
            <div style="text-align: center; margin-bottom: 40px; grid-column: 1 / -1;">
                <h2 style="font-size: 32px; font-weight: 700; color: #1f2937; margin-bottom: 15px;">
                    🛡️ Trusted by Global Buyers Worldwide
                </h2>
                <p style="font-size: 16px; color: #6b7280; max-width: 600px; margin: 0 auto;">
                    Our certifications and awards demonstrate our commitment to quality, safety, and ethical trading practices.
                </p>
            </div>
            
            <!-- Certifications Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 50px; grid-column: 1 / -1;">
                ${trustData.certifications.map(cert => `
                    <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; transition: transform 0.3s ease, box-shadow 0.3s ease;" 
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.15)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 28px; margin-right: 15px;">${cert.icon}</div>
                            <div>
                                <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0;">${cert.name}</h3>
                                <span style="background: ${cert.color}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${cert.badge}</span>
                            </div>
                        </div>
                        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">${cert.description}</p>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #f3f4f6;">
                            <span style="color: ${cert.color}; font-size: 12px; font-weight: 600;">✓ Verified & Current</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Awards Section -->
            <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 20px; padding: 40px; margin-bottom: 50px; grid-column: 1 / -1;">
                <h3 style="text-align: center; font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 30px;">
                    🏆 Recent Awards & Recognition
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    ${trustData.awards.map(award => `
                        <div style="background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                            <div style="font-size: 32px; margin-bottom: 10px;">${award.icon}</div>
                            <div style="background: #fbbf24; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-bottom: 10px; display: inline-block;">${award.year}</div>
                            <h4 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 8px 0;">${award.title}</h4>
                            <p style="font-size: 13px; color: #6b7280; margin: 0;">${award.organization}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Security Guarantees -->
            <div style="grid-column: 1 / -1;">
                <h3 style="text-align: center; font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 30px;">
                    🔐 Your Security is Our Priority
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px;">
                    ${trustData.securityGuarantees.map(guarantee => `
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); border-left: 4px solid #10b981;">
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <div style="font-size: 24px; margin-right: 12px;">${guarantee.icon}</div>
                                <h4 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0;">${guarantee.title}</h4>
                            </div>
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px; line-height: 1.5;">${guarantee.description}</p>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${guarantee.features.map(feature => `
                                    <div style="display: flex; align-items: center; font-size: 13px; color: #374151;">
                                        <span style="color: #10b981; margin-right: 8px;">✓</span>
                                        ${feature}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        console.log('Enhanced certifications section created');
    }
}

// 2. Live Trust Signals Widget - Badge Style
function createLiveTrustSignals() {
    // Create the compact trust badge
    const trustBadge = document.createElement('div');
    trustBadge.innerHTML = `
        <!-- Trust Badge (Always Visible) -->
        <div id="trustBadge" style="position: fixed; left: 20px; bottom: 100px; z-index: 999; cursor: pointer;" onclick="toggleTrustWidget()">
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 16px; border-radius: 25px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4); transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; min-width: 120px; justify-content: center;" onmouseover="this.style.transform='translateY(-2px) scale(1.05)'; this.style.boxShadow='0 6px 25px rgba(16, 185, 129, 0.5)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 4px 20px rgba(16, 185, 129, 0.4)'">
                <span style="font-size: 16px;">📊</span>
                <div>
                    <div style="font-size: 11px; opacity: 0.9; line-height: 1;">LIVE</div>
                    <div style="font-size: 13px; font-weight: 700;">TRUST</div>
                </div>
                <div id="trustBadgeIndicator" style="width: 8px; height: 8px; background: #fff; border-radius: 50%; animation: pulse 2s infinite; margin-left: 4px;"></div>
            </div>
        </div>

        <!-- Expandable Trust Widget (Hidden by Default) -->
        <div id="trustWidget" style="position: fixed; left: 20px; bottom: 100px; z-index: 998; max-width: 320px; display: none; animation: slideUpFade 0.3s ease;">
            <!-- Live Counter Card -->
            <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 15px; border: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; display: flex; align-items: center; gap: 8px;">
                        📊 Live Activity
                    </h4>
                    <button onclick="closeTrustWidget()" style="background: #f3f4f6; border: none; color: #6b7280; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.3s ease;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">×</button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 12px;">
                    <div style="text-align: center; padding: 10px; background: #f0fdf4; border-radius: 8px;">
                        <div style="font-size: 18px; font-weight: 700; color: #10b981;" id="activeOrders">${trustSignals.liveCounters.activeOrders}</div>
                        <div style="color: #15803d; font-weight: 500;">Active Orders</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: #eff6ff; border-radius: 8px;">
                        <div style="font-size: 18px; font-weight: 700; color: #3b82f6;" id="onlineClients">${trustSignals.liveCounters.onlineClients}</div>
                        <div style="color: #1d4ed8; font-weight: 500;">Online Now</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: #fefce8; border-radius: 8px;">
                        <div style="font-size: 18px; font-weight: 700; color: #f59e0b;" id="shipmentsToday">${trustSignals.liveCounters.shipmentsToday}</div>
                        <div style="color: #a16207; font-weight: 500;">Shipped Today</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: #faf5ff; border-radius: 8px;">
                        <div style="font-size: 18px; font-weight: 700; color: #8b5cf6;" id="countriesServed">${trustSignals.liveCounters.countriesServed}</div>
                        <div style="color: #7c3aed; font-weight: 500;">Countries</div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Activity Card -->
            <div style="background: white; border-radius: 15px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; max-height: 280px; overflow: hidden;">
                <h4 style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                    ⚡ Recent Activity
                </h4>
                <div id="activityList" style="max-height: 160px; overflow-y: auto;">
                    ${trustSignals.recentActivity.slice(0, 4).map((activity, index) => `
                        <div style="padding: 10px 0; border-bottom: ${index < 3 ? '1px solid #f3f4f6' : 'none'}; font-size: 11px;">
                            <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">${activity.action}</div>
                            <div style="color: #6b7280; margin-bottom: 3px;">📍 ${activity.location} • ${activity.amount}</div>
                            <div style="color: #10b981; font-size: 10px; font-weight: 500;">${activity.time}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #f3f4f6;">
                    <button onclick="showActivityDashboard()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 6px;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                        <span>📈</span> View Full Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(trustBadge.firstElementChild);
    document.body.appendChild(trustBadge.lastElementChild);
    
    // Start live updates
    startLiveCounters();
    startActivityFeed();
    
    // Close widget when clicking outside
    document.addEventListener('click', function(event) {
        const widget = document.getElementById('trustWidget');
        const badge = document.getElementById('trustBadge');
        
        if (widget && widget.style.display === 'block' && 
            !widget.contains(event.target) && 
            !badge.contains(event.target)) {
            closeTrustWidget();
        }
    });
    
    console.log('Live trust badge created');
}

// 3. Trust Badge Floating Notifications
function createFloatingTrustNotifications() {
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            showFloatingNotification();
        }
    }, 15000); // Every 15 seconds
}

function showFloatingNotification() {
    const notifications = [
        { text: "🎉 New order from Germany: $89,000", type: "success" },
        { text: "✅ Quality inspection passed: Premium Coffee", type: "info" },
        { text: "🚢 Shipment delivered to Netherlands", type: "success" },
        { text: "📋 ISO 9001 certificate renewed", type: "trust" },
        { text: "🤝 New client from China joined", type: "social" }
    ];
    
    const notification = notifications[Math.floor(Math.random() * notifications.length)];
    const colors = {
        success: '#10b981',
        info: '#3b82f6',
        trust: '#8b5cf6',
        social: '#f59e0b'
    };
    
    const floatingDiv = document.createElement('div');
    floatingDiv.innerHTML = `
        <div style="position: fixed; top: 180px; right: 20px; background: white; border-left: 4px solid ${colors[notification.type]}; border-radius: 8px; padding: 15px 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); z-index: 9998; max-width: 300px; animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 4.5s forwards;">
            <div style="font-size: 13px; color: #1f2937; font-weight: 500;">${notification.text}</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 5px;">Just now</div>
        </div>
    `;
    
    document.body.appendChild(floatingDiv.firstElementChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (floatingDiv.firstElementChild && floatingDiv.firstElementChild.parentNode) {
            floatingDiv.firstElementChild.remove();
        }
    }, 5000);
}

// Utility Functions
function startLiveCounters() {
    setInterval(() => {
        // Simulate live counter updates
        const activeOrdersEl = document.getElementById('activeOrders');
        const onlineClientsEl = document.getElementById('onlineClients');
        
        if (activeOrdersEl) {
            trustSignals.liveCounters.activeOrders += Math.floor(Math.random() * 3) - 1;
            activeOrdersEl.textContent = Math.max(100, trustSignals.liveCounters.activeOrders);
        }
        
        if (onlineClientsEl) {
            trustSignals.liveCounters.onlineClients += Math.floor(Math.random() * 5) - 2;
            onlineClientsEl.textContent = Math.max(20, Math.min(50, trustSignals.liveCounters.onlineClients));
        }
    }, 30000); // Update every 30 seconds
}

function startActivityFeed() {
    setInterval(() => {
        // Rotate activity feed
        const activityList = document.getElementById('activityList');
        if (activityList) {
            const randomActivity = trustSignals.recentActivity[Math.floor(Math.random() * trustSignals.recentActivity.length)];
            randomActivity.time = 'Just now';
            
            const newActivity = document.createElement('div');
            newActivity.innerHTML = `
                <div style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 11px; animation: fadeIn 0.5s ease;">
                    <div style="font-weight: 600; color: #1f2937;">${randomActivity.action}</div>
                    <div style="color: #6b7280; margin: 2px 0;">📍 ${randomActivity.location} • ${randomActivity.amount}</div>
                    <div style="color: #10b981; font-size: 10px;">${randomActivity.time}</div>
                </div>
            `;
            
            activityList.insertBefore(newActivity.firstElementChild, activityList.firstChild);
            
            // Remove last item if more than 3
            if (activityList.children.length > 3) {
                activityList.removeChild(activityList.lastChild);
            }
        }
    }, 45000); // Update every 45 seconds
}

function toggleTrustWidget() {
    const widget = document.getElementById('trustWidget');
    const badge = document.getElementById('trustBadge');
    
    if (widget.style.display === 'block') {
        closeTrustWidget();
    } else {
        openTrustWidget();
    }
}

function openTrustWidget() {
    const widget = document.getElementById('trustWidget');
    const badge = document.getElementById('trustBadge');
    
    if (widget && badge) {
        widget.style.display = 'block';
        badge.style.display = 'none';
        
        // Add animation class
        widget.style.animation = 'slideUpFade 0.3s ease forwards';
    }
}

function closeTrustWidget() {
    const widget = document.getElementById('trustWidget');
    const badge = document.getElementById('trustBadge');
    
    if (widget && badge) {
        widget.style.animation = 'slideDownFade 0.3s ease forwards';
        
        // Hide widget and show badge after animation
        setTimeout(() => {
            widget.style.display = 'none';
            badge.style.display = 'block';
        }, 300);
    }
}

// Keep old function names for compatibility but redirect to new ones
function toggleTrustSignals() {
    toggleTrustWidget();
}

function showTrustSignals() {
    openTrustWidget();
}

function hideTrustSignals() {
    closeTrustWidget();
}

function showActivityDashboard() {
    // Create professional modal instead of alert
    const modal = document.createElement('div');
    modal.className = 'activity-dashboard-modal';
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s ease;">
            <div style="background: white; border-radius: 15px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; animation: slideUp 0.3s ease;">
                <div style="padding: 25px 30px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 15px 15px 0 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 1.3em; display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.2em;">📊</span> Live Activity Dashboard
                        </h3>
                        <button onclick="this.closest('.activity-dashboard-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;">×</button>
                    </div>
                </div>
                <div style="padding: 30px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; margin-bottom: 25px;">
                        <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
                            <div style="font-size: 2em; font-weight: 700; color: #16a34a;">23</div>
                            <div style="color: #15803d; font-size: 0.9em; font-weight: 500;">New Orders Today</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
                            <div style="font-size: 2em; font-weight: 700; color: #2563eb;">$2.1M</div>
                            <div style="color: #1d4ed8; font-size: 0.9em; font-weight: 500;">Total Transactions</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: #fefce8; border-radius: 10px; border: 1px solid #fde047;">
                            <div style="font-size: 2em; font-weight: 700; color: #ca8a04;">15</div>
                            <div style="color: #a16207; font-size: 0.9em; font-weight: 500;">Shipments Dispatched</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: #faf5ff; border-radius: 10px; border: 1px solid #d8b4fe;">
                            <div style="font-size: 2em; font-weight: 700; color: #9333ea;">89%</div>
                            <div style="color: #7c3aed; font-size: 0.9em; font-weight: 500;">On-Time Delivery</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 15px 0; color: #334155; display: flex; align-items: center; gap: 8px;">
                            <span>⚡</span> Recent Activity Feed
                        </h4>
                        ${trustSignals.recentActivity.map((activity, index) => `
                            <div style="padding: 12px 0; border-bottom: ${index < trustSignals.recentActivity.length - 1 ? '1px solid #e2e8f0' : 'none'}; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 600; color: #1e293b; margin-bottom: 3px;">${activity.action}</div>
                                    <div style="color: #64748b; font-size: 0.9em;">📍 ${activity.location} • ${activity.amount}</div>
                                </div>
                                <div style="color: #10b981; font-size: 0.85em; font-weight: 500; text-align: right;">
                                    ${activity.time}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="window.open('https://wa.me/256776701003?text=Hi%20Frank,%20I%27d%20like%20to%20get%20detailed%20activity%20reports%20for%20my%20account.', '_blank')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            <span>📱</span> Contact Frank for Detailed Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Add required CSS animations
function addTrustAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUpFade {
            from { 
                opacity: 0; 
                transform: translateY(20px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        @keyframes slideDownFade {
            from { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
            to { 
                opacity: 0; 
                transform: translateY(20px) scale(0.95); 
            }
        }
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        /* Trust Badge Responsive Design */
        @media (max-width: 768px) {
            #trustBadge {
                left: 15px !important;
                bottom: 80px !important;
            }
            #trustWidget {
                left: 15px !important;
                bottom: 80px !important;
                max-width: 280px !important;
            }
            #trustWidget > div {
                padding: 15px !important;
            }
        }
        
        @media (max-width: 480px) {
            #trustBadge {
                left: 10px !important;
                bottom: 70px !important;
            }
            #trustWidget {
                left: 10px !important;
                bottom: 70px !important;
                max-width: calc(100vw - 40px) !important;
                max-width: 260px !important;
            }
            #trustWidget .grid {
                grid-template-columns: 1fr 1fr !important;
                gap: 10px !important;
            }
        }
        
        /* Custom scrollbar for activity list */
        #activityList::-webkit-scrollbar {
            width: 4px;
        }
        #activityList::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 2px;
        }
        #activityList::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
        }
        #activityList::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    `;
    document.head.appendChild(style);
}

// Initialize Trust & Credibility Features
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addTrustAnimations();
        enhanceCertificationsSection();
        setTimeout(() => {
            createLiveTrustSignals();
            createFloatingTrustNotifications();
        }, 1000);
        console.log('Trust & credibility features loaded!');
    });
} else {
    addTrustAnimations();
    enhanceCertificationsSection();
    setTimeout(() => {
        createLiveTrustSignals();
        createFloatingTrustNotifications();
    }, 1000);
    console.log('Trust & credibility features loaded immediately!');
}