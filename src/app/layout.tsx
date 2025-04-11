import './globals.css';
import type { Metadata } from 'next';
import { LayoutClient } from "../components/LayoutClient";

// Metadata configuration
export const metadata: Metadata = {
  title: 'Mr. Timely',
  description: 'Track your time and activities with Mr. Timely',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add script for pre-hydration theme detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check localStorage first
                  var savedTheme = localStorage.getItem('theme');
                  var isDark = false;
                  
                  if (savedTheme) {
                    // User has explicitly set a preference
                    isDark = savedTheme === 'dark';
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    // No saved preference, check system preference
                    isDark = true;
                  }
                  
                  // Apply theme class immediately
                  document.documentElement.classList.remove('light-mode', 'dark-mode');
                  document.documentElement.classList.add(isDark ? 'dark-mode' : 'light-mode');
                } catch (e) {
                  // Fail silently - worst case we get a light theme as default
                  console.error('Error setting initial theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
