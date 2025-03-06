'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import DarkModeToggle from "../components/DarkModeToggle";

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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <div style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 100,
          }}>
            <DarkModeToggle />
          </div>
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
