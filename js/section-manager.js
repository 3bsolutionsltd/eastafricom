/**
 * Section Manager - Frontend Implementation
 * Reads settings from localStorage and hides/shows sections accordingly
 */

(function() {
    'use strict';
    
    // Section mapping: setting name -> CSS selector
    const sectionMap = {
        hero: 'section.hero, section#home',
        trustWidget: '.trust-widget, .trust-badges, section.trust-section',
        about: 'section.about, section#about',
        greenProcess: '.green_process, section.green_process',
        greenServices: '.green_services, section.green_services',
        products: 'section.products, section#products',
        awards: 'section.awards, section#awards, .awards-section, section#awards-recognition',
        testimonials: 'section.testimonials, section#testimonials',
        contact: 'section.contact, section#contact'
    };

    // Load section settings from localStorage or backend
    async function loadSettings() {
        // Try to load from backend first
        try {
            const response = await fetch('api-section-settings.php');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.settings) {
                    // Update localStorage with backend data
                    localStorage.setItem('eastafricom_sections', JSON.stringify(data.settings));
                    return data.settings;
                }
            }
        } catch (e) {
            // Fall back to localStorage silently
        }
        
        // Fall back to localStorage
        const saved = localStorage.getItem('eastafricom_sections');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                // Return default settings
            }
        }
        
        // Default: all sections enabled
        return {
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
    }

    // Apply section visibility
    async function applySectionVisibility() {
        const settings = await loadSettings();
        
        for (const [sectionName, selector] of Object.entries(sectionMap)) {
            const isEnabled = settings[sectionName] !== false;
            const elements = document.querySelectorAll(selector);
            
            if (elements.length > 0) {
                elements.forEach(element => {
                    if (isEnabled) {
                        element.style.display = '';
                        element.style.removeProperty('display');
                        element.classList.remove('section-hidden');
                    } else {
                        element.style.display = 'none';
                        element.classList.add('section-hidden');
                    }
                });
            }
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySectionVisibility);
    } else {
        applySectionVisibility();
    }

    // Watch for storage changes (for live updates when admin changes settings)
    window.addEventListener('storage', function(e) {
        if (e.key === 'eastafricom_sections') {
            applySectionVisibility();
        }
    });

    // Re-apply when dynamic content loads (awards section is dynamically created)
    window.addEventListener('load', () => {
        setTimeout(applySectionVisibility, 1000); // Give time for dynamic content
        setTimeout(applySectionVisibility, 3000); // Second check for slow loading
    });

    // Listen for custom event when awards are loaded
    document.addEventListener('awardsLoaded', () => {
        setTimeout(applySectionVisibility, 100);
    });
})();
