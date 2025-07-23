import { Geist, Geist_Mono } from "next/font/google";
// Import order matters - Bootstrap first, then global theme variables, then app-specific styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons
import "../../styles/globals.css"; // Core theme variables and global utilities
import "./globals.css"; // App-specific styles that use the theme variables
import { Metadata, Viewport } from "next";
import { LayoutClient } from "../components/LayoutClient";
import Script from "next/script";

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata configuration
export const metadata: Metadata = {
  title: 'Mr. Timely',
  description: 'Track your time and activities with Mr. Timely',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icons/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ]
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mr. Timely'
  },
  applicationName: 'Mr. Timely',
  formatDetection: {
    telephone: false
  }
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
  userScalable: false,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClasses = `${geistSans.variable} ${geistMono.variable}`;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" sizes="180x180" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme initialization script - runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Don't run during SSR
                if (typeof window === 'undefined' || typeof document === 'undefined') {
                  return;
                }

                try {
                  const root = document.documentElement;
                  
                  // Get theme preference - check localStorage first, then system preference
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Determine effective theme
                  let effectiveTheme = 'light'; // Default fallback
                  
                  if (savedTheme === 'dark') {
                    effectiveTheme = 'dark';
                  } else if (savedTheme === 'light') {
                    effectiveTheme = 'light';
                  } else if (!savedTheme && prefersDark) {
                    // No saved preference, use system preference
                    effectiveTheme = 'dark';
                  }
                  
                  // Apply theme immediately to avoid hydration mismatch
                  if (effectiveTheme === 'dark') {
                    root.classList.add('dark-mode', 'dark');
                    root.classList.remove('light-mode');
                    root.setAttribute('data-theme', 'dark');
                    root.setAttribute('data-bs-theme', 'dark');
                    // Also set on body for Bootstrap Modal portals (check if body exists)
                    if (document.body) {
                      document.body.setAttribute('data-bs-theme', 'dark');
                    }
                  } else {
                    root.classList.add('light-mode');
                    root.classList.remove('dark-mode', 'dark');
                    root.setAttribute('data-theme', 'light');
                    root.setAttribute('data-bs-theme', 'light');
                    // Also set on body for Bootstrap Modal portals (check if body exists)
                    if (document.body) {
                      document.body.setAttribute('data-bs-theme', 'light');
                    }
                  }
                } catch (e) {
                  // Fallback to light theme on any error
                  document.documentElement.classList.add('light-mode');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.setAttribute('data-bs-theme', 'light');
                  if (document.body) {
                    document.body.setAttribute('data-bs-theme', 'light');
                  }
                  console.error('Theme initialization error:', e);
                }
              })();
            `
          }}
        />
      </head>
      <body className={fontClasses}>
        <LayoutClient>
          {children}
        </LayoutClient>
        {/* Service worker registration script with improved update detection */}
        <Script
          id="register-service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  console.log('[SW Registration] Starting service worker registration');
                  
                  // Add cache-busting parameter to ensure fresh SW file
                  const swUrl = '/service-worker.js?v=' + Date.now();
                  
                  navigator.serviceWorker.register(swUrl, {
                    updateViaCache: 'none' // Don't cache the service worker file
                  })
                    .then(function(registration) {
                      console.log('[SW Registration] Service Worker registered with scope:', registration.scope);
                      
                      // Check for updates every 30 seconds when page is visible
                      if (registration.update) {
                        const checkForUpdates = () => {
                          if (!document.hidden) {
                            console.log('[SW Registration] Checking for updates');
                            registration.update().catch(e => 
                              console.log('[SW Registration] Update check failed:', e.message)
                            );
                          }
                        };
                        
                        // Check immediately and then periodically
                        checkForUpdates();
                        setInterval(checkForUpdates, 30000);
                        
                        // Also check when page becomes visible
                        document.addEventListener('visibilitychange', () => {
                          if (!document.hidden) {
                            setTimeout(checkForUpdates, 1000);
                          }
                        });
                      }
                    })
                    .catch(function(error) {
                      console.error('[SW Registration] Service Worker registration failed:', error);
                    });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
