export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use the correct path to the service worker file
      const swUrl = '/service-worker.js';
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  } else {
    console.log('Service workers are not supported by this browser');
  }
}
