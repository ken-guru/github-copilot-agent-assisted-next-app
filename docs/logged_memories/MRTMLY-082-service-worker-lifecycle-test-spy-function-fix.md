# Service Worker Lifecycle Test Spy Function Fix

**Date:** 2023-12-07  
**Tags:** #serviceWorker #testing #debugging #jest #spies  
**Status:** Resolved  

## Initial State

After implementing a spy-based approach for testing the service worker lifecycle events, we encountered errors when trying to spy on properties that didn't exist yet:

