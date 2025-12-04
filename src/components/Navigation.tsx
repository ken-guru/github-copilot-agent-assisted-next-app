import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, Nav } from 'react-bootstrap';
import { useThemeReactive } from '@/hooks/useThemeReactive';
import ThemeToggle from '@/components/ThemeToggle';
// AI nav is always visible; gating handled on page

/**
 * Enhanced navigation with active state management and tab-like styling
 * - Bootstrap nav pills for active state indication
 * - Visual separation between theme toggle and navigation items
 * - Tab-like appearance extending into header space
 * - Mobile-friendly with icon-only display on small screens
 * - Automatic light/dark theme switching with proper active state styling
 * Issue #245: Removed dropdown complexity + active state UX improvements
 */
const Navigation: React.FC = () => {
  // Get theme reactively to ensure component responds to theme changes (fixes issue #252)
  const { theme } = useThemeReactive(); 
  const pathname = usePathname();
  
  // State for mobile navigation collapse
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  // Function to close mobile navigation
  const closeMobileNav = () => setShowMobileNav(false);
  
  // Determine active states based on current path
  const isTimerActive = pathname === '/';
  const isActivitiesActive = pathname === '/activities';
  const isAIActive = pathname === '/ai';
  // Always show AI nav item; page handles gating/setup
  const showAI = true;

  return (
    <Navbar 
      expand="lg" 
      className={`border-bottom ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}
      aria-label="Main navigation"
      data-bs-theme={theme}
    >
      <div className="container-fluid">
        <Navbar.Brand href="/" data-testid="navbar-brand">
          <i className="bi bi-clock me-2" aria-hidden="true"></i>
          <span className="brand-text d-none d-sm-inline">Mr. Timely</span>
        </Navbar.Brand>
        
        <div className="d-flex align-items-center order-lg-2">
          {/* Theme Toggle - Always visible */}
          <div className="me-3" data-testid="theme-toggle-container">
            <ThemeToggle size="sm" variant="navbar" />
          </div>
          
          {/* Mobile menu toggle */}
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            onClick={() => setShowMobileNav(!showMobileNav)}
          />
        </div>
        
        <Navbar.Collapse id="basic-navbar-nav" className="order-lg-1">
          <Nav className="ms-auto me-lg-4">
            {/* Timer - First navigation item */}
            <Nav.Link 
              href="/"
              active={isTimerActive}
              onClick={closeMobileNav}
              data-testid="timer-nav-item"
            >
              <i className="bi bi-stopwatch me-1" aria-hidden="true"></i>
              Timer
            </Nav.Link>
            
            {/* Activities - Second navigation item */}
            <Nav.Link 
              href="/activities"
              active={isActivitiesActive}
              onClick={closeMobileNav}
              data-testid="activities-nav-item"
            >
              <i className="bi bi-list-check me-1" aria-hidden="true"></i>
              Activities
            </Nav.Link>

            {/* AI - Conditional navigation item */}
            {showAI && (
              <Nav.Link 
                href="/ai"
                active={isAIActive}
                onClick={closeMobileNav}
                data-testid="ai-nav-item"
              >
                <i className="bi bi-stars me-1" aria-hidden="true"></i>
                AI
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;
