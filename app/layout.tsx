import { Geist, Geist_Mono } from "next/font/google";
// Import order matters - Bootstrap first, then global theme variables, then app-specific styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons
import "../styles/globals.css"; // Core theme variables and global utilities
import "./globals.css"; // App-specific styles that use the theme variables
import { Metadata, Viewport } from "next";
// import { LayoutClient } from "../components/LayoutClient";
// TODO: LayoutClient not found in project. If needed, implement or update import path.
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
    <html lang="en" className="light-mode" data-theme="light" data-bs-theme="light">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
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
                  let effectiveTheme = 'light'; // Default server value
                  
                  if (savedTheme === 'dark') {
                    effectiveTheme = 'dark';
                  } else if (savedTheme === 'light') {
                    effectiveTheme = 'light';
                  } else if (!savedTheme && prefersDark) {
                    // No saved preference, use system preference
                    effectiveTheme = 'dark';
                  }
                  
                  // Apply theme to match what React components will set
                  if (effectiveTheme === 'dark') {
                    root.classList.remove('light-mode');
                    root.classList.add('dark-mode', 'dark');
                    root.setAttribute('data-theme', 'dark');
                    root.setAttribute('data-bs-theme', 'dark');
                  } else {
                    // Ensure light theme classes are set (should already be from server)
                    root.classList.add('light-mode');
                    root.classList.remove('dark-mode', 'dark');
                    root.setAttribute('data-theme', 'light');
                    root.setAttribute('data-bs-theme', 'light');
                  }
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `
          }}
        />
      </head>
      <body className={fontClasses}>
        {/* <LayoutClient> */}
          {children}
        {/* </LayoutClient> */}
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
