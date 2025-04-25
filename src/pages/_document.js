import { Html, Head, Main, NextScript } from 'next/document';
import { initializeTheme } from '../utils/themeSync';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add meta tags and other head content */}
      </Head>
      <body>
        {/* Script to set theme before initial render to avoid flashing */}
        <script dangerouslySetInnerHTML={{ __html: initializeTheme() }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
