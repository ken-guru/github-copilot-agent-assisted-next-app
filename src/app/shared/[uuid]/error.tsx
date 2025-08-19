/**
 * Error boundary for shared session pages
 * Handles runtime errors during session loading and display
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, Alert, Button } from 'react-bootstrap';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SharedSessionError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error for debugging (without sensitive information)
    console.error('Shared session error:', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <Card className="text-center">
            <Card.Body className="py-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h1 className="h3 mb-3">Something Went Wrong</h1>
              
              <Alert variant="danger" className="text-start">
                <div className="d-flex align-items-start">
                  <i className="bi bi-bug me-2 mt-1"></i>
                  <div>
                    <p className="mb-2">
                      <strong>An error occurred while loading this shared session.</strong>
                    </p>
                    <p className="mb-0">
                      This could be due to:
                    </p>
                    <ul className="mb-0 mt-2">
                      <li>A temporary server issue</li>
                      <li>Network connectivity problems</li>
                      <li>Corrupted session data</li>
                      <li>Browser compatibility issues</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
                <Button 
                  variant="primary"
                  onClick={reset}
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </Button>
                
                <Link href="/" className="btn btn-outline-primary d-flex align-items-center justify-content-center">
                  <i className="bi bi-house-fill me-2"></i>
                  Go to Mr. Timely
                </Link>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 pt-3 border-top">
                  <Alert variant="secondary" className="text-start">
                    <strong>Development Error Details:</strong>
                    <pre className="mt-2 mb-0 small text-start">
                      {error.message}
                      {error.digest && `\nDigest: ${error.digest}`}
                    </pre>
                  </Alert>
                </div>
              )}

              <div className="mt-4 pt-3 border-top">
                <p className="text-muted small mb-0">
                  If this problem persists, the session may be corrupted or no longer available.
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}