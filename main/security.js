(function() {
    var devToolsOpen = false;
    var threshold = 300;

    if (!/Mobi|Android/i.test(navigator.userAgent)) {
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }

            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }

            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }

            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }

            if (e.ctrlKey) {
                if (e.key !== 'c' && e.key !== 'v' && e.key !== 'a') {
                    e.preventDefault();
                }
            }
        });

        setInterval(function() {
            var widthDifference = window.outerWidth - window.innerWidth;
            var heightDifference = window.outerHeight - window.innerHeight;

            if (widthDifference > threshold || heightDifference > threshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    window.location.href = "/disable";
                }
            } else {
                devToolsOpen = false;
            }
        }, 1000);

        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }
})();
