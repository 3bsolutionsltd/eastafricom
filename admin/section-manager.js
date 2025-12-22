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
            const response = await fetch('../api-section-settings.php', {
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
                    console.log('Settings saved to backend successfully');
                }
            }
        } catch (e) {
            console.warn('Could not save to backend:', e);
            // Not critical - localStorage still works
        }
    },

    // Load from backend on initialization
    async loadFromBackend() {
        try {
            const response = await fetch('../api-section-settings.php');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.settings) {
                    this.sections = { ...this.sections, ...data.settings };
                    // Also update localStorage
                    localStorage.setItem('eastafricom_sections', JSON.stringify(this.sections));
                }
            }
        } catch (e) {
            console.warn('Could not load from backend:', e);
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
document.addEventListener('DOMContentLoaded', function() {
    // Load from backend first
    SectionManager.loadFromBackend().then(() => {
        // Then initialize admin panel when sections tab is shown
        const sectionsTab = document.querySelector('[onclick*="showTab(\'sections\')"]');
        if (sectionsTab) {
            sectionsTab.addEventListener('click', function() {
                setTimeout(() => {
                    SectionManager.initializeAdminPanel();
                }, 100);
            });
        }
    });
});
