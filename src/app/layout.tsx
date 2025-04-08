import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
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
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  themeColor: '#000000',
  manifest: '/manifest.json',
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
