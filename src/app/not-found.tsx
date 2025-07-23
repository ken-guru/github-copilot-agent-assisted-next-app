'use client';

import Link from 'next/link';
import styles from './not-found.module.css';
import { useEffect } from 'react';

export default function NotFound() {
  // Log the 404 for debugging only in dev or Cypress
  useEffect(() => {
    if (
      (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') ||
      (typeof window !== 'undefined' && window.Cypress)
    ) {
      console.log('404 page rendered - page not found');
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content} role="region" aria-labelledby="error-title">
        <h1 id="error-title" className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={styles.link}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
