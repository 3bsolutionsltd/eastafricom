/**
 * Authentication Check for Admin Pages
 * Include this script at the top of every admin page
 */

(async function() {
    'use strict';
    
    const CHECK_AUTH_URL = '../backend/auth/check.php';
    const LOGIN_URL = 'login.html';
    const SESSION_CHECK_INTERVAL = 60000; // Check every minute
    
    /**
     * Check authentication status
     */
    async function checkAuth() {
        try {
            const response = await fetch(CHECK_AUTH_URL, {
                method: 'GET',
                credentials: 'same-origin',
                cache: 'no-cache'
            });
            
            const data = await response.json();
            
            if (!data.authenticated) {
                redirectToLogin('Session expired. Please login again.');
            } else {
                // Update user info if available
                if (data.user && window.updateUserInfo) {
                    window.updateUserInfo(data.user);
                }
            }
            
            return data.authenticated;
        } catch (error) {
            console.error('Auth check failed:', error);
            // Don't redirect on network errors - could be temporary
            return true;
        }
    }
    
    /**
     * Redirect to login page
     */
    function redirectToLogin(message) {
        if (message) {
            sessionStorage.setItem('loginMessage', message);
        }
        window.location.href = LOGIN_URL;
    }
    
    /**
     * Setup logout button
     */
    function setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                if (!confirm('Are you sure you want to logout?')) {
                    return;
                }
                
                try {
                    const response = await fetch('../backend/auth/logout.php', {
                        method: 'POST',
                        credentials: 'same-origin'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        redirectToLogin('Logged out successfully');
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                    alert('Logout failed. Please try again.');
                }
            });
        }
    }
    
    /**
     * Add session timeout warning
     */
    function addSessionWarning() {
        let warningShown = false;
        const TIMEOUT_WARNING = 55 * 60 * 1000; // Warn 5 minutes before timeout (at 55 min)
        
        setTimeout(() => {
            if (!warningShown) {
                warningShown = true;
                const extend = confirm('Your session will expire in 5 minutes. Would you like to extend it?');
                if (extend) {
                    checkAuth(); // This will extend the session
                    warningShown = false;
                }
            }
        }, TIMEOUT_WARNING);
    }
    
    // Initial auth check
    const isAuthenticated = await checkAuth();
    
    if (!isAuthenticated) {
        redirectToLogin('Please login to access admin panel');
        return;
    }
    
    // Periodic session checks
    setInterval(checkAuth, SESSION_CHECK_INTERVAL);
    
    // Setup logout functionality
    setupLogout();
    
    // Add session timeout warning
    addSessionWarning();
    
    // Expose auth methods globally
    window.adminAuth = {
        checkAuth,
        logout: () => {
            fetch('../backend/auth/logout.php', { 
                method: 'POST',
                credentials: 'same-origin'
            }).then(() => redirectToLogin());
        }
    };
    
})();
