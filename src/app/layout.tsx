import { Metadata, Viewport } from 'next/types';
import './globals.css';
import { LayoutClient } from '../components/LayoutClient';

// Mock Geist fonts until they are properly installed or configured
const GeistMono = { 
  variable: 'font-geist-mono',
};

const GeistSans = {
  variable: 'font-geist-sans',
};

export const metadata: Metadata = {
  title: 'Mr. Timely',
  description: 'Track your time and activities with Mr. Timely',
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
  manifest: '/manifest.json',
};

// Add required viewport configuration for Next.js 15
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
  // Additional viewport configurations for mobile
  userScalable: false, // Disables zoom on mobile
  maximumScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
