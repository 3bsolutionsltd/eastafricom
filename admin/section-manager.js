// Section Manager for Admin Panel
// Manages visibility of website sections

const SectionManager = {
    version: '2.0', // Increment this to force localStorage clear
    sections: {
        hero: true,
        trustWidget: true,
        about: true,
        greenProcess: true,
        greenServices: true,
        products: true,
        awards: true,
        testimonials: true,
        contact: true
    },
    
    // Check and clear old localStorage if version changed
    checkVersion() {
        const savedVersion = localStorage.getItem('eastafricom_sections_version');
        if (savedVersion !== this.version) {
            console.log('🔄 Version changed, clearing old localStorage');
            localStorage.removeItem('eastafricom_sections');
            localStorage.setItem('eastafricom_sections_version', this.version);
        }
    },

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('eastafricom_sections');
        if (saved) {
            try {
                this.sections = { ...this.sections, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading section settings:', e);
            }
        }
        return this.sections;
    },

    // Save settings to localStorage and backend
    async saveSettings() {
        try {
            localStorage.setItem('eastafricom_sections', JSON.stringify(this.sections));
            
            // Also save to backend for persistence across browsers
            const saved = await this.saveToBackend();
            
            return saved;
        } catch (e) {
            console.error('Error saving section settings:', e);
            return false;
        }
    },

    // Save to backend API
    async saveToBackend() {
        try {
            const response = await fetch('/api-section-settings.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    settings: this.sections
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('✅ Settings saved to backend successfully');
                    return true;
                } else {
                    console.error('❌ Backend save failed:', data.error);
                    return false;
                }
            } else {
                console.error('❌ HTTP error:', response.status);
                return false;
            }
        } catch (e) {
            console.error('❌ Could not save to backend:', e);
            return false;
        }
    },

    // Load from backend on initialization
    async loadFromBackend() {
        try {
            console.log('🔄 Loading settings from backend API...');
            const response = await fetch('/api-section-settings.php');
            console.log('📡 Response status:', response.status, response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📦 Received data:', data);
                
                if (data.success && data.settings) {
                    // Completely replace sections with backend data (don't merge)
                    this.sections = data.settings;
                    console.log('✅ Sections updated to:', this.sections);
                    
                    // Also update localStorage
                    localStorage.setItem('eastafricom_sections', JSON.stringify(this.sections));
                    console.log('💾 localStorage updated');
                    
                    console.log('✅ Settings loaded from backend:', this.sections);
                    return true;
                }
            }
            console.warn('⚠️ Backend response not OK or missing settings');
            return false;
        } catch (e) {
            console.error('❌ Could not load from backend:', e);
            return false;
        }
    },

    // Toggle a specific section (local only - doesn't auto-save)
    toggle(sectionName, enabled) {
        if (this.sections.hasOwnProperty(sectionName)) {
            this.sections[sectionName] = enabled;
            // Update localStorage only (don't save to backend until user clicks Save)
            localStorage.setItem('eastafricom_sections', JSON.stringify(this.sections));
            return true;
        }
        return false;
    },

    // Get status of a section
    isEnabled(sectionName) {
        return this.sections[sectionName] !== false;
    },

    // Reset to defaults
    resetToDefaults() {
        this.sections = {
            hero: true,
            trustWidget: true,
            about: true,
            greenProcess: true,
            greenServices: true,
            products: true,
            awards: true,
            testimonials: true,
            contact: true
        };
        this.saveSettings();
    },

    // Initialize checkboxes in admin panel
    async initializeAdminPanel() {
        // Always reload from backend first to get latest settings
        const loaded = await this.loadFromBackend();
        
        console.log('🔄 Initializing admin panel with sections:', this.sections);
        console.log('🔍 DEBUG - this.sections.products value:', this.sections.products, 'type:', typeof this.sections.products);
        
        const settings = this.sections;
        
        // Set checkbox states
        for (const [section, enabled] of Object.entries(settings)) {
            const checkbox = document.getElementById(`toggle-${this.kebabCase(section)}`);
            if (checkbox) {
                console.log(`🔍 DEBUG - Setting ${section}: enabled=${enabled}, type=${typeof enabled}, checkbox.id=${checkbox.id}`);
                checkbox.checked = enabled;
                console.log(`Checkbox toggle-${this.kebabCase(section)} set to:`, enabled, 'actual checked:', checkbox.checked);
            } else {
                console.warn(`Checkbox toggle-${this.kebabCase(section)} not found in DOM`);
            }
        }
    },

    // Convert camelCase to kebab-case
    kebabCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
};

// Global functions for admin panel
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Inter, sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function toggleSection(sectionName, enabled) {
    SectionManager.toggle(sectionName, enabled);
    // Don't show notification for individual toggles - wait for Save button
}

async function saveSections() {
    const saved = await SectionManager.saveSettings();
    if (saved) {
        showNotification('Section settings saved successfully!', 'success');
    } else {
        showNotification('Error saving section settings', 'error');
    }
}

function resetSections() {
    if (confirm('Are you sure you want to reset all sections to their default visibility?')) {
        SectionManager.resetToDefaults();
        SectionManager.initializeAdminPanel();
        showNotification('Section settings reset to defaults', 'success');
    }
}

// Initialize when admin panel loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📋 Section Manager: DOMContentLoaded fired');
    
    // Check version and clear old localStorage if needed
    SectionManager.checkVersion();
    
    // Initialize immediately if on sections tab
    await SectionManager.initializeAdminPanel();
    
    // Re-initialize every time sections tab is clicked
    const sectionsTab = document.querySelector('[onclick*="showTab(\'sections\')"]');
    if (sectionsTab) {
        console.log('✅ Found sections tab button, adding click listener');
        sectionsTab.addEventListener('click', async function() {
            console.log('🖱️ Sections tab clicked, reinitializing...');
            // Small delay to let tab content render
            setTimeout(async () => {
                await SectionManager.initializeAdminPanel();
            }, 100);
        });
    } else {
        console.warn('⚠️ Sections tab button not found');
    }
});
