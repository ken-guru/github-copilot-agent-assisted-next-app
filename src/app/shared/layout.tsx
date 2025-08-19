'use client';

/**
 * Layout for shared session pages
 * Provides consistent styling and context for shared sessions
 */

import Link from 'next/link';
import { ToastProvider } from '@/contexts/ToastContext';

// Note: metadata is handled by individual pages since this is a client component

interface SharedLayoutProps {
  children: React.ReactNode;
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  return (
    <ToastProvider>
      <main className="min-vh-100 d-flex flex-column">
        {/* Simple header for shared sessions */}
        <header className="bg-body-tertiary border-bottom py-3">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="h4 mb-0 d-flex align-items-center">
                  <i className="bi bi-share me-2"></i>
                  Shared Session
                </h1>
              </div>
              <div className="col-auto">
                <Link 
                  href="/" 
                  className="btn btn-outline-primary btn-sm d-flex align-items-center"
                  title="Go to Mr. Timely"
                >
                  <i className="bi bi-house-fill me-2"></i>
                  Mr. Timely
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-grow-1">
          {children}
        </div>

        {/* Simple footer for shared sessions */}
        <footer className="bg-body-tertiary border-top py-3 mt-auto">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col">
                <p className="text-muted small mb-0">
                  Powered by <Link href="/" className="text-decoration-none">Mr. Timely</Link>
                </p>
              </div>
              <div className="col-auto">
                <p className="text-muted small mb-0">
                  <i className="bi bi-shield-check me-1"></i>
                  Sessions expire after 90 days
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </ToastProvider>
  );
}