async function checkAuth() {
  try {
    const loggedIn = localStorage.getItem('loggedIn');
    const savedKey = localStorage.getItem('loggedInKey');
    const timestamp = localStorage.getItem('loginTimestamp');

    // If no session data, redirect to /premium
    if (!loggedIn || !savedKey || !timestamp) {
      window.location.href = '/premium';
      return;
    }

    // Check if the savedKey is still valid by fetching the server-side validation
    const response = await fetch('premium.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    // If the saved key is invalid, clear the session and redirect to /premium
    if (!data.validKeys.includes(savedKey)) {
      clearSession();
      window.location.href = '/premium';
      return;
    }

    // If everything is fine (valid session and key), continue normal operation
    // You can add further logic here for authenticated users who are valid

  } catch (error) {
    console.error('Auth check failed:', error);

    // Clear session on any kind of failure and redirect to /premium
    clearSession();
    window.location.href = '/premium';
  }
}

function clearSession() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('loggedInKey');
  localStorage.removeItem('loginTimestamp');
}

// Initial authentication check
checkAuth();

// Set up periodic checks for session validity (every 5 minutes)
setInterval(() => {
  checkAuth().catch((error) => {
    console.error('Periodic auth check failed:', error);
  });
}, 5 * 60 * 1000);
