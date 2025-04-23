'use client';

import { ReactNode, useEffect, useState } from "react";
import { UpdateNotification } from "./UpdateNotification";
import { registerServiceWorker, setUpdateHandler } from "../utils/serviceWorkerRegistration";

interface LayoutClientProps {
  children: ReactNode;
  fontClasses?: string; // Made optional since we're not using it directly
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Register service worker for offline functionality
  useEffect(() => {
    // Set up update handler before registering service worker
    setUpdateHandler((message) => {
      setUpdateMessage(message);
    });

    // Handle custom update event
    const handleUpdateAvailable = (event: CustomEvent) => {
      if (event.detail?.message) {
        setUpdateMessage(event.detail.message);
      }
    };

    // Add event listener for custom update event
    window.addEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable as EventListener);

    // Register service worker
    registerServiceWorker();

    // Clean up handler on unmount
    return () => {
      setUpdateHandler(null);
      window.removeEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable as EventListener);
    };
  }, []);

  // Fix the type error by converting the ServiceWorkerRegistration to a string
  const handleServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
    // Create a string message from the registration object instead of passing the registration itself
    const updateMsg = `New version available (scope: ${registration.scope})`;
    setUpdateMessage(updateMsg);
  };

  return (
    <>
      {updateMessage && (
        <UpdateNotification
          message={updateMessage}
          onDismiss={() => setUpdateMessage(null)}
        />
      )}
      <main>
        {children}
      </main>
    </>
  );
}