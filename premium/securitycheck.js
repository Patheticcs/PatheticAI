async function checkAuth() {
    try {
        const loggedIn = localStorage.getItem("loggedIn");
        const savedKey = localStorage.getItem("loggedInKey");
        const timestamp = localStorage.getItem("loginTimestamp");

        if (!loggedIn || !savedKey || !timestamp) {
            window.location.href = "/premium";
            return;
        }

        const response = await fetch("premium.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (!data.validKeys.includes(savedKey)) {
            clearSession();
            window.location.href = "/premium";
            return;
        }
    } catch (error) {
        console.error("Auth check failed:", error);

        clearSession();
        window.location.href = "/premium";
    }
}

function clearSession() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInKey");
    localStorage.removeItem("loginTimestamp");
}

checkAuth();

setInterval(() => {
    checkAuth().catch((error) => {
        console.error("Periodic auth check failed:", error);
    });
}, 5 * 60 * 1000);
