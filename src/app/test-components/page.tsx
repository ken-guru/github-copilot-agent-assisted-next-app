/**
 * Test Components Page
 * Isolated component testing environment for visual regression tests
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Material3Button } from '@/components/ui/Material3Button';
import { Material3TextField } from '@/components/ui/Material3TextField';
import { Material3Container } from '@/components/ui/Material3Container';
import { ActivityButtonMaterial3 } from '@/components/ActivityButtonMaterial3';
import SummaryMaterial3 from '@/components/SummaryMaterial3';
import Navigation from '@/components/Navigation';

export default function TestComponentsPage() {
  const [currentComponent, setCurrentComponent] = useState<string>('Material3Button');
  const [currentVariant, setCurrentVariant] = useState<string>('filled');
  const [currentProps, setCurrentProps] = useState<Record<string, unknown>>({});

  // Listen for URL parameters to set component and variant
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const component = urlParams.get('component');
    const variant = urlParams.get('variant');
    const props = urlParams.get('props');

    if (component) setCurrentComponent(component);
    if (variant) setCurrentVariant(variant);
    if (props) {
      try {
        setCurrentProps(JSON.parse(decodeURIComponent(props)));
      } catch (error) {
        console.error('Failed to parse props:', error);
      }
    }
  }, []);

  const renderTestComponent = () => {
    const commonProps = {
      'data-testid': 'component-under-test',
      'data-variant': currentVariant,
      ...currentProps
    };

    switch (currentComponent) {
      case 'Material3Button':
        return (
          <Material3Button
            {...commonProps}
            variant={currentVariant as 'filled' | 'outlined' | 'text'}
            onClick={() => console.log('Button clicked')}
          >
            {currentProps.children || 'Test Button'}
          </Material3Button>
        );

      case 'Material3TextField':
        return (
          <Material3TextField
            {...commonProps}
            variant={currentVariant as 'filled' | 'outlined'}
            label="Test Field"
            placeholder="Enter text..."
          />
        );

      case 'Material3Container':
        return (
          <Material3Container
            {...commonProps}
            variant={currentVariant as 'elevated' | 'filled' | 'outlined' | 'surface'}
          >
            <p>Test container content</p>
          </Material3Container>
        );

      case 'ActivityButtonMaterial3':
        return (
          <ActivityButtonMaterial3
            {...commonProps}
            activity={{
              id: '1',
              name: 'Test Activity',
              colorIndex: 0,
              createdAt: new Date().toISOString(),
              isActive: false
            }}
            onStart={() => {}}
            onStop={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        );

      case 'SummaryMaterial3':
        return (
          <SummaryMaterial3
            {...commonProps}
            entries={currentProps.activities || [
              { id: '1', name: 'Work', duration: 3600, status: 'completed' },
              { id: '2', name: 'Break', duration: 900, status: 'completed' }
            ]}
            totalTime={currentProps.totalTime || 4500}
          />
        );

      case 'Navigation':
        return (
          <Navigation
            {...commonProps}
            // activeItem={currentProps.activeItem || 'timer'} // Removed - not part of Navigation props
          />
        );

      default:
        return (
          <div {...commonProps}>
            <p>Unknown component: {currentComponent}</p>
          </div>
        );
    }
  };

  return (
    <div className="test-components-page" style={{ padding: '20px', minHeight: '100vh' }}>
      <div className="test-controls" style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Visual Test Component Renderer</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label>
            Component:
            <select 
              value={currentComponent} 
              onChange={(e) => setCurrentComponent(e.target.value)}
              style={{ marginLeft: '5px', padding: '4px' }}
            >
              <option value="Material3Button">Material3Button</option>
              <option value="Material3TextField">Material3TextField</option>
              <option value="Material3Container">Material3Container</option>
              <option value="ActivityButtonMaterial3">ActivityButtonMaterial3</option>
              <option value="SummaryMaterial3">SummaryMaterial3</option>
              <option value="Navigation">Navigation</option>
            </select>
          </label>
          
          <label>
            Variant:
            <input 
              type="text" 
              value={currentVariant} 
              onChange={(e) => setCurrentVariant(e.target.value)}
              style={{ marginLeft: '5px', padding: '4px' }}
            />
          </label>
          
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '4px 8px' }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="test-component-container" style={{ 
        padding: '40px', 
        border: '2px dashed #ccc', 
        borderRadius: '8px',
        background: 'var(--md-sys-color-surface, white)',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {renderTestComponent()}
      </div>

      <div className="test-info" style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Current Configuration:</strong></p>
        <p>Component: {currentComponent}</p>
        <p>Variant: {currentVariant}</p>
        <p>Props: {JSON.stringify(currentProps, null, 2)}</p>
        <p><strong>URL:</strong> {window.location.href}</p>
      </div>
    </div>
  );
}