(function() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert("DevTools isn't allowed!");
        window.location.href = 'about:blank'; // Redirect to a blank page
    });

    // Disable keyboard shortcuts (F12, Ctrl+Shift+I, etc.)
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.shiftKey && e.key === 'J') || 
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            alert("DevTools isn't allowed!");
            window.location.href = 'about:blank'; // Redirect to a blank page
        }
    });

    // DevTools detection using a more reliable method
    const devToolsDetect = () => {
        const threshold = 100; // Adjust the threshold to a reasonable value
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        // Check for significant difference in window size, which indicates DevTools
        if (widthDiff > threshold || heightDiff > threshold) {
            alert("DevTools isn't allowed!");
            window.location.href = 'about:blank'; // Redirect to a blank page
        }
    };

    // Check every 500 milliseconds (faster detection)
    setInterval(devToolsDetect, 500);
})();
