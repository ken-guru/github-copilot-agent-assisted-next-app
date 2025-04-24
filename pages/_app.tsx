import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { DisplaySettingsProvider } from '../components/contexts/DisplaySettingsContext';
import ThemeProvider from '../components/contexts/ThemeProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <DisplaySettingsProvider>
        <Component {...pageProps} />
      </DisplaySettingsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
