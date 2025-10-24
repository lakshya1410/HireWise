// Auto-logout functionality
(function() {
    'use strict';
    
    // Track user activity
    let lastActivity = Date.now();
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
    
    // Update last activity time on user interaction
    function updateActivity() {
        lastActivity = Date.now();
    }
    
    // Check for inactivity
    function checkInactivity() {
        const now = Date.now();
        const inactive = now - lastActivity;
        
        if (inactive >= INACTIVITY_TIMEOUT) {
            console.log('User inactive for too long, logging out...');
            logout();
        }
    }
    
    // Logout function
    function logout() {
        Storage.clearSession();
        window.location.href = 'auth.html?mode=login&reason=timeout';
    }
    
    // Listen for user activity
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keypress', updateActivity);
    document.addEventListener('click', updateActivity);
    document.addEventListener('scroll', updateActivity);
    
    // Check inactivity every minute
    setInterval(checkInactivity, 60 * 1000);
    
    // Handle page visibility changes (user switching tabs)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden (user switched to another tab)
            console.log('Page hidden, tracking inactivity...');
        } else {
            // Page is visible again
            updateActivity();
            console.log('Page visible, resetting activity timer');
        }
    });
    
    // Optional: Handle window/tab closing (unreliable in modern browsers)
    // Most browsers block synchronous operations in beforeunload for security
    window.addEventListener('beforeunload', function(e) {
        // This won't work reliably for logout due to browser restrictions
        // Keeping session in localStorage means user stays logged in
        // To auto-logout on close, would need to use sessionStorage instead
        console.log('Page unloading...');
    });
    
    // For debugging
    console.log('Auto-logout initialized. Inactivity timeout:', INACTIVITY_TIMEOUT / 1000 / 60, 'minutes');
})();
