'use client';
import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds if not previously dismissed
      setTimeout(() => {
        if (!localStorage.getItem('pwa-dismissed')) {
          setShow(true);
        }
      }, 30000);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    
    try {
      await prompt.prompt();
      const choiceResult = await prompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA installation');
      } else {
        console.log('User dismissed PWA installation');
      }
      
      setPrompt(null);
      setShow(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <Alert 
      variant="info" 
      dismissible 
      onClose={handleClose}
      className="pwa-prompt"
    >
      <Alert.Heading className="h6 mb-2">
        <i className="bi bi-download me-2" aria-hidden="true"></i>
        Install Mr. Timely
      </Alert.Heading>
      <p className="mb-2 small">
        Add to your home screen for quick access and offline support.
      </p>
      <Button variant="primary" size="sm" onClick={handleInstall}>
        <i className="bi bi-plus-circle me-1" aria-hidden="true"></i>
        Install App
      </Button>
    </Alert>
  );
};
