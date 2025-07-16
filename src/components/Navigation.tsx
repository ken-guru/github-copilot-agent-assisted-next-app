import React from 'react';
import Link from 'next/link';

/**
 * Responsive navigation bar for Timer and Activities
 * - Bootstrap styling
 * - ARIA labels for accessibility
 * - Mobile-first design
 * - Theme compatibility
 */
const Navigation: React.FC = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light" aria-label="Main navigation">
    <div className="container-fluid">
      <Link className="navbar-brand" href="/">Timer App</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" href="/">Timer</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/activities">Activities</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navigation;
