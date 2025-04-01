'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
import { UpdateNotification } from "@/components/UpdateNotification";
import { registerServiceWorker, setUpdateHandler } from "../utils/serviceWorkerRegistration";
import { ThemeProvider } from "@/context/theme/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    setUpdateHandler((message) => {
      setUpdateMessage(message);
    });

    const handleUpdateAvailable = (event: CustomEvent) => {
      if (event.detail?.message) {
        setUpdateMessage(event.detail.message);
      }
    };

    window.addEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable as EventListener);
    registerServiceWorker();

    return () => {
      setUpdateHandler(null);
      window.removeEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable as EventListener);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          {updateMessage && (
            <UpdateNotification
              message={updateMessage}
              onDismiss={() => setUpdateMessage(null)}
            />
          )}
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
