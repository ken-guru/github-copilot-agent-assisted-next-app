'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.container} aria-labelledby="not-found-title">
      <h1 id="not-found-title" className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={styles.link}>
        Return to Home
      </Link>
    </main>
  );
}
