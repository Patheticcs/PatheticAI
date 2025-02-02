(function() {

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert("DevTools isn't allowed!");
        window.location.href = 'about:blank'; 
    });

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.shiftKey && e.key === 'J') || 
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            alert("DevTools isn't allowed!");
            window.location.href = 'about:blank'; 
        }
    });

    const devToolsDetect = () => {
        const threshold = 160;
        const width = window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold;
        if (width) {
            alert("DevTools isn't allowed!");
            window.location.href = 'about:blank'; 
        }
    };

    setInterval(devToolsDetect, 1000);
})();
