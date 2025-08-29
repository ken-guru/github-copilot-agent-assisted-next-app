/**
 * Page Transition Demo Component
 * 
 * Demonstrates various page transition animations and configurations.
 * Shows integration with Next.js routing and View Transitions API.
 */

'use client';

import React, { useState, useRef } from 'react';
import { Button } from '../../Button/Button';
import { Card } from '../../Card/Card';
import { 
  usePageTransitions, 
  useViewTransitions, 
  useSharedElementTransitions 
} from '../../hooks/usePageTransitions';
import { 
  PageTransitionConfig,
  createPageEnterAnimation,
  createPageExitAnimation
} from '../../utils/page-transition-animations';

const TRANSITION_CONFIGS: Record<string, PageTransitionConfig> = {
  slide: {
    type: 'slide',
    direction: 'left'
  },
  fade: {
    type: 'fade'
  },
  scale: {
    type: 'scale'
  },
  'shared-element': {
    type: 'shared-element',
    sharedElements: ['.demo-card', '.demo-title']
  }
};

const DEMO_PAGES = [
  { id: 'home', title: 'Home Page', color: '#e3f2fd' },
  { id: 'about', title: 'About Page', color: '#f3e5f5' },
  { id: 'contact', title: 'Contact Page', color: '#e8f5e8' },
  { id: 'products', title: 'Products Page', color: '#fff3e0' }
];

export function PageTransitionDemo() {
  const [currentPage, setCurrentPage] = useState(0);
  const [transitionType, setTransitionType] = useState<keyof typeof TRANSITION_CONFIGS>('slide');
  const [isAnimating, setIsAnimating] = useState(false);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  
  const { executeViewTransition, supportsViewTransitions } = useViewTransitions();
  const { markSharedElements } = useSharedElementTransitions(['.demo-card', '.demo-title']);

  /**
   * Handle page change with transition
   */
  const handlePageChange = async (newPageIndex: number) => {
    if (isAnimating || newPageIndex === currentPage) return;

    setIsAnimating(true);

    try {
      if (supportsViewTransitions && transitionType === 'shared-element') {
        // Use View Transitions API for shared elements
        await executeViewTransition(() => {
          setCurrentPage(newPageIndex);
        });
      } else {
        // Use custom animations
        await executeCustomTransition(newPageIndex);
      }
    } finally {
      setIsAnimating(false);
    }
  };

  /**
   * Execute custom transition animation
   */
  const executeCustomTransition = async (newPageIndex: number) => {
    const container = pageContainerRef.current;
    if (!container) return;

    const currentPageElement = container.querySelector('.current-page') as HTMLElement;
    const config = TRANSITION_CONFIGS[transitionType];
    
    if (!config) return;

    // Create new page element
    const newPageElement = document.createElement('div');
    newPageElement.className = 'new-page';
    newPageElement.innerHTML = renderPageContent(newPageIndex);
    newPageElement.style.position = 'absolute';
    newPageElement.style.top = '0';
    newPageElement.style.left = '0';
    newPageElement.style.width = '100%';
    newPageElement.style.height = '100%';

    container.appendChild(newPageElement);

    const context = {
      fromRoute: `/page-${currentPage}`,
      toRoute: `/page-${newPageIndex}`,
      direction: newPageIndex > currentPage ? 'forward' as const : 'back' as const,
      isInitialLoad: false
    };

    // Run exit and enter animations
    const exitAnimation = currentPageElement 
      ? createPageExitAnimation(currentPageElement, config, context)
      : null;
    const enterAnimation = createPageEnterAnimation(newPageElement, config, context);

    await Promise.all([
      exitAnimation?.finished,
      enterAnimation.finished
    ].filter(Boolean));

    // Update state and cleanup
    setCurrentPage(newPageIndex);
    if (currentPageElement) {
      currentPageElement.remove();
    }
    newPageElement.className = 'current-page';
  };

  /**
   * Render page content
   */
  const renderPageContent = (pageIndex: number) => {
    const page = DEMO_PAGES[pageIndex];
    if (!page) return '';
    
    return `
      <div style="
        background: ${page.color};
        padding: 2rem;
        border-radius: 12px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      ">
        <h2 class="demo-title" style="
          margin: 0;
          color: #1a1a1a;
          font-size: 2rem;
          font-weight: 600;
        ">${page.title}</h2>
        <div class="demo-card" style="
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 300px;
          text-align: center;
        ">
          <p style="margin: 0; color: #666;">
            This is the content for ${page.title.toLowerCase()}.
            Navigate between pages to see the transition effects.
          </p>
        </div>
      </div>
    `;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Page Transition Animations</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Explore different page transition effects. Try switching between pages 
          with different animation types.
        </p>

        {/* Transition Type Selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Transition Type:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(TRANSITION_CONFIGS).map((type) => (
              <button
                key={type}
                style={{
                  padding: '8px 16px',
                  border: transitionType === type ? 'none' : '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: transitionType === type ? '#6750a4' : 'white',
                  color: transitionType === type ? 'white' : '#1a1a1a',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => setTransitionType(type as keyof typeof TRANSITION_CONFIGS)}
                disabled={isAnimating}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Page Navigation */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Navigate to:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {DEMO_PAGES.map((page, index) => (
              <button
                key={page.id}
                style={{
                  padding: '8px 16px',
                  border: currentPage === index ? 'none' : '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: currentPage === index ? '#6750a4' : 'white',
                  color: currentPage === index ? 'white' : '#1a1a1a',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => handlePageChange(index)}
                disabled={isAnimating}
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>

        {/* Support Info */}
        <div style={{ 
          padding: '1rem', 
          background: supportsViewTransitions ? '#e8f5e8' : '#fff3cd',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          <strong>View Transitions API:</strong> {' '}
          {supportsViewTransitions ? 
            'Supported - Shared element transitions will use native API' : 
            'Not supported - Using custom animations'
          }
        </div>
      </div>

      {/* Page Container */}
      <div style={{ 
        position: 'relative', 
        height: '400px', 
        overflow: 'hidden',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <div 
          ref={pageContainerRef}
          style={{ position: 'relative', width: '100%', height: '100%' }}
        >
          <div 
            className="current-page"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: renderPageContent(currentPage) }}
          />
        </div>
      </div>

      {/* Animation Status */}
      {isAnimating && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#e3f2fd',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 500
        }}>
          🎬 Transitioning...
        </div>
      )}

      {/* Code Example */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Usage Example</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
{`// In your page component
import { usePageTransitions } from '@/design-system/hooks/usePageTransitions';

export default function MyPage() {
  const { setPageElement } = usePageTransitions({
    config: {
      type: '${transitionType}',
      ${transitionType === 'slide' ? `direction: 'left',` : ''}
      duration: 300
    }
  });

  return (
    <div ref={setPageElement}>
      {/* Your page content */}
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}