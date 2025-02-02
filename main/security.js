(function() {

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

  });

  var devToolsOpen = false;
  var threshold = 160; 

  setInterval(function() {

    var widthDifference = window.outerWidth - window.innerWidth;
    var heightDifference = window.outerHeight - window.innerHeight;

    if (widthDifference > threshold || heightDifference > threshold) {
      if (!devToolsOpen) {  
        devToolsOpen = true;

        if (confirm("Dev Tools Isn't Allowed")) {

          window.location.href = "about:blank";

        }
      }
    } else {
      devToolsOpen = false; 
    }
  }, 1000); 
})();
