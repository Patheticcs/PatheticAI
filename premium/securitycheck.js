async function checkAuth() {
  try {
    const loggedIn = localStorage.getItem('loggedIn');
    const savedKey = localStorage.getItem('loggedInKey');
    const timestamp = localStorage.getItem('loginTimestamp');

    // Check if any necessary values are missing
    if (!loggedIn || !savedKey || !timestamp) {
      redirectToPremium();
      return;
    }

    const now = Date.now();
    const expires = parseInt(timestamp, 10) + 24 * 60 * 60 * 1000;

    // Check if the session has expired
    if (now > expires) {
      clearSession();
      redirectToPremium();
      return;
    }

    // Validate the key against the server
    try {
      const response = await fetch('premium.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (!data.validKeys.includes(savedKey)) {
        clearSession();
        redirectToPremium();
        return;
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      clearSession();
      redirectToPremium();
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    clearSession();
    redirectToPremium();
  }
}

function clearSession() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('loggedInKey');
  localStorage.removeItem('loginTimestamp');
}

function redirectToPremium() {
  window.location.href = '/premium';
}

// Initial auth check
checkAuth();

// Periodic auth check every 5 minutes
setInterval(() => {
  checkAuth().catch((error) => {
    console.error('Periodic auth check failed:', error);
  });
}, 5 * 60 * 1000);
