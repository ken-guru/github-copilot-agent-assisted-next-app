import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata, Viewport } from "next";
import { LayoutClient } from "../components/LayoutClient";

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
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
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
    <html lang="en">
      <body className={fontClasses}>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
