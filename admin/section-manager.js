// Section Manager for Admin Panel
// Manages visibility of website sections

const SectionManager = {
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

    // Save settings to localStorage and optionally to backend
    saveSettings() {
        try {
            localStorage.setItem('eastafricom_sections', JSON.stringify(this.sections));
            
            // Also save to backend for persistence across browsers
            this.saveToBackend();
            
            return true;
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
            const response = await fetch('/api-section-settings.php');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.settings) {
                    this.sections = { ...this.sections, ...data.settings };
                    // Also update localStorage
                    localStorage.setItem('eastafricom_sections', JSON.stringify(this.sections));
                    console.log('✅ Settings loaded from backend');
                }
            }
        } catch (e) {
            console.warn('⚠️ Could not load from backend, using localStorage:', e);
            // Fall back to localStorage
        }
    },

    // Toggle a specific section
    toggle(sectionName, enabled) {
        if (this.sections.hasOwnProperty(sectionName)) {
            this.sections[sectionName] = enabled;
            this.saveSettings();
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
    initializeAdminPanel() {
        const settings = this.loadSettings();
        
        // Set checkbox states
        for (const [section, enabled] of Object.entries(settings)) {
            const checkbox = document.getElementById(`toggle-${this.kebabCase(section)}`);
            if (checkbox) {
                checkbox.checked = enabled;
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
    showNotification(`${sectionName} section ${enabled ? 'enabled' : 'disabled'}`, 'success');
}

function saveSections() {
    if (SectionManager.saveSettings()) {
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
    // Initialize immediately if on sections tab
    await SectionManager.initializeAdminPanel();
    
    // Re-initialize every time sections tab is clicked
    const sectionsTab = document.querySelector('[onclick*="showTab(\'sections\')"]');
    if (sectionsTab) {
        sectionsTab.addEventListener('click', async function() {
            // Small delay to let tab content render
            setTimeout(async () => {
                await SectionManager.initializeAdminPanel();
            }, 100);
        });
    }
});
