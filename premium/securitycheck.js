async function checkAuth() {
    try {
        // Add debugging to see actual values
        const loggedIn = localStorage.getItem('loggedIn');
        const savedKey = localStorage.getItem('loggedInKey');
        const timestamp = localStorage.getItem('loginTimestamp');
        
        console.log('Auth values:', {
            loggedIn,
            savedKey,
            timestamp: new Date(parseInt(timestamp)).toLocaleString()
        });

        if (!loggedIn || !savedKey || !timestamp) {
            console.log('Missing required auth values');
            window.location.href = '/premium';
            return;
        }

        const now = Date.now();
        const expires = parseInt(timestamp) + 24 * 60 * 60 * 1000;
        
        console.log('Time check:', {
            now: new Date(now).toLocaleString(),
            expires: new Date(expires).toLocaleString()
        });

        if (now > expires) {
            console.log('Session expired');
            clearSession();
            window.location.href = '/premium';
            return;
        }

        try {
            const response = await fetch('premium.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            console.log('Checking key:', savedKey);
            console.log('Valid keys:', data.validKeys);
            
            // Case-insensitive check and trim whitespace
            const normalizedSavedKey = savedKey.trim().toLowerCase();
            const normalizedValidKeys = data.validKeys.map(k => k.trim().toLowerCase());
            
            if (!normalizedValidKeys.includes(normalizedSavedKey)) {
                console.log('Invalid key');
                clearSession();
                window.location.href = '/premium';
                return;
            }
            
            console.log('Auth check passed successfully');
            return true;

        } catch (error) {
            console.error('Fetch error:', error);
            // Don't clear session on network errors
            if (error.message.includes('Network') || error.message.includes('HTTP')) {
                console.log('Network error - keeping session active');
                return false;
            }
            clearSession();
            window.location.href = '/premium';
            return false;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        clearSession();
        window.location.href = '/premium';
        return false;
    }
}

function clearSession() {
    console.log('Clearing session');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInKey');
    localStorage.removeItem('loginTimestamp');
}

// Initial check
checkAuth().catch(error => {
    console.error('Initial auth check failed:', error);
});

// Periodic check every 5 minutes
setInterval(() => {
    checkAuth().catch(error => {
        console.error('Periodic auth check failed:', error);
    });
}, 5 * 60 * 1000);
