/**
 * Not found page for shared sessions
 * Handles cases where session doesn't exist, is expired, or invalid
 */

'use client';

import Link from 'next/link';
import { Card, Alert, Button } from 'react-bootstrap';
import { useEffect } from 'react';

export default function SharedSessionNotFound() {
  // Log the 404 for debugging
  useEffect(() => {
    console.log('Shared session 404 page rendered');
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <Card className="text-center">
            <Card.Body className="py-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h1 className="h3 mb-3">Session Not Found</h1>
              
              <Alert variant="warning" className="text-start">
                <div className="d-flex align-items-start">
                  <i className="bi bi-info-circle me-2 mt-1"></i>
                  <div>
                    <p className="mb-2">
                      <strong>This shared session could not be found.</strong>
                    </p>
                    <p className="mb-0">
                      This might happen if:
                    </p>
                    <ul className="mb-0 mt-2">
                      <li>The session link is incorrect or incomplete</li>
                      <li>The session has expired (sessions expire after 90 days)</li>
                      <li>The session was deleted by the owner</li>
                      <li>There was a temporary server issue</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
                <Link href="/" className="btn btn-primary d-flex align-items-center justify-content-center">
                  <i className="bi bi-house-fill me-2"></i>
                  Go to Mr. Timely
                </Link>
                
                <Button 
                  variant="outline-secondary"
                  onClick={() => window.history.back()}
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Go Back
                </Button>
              </div>

              <div className="mt-4 pt-3 border-top">
                <p className="text-muted small mb-0">
                  If you believe this is an error, please check the link and try again.
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}