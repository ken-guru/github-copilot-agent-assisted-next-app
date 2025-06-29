// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add ServiceWorkerUpdaterAPI mock for testing
Cypress.on('window:before:load', (win) => {
  // Add the ServiceWorkerUpdaterAPI mock if not already present
  if (!win.ServiceWorkerUpdaterAPI) {
    win.ServiceWorkerUpdaterAPI = {
      setUpdateAvailable: (flag: boolean) => {
        console.log(`[Cypress] Setting update available to ${flag}`);
        // Dispatch both events to ensure component picks it up
        win.dispatchEvent(
          new CustomEvent('serviceWorkerUpdateAvailable', {
            detail: { message: 'A new version is available. Please refresh to update.' },
          })
        );
        // Also dispatch a dedicated test event
        win.dispatchEvent(
          new CustomEvent('cypressServiceWorkerUpdate', {
            detail: { updateAvailable: flag },
          })
        );
      },
    };
  }
});

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style');
    style.innerHTML = `
      .command-name-request,
      .command-name-xhr {
        display: none;
      }
    `;
    app.document.head.appendChild(style);
  });
}