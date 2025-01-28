document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {

  if (
    (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) || 
    e.key === 'F12' 
  ) {
    e.preventDefault();
    blockDevTools();
  }
});

const threshold = 150; 
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

function detectDevTools() {
  const widthExceeded = window.outerWidth - window.innerWidth > threshold;
  const heightExceeded = window.outerHeight - window.innerHeight > threshold;

  if (!isMobile && (widthExceeded || heightExceeded)) {
    blockDevTools();
  }
}

setInterval(detectDevTools, 100);

function blockDevTools() {
  alert("DevTools is not allowed!");
  try {
    window.close(); 
  } catch (error) {
    console.warn("Window could not be closed programmatically.", error);
  }
}
});
