'use client';
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import "./globals.css";
import { OfflineIndicator } from "../components/OfflineIndicator";
import { registerServiceWorker } from "../utils/serviceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata is now defined in a separate file when using 'use client'
// See: https://nextjs.org/docs/app/building-your-application/optimizing/metadata#static-metadata
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Register service worker for offline functionality
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <OfflineIndicator />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
