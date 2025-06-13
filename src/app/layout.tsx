import { Geist, Geist_Mono } from "next/font/google";
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
      { url: '/favicon.ico' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
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
    <html lang="en" className="light-mode" data-theme="light">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload script to apply theme before first render to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Don't run this script during SSR
                if (typeof window === 'undefined' || typeof document === 'undefined') {
                  return;
                }

                try {
                  // We need to set this consistently between server and client
                  // to avoid hydration mismatches
                  const savedTheme = typeof localStorage !== 'undefined' 
                    ? localStorage.getItem('theme') 
                    : null;
                  
                  const prefersDark = typeof window !== 'undefined' 
                    && window.matchMedia 
                    && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
                  
                  const root = document.documentElement;
                  
                  // Only make changes if we need to switch from the default light theme
                  // This prevents hydration mismatches by not modifying the DOM during initial render
                  if (theme === 'dark' || (theme === 'system' && prefersDark)) {
                    // Switch to dark theme
                    root.classList.remove('light-mode');
                    root.classList.add('dark-mode');
                    root.classList.add('dark');
                    root.setAttribute('data-theme', 'dark');
                  }
                  // For light theme, we don't need to do anything as it's the default
                  // and already set in the server-rendered HTML
                } catch (e) {
                  console.error('Error applying theme:', e);
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
        {/* Service worker registration script - moved here from useServiceWorker hook */}
        <Script
          id="register-service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                      console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(function(error) {
                      console.error('Service Worker registration failed:', error);
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
