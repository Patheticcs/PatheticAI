(function() {
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
