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

    // More reliable DevTools detection
    let lastWidth = window.outerWidth;
    let lastHeight = window.outerHeight;

    const devToolsDetect = () => {
        const currentWidth = window.outerWidth;
        const currentHeight = window.outerHeight;

        // Check for sudden large changes in window size (usually caused by opening DevTools)
        if (
            (currentWidth - lastWidth > 100 || currentHeight - lastHeight > 100) || 
            (currentWidth - lastWidth < -100 || currentHeight - lastHeight < -100)
        ) {
            alert("DevTools isn't allowed!");
            window.location.href = 'about:blank'; // Redirect to a blank page
        }

        // Update the last size values for future comparisons
        lastWidth = currentWidth;
        lastHeight = currentHeight;
    };

    // Check every 500 milliseconds (faster detection)
    setInterval(devToolsDetect, 500);
})();
