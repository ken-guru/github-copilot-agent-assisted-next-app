'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  // Log the 404 for debugging
  useEffect(() => {
    console.log('404 page rendered - page not found');
  }, []);

  return (
    <div>
      <div role="region" aria-labelledby="error-title">
        <h1 id="error-title" >404 - Page Not Found</h1>
        <p>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
