/**
 * Material 3 Shape and Elevation System Demo Component
 * 
 * This component demonstrates the shape and elevation capabilities
 * of the Material 3 design system implementation.
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Material3ShapeElevation,
  SHAPE_ELEVATION_UTILS
} from '../shape-elevation-utils';
import type { Material3ShapeSize, Material3ShapeExpressive } from '../types';

interface ShapeElevationDemoProps {
  className?: string;
}

export function ShapeElevationDemo({ className = '' }: ShapeElevationDemoProps) {
  const [selectedShape, setSelectedShape] = useState<Material3ShapeSize>('md');
  const [selectedElevation, setSelectedElevation] = useState<number>(1);
  const [isExpressive, setIsExpressive] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const demoElementRef = useRef<HTMLDivElement>(null);

  // Apply changes to demo element
  const updateDemoElement = React.useCallback(() => {
    if (!demoElementRef.current) return;
    
    const element = demoElementRef.current;
    
    // Clear existing classes
    element.className = 'm3-surface-base';
    
    // Apply shape and elevation
    if (isExpressive && selectedShape !== 'none' && selectedShape !== 'full') {
      const expressiveShape = `${selectedShape}-expressive` as Material3ShapeExpressive;
      Material3ShapeElevation.Shape.applyShape(element, expressiveShape);
    } else {
      Material3ShapeElevation.Shape.applyShape(element, selectedShape);
    }
    
    Material3ShapeElevation.Elevation.applyElevation(element, selectedElevation as 0 | 1 | 2 | 3 | 4 | 5);
    
    if (isInteractive) {
      Material3ShapeElevation.Elevation.makeInteractive(element);
      Material3ShapeElevation.Elevation.makeFocusable(element);
    }
  }, [selectedShape, selectedElevation, isExpressive, isInteractive]);

  React.useEffect(() => {
    updateDemoElement();
  }, [updateDemoElement]);

  const animateShapeChange = (newShape: Material3ShapeSize) => {
    if (!demoElementRef.current) return;
    
    Material3ShapeElevation.Animation.morphShape(
      demoElementRef.current,
      selectedShape,
      newShape,
      300
    ).then(() => {
      setSelectedShape(newShape);
    });
  };

  const animateElevationChange = (newElevation: number) => {
    if (!demoElementRef.current) return;
    
    Material3ShapeElevation.Elevation.animateElevation(
      demoElementRef.current,
      selectedElevation as 0 | 1 | 2 | 3 | 4 | 5,
      newElevation as 0 | 1 | 2 | 3 | 4 | 5,
      200
    ).then(() => {
      setSelectedElevation(newElevation);
    });
  };

  return (
    <div className={`m3-theme-transition ${className}`}>
      <div className="m3-surface-base" style={{ padding: '2rem', borderRadius: '12px' }}>
        <h2 className="m3-typography-headline-medium m3-color-on-surface">
          Material 3 Shape & Elevation System
        </h2>
        
        {/* Controls */}
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Shape Controls */}
          <div>
            <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
              Shape Configuration
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {SHAPE_ELEVATION_UTILS.SHAPE_SIZES.map((shape) => (
                <button
                  key={shape}
                  onClick={() => setSelectedShape(shape)}
                  className={`m3-hover-surface ${selectedShape === shape ? 'm3-surface-primary' : 'm3-surface-variant'}`}
                  style={{
                    padding: '0.5rem 1rem',
                    border: selectedShape === shape ? '2px solid var(--m3-color-primary)' : '2px solid var(--m3-color-outline-variant)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {shape}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={isExpressive}
                  onChange={(e) => setIsExpressive(e.target.checked)}
                  style={{ accentColor: 'var(--m3-color-primary)' }}
                />
                <span className="m3-typography-body-medium m3-color-on-surface">
                  Use Expressive Shapes
                </span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={isInteractive}
                  onChange={(e) => setIsInteractive(e.target.checked)}
                  style={{ accentColor: 'var(--m3-color-primary)' }}
                />
                <span className="m3-typography-body-medium m3-color-on-surface">
                  Interactive States
                </span>
              </label>
            </div>
          </div>

          {/* Elevation Controls */}
          <div>
            <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
              Elevation Configuration
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SHAPE_ELEVATION_UTILS.ELEVATION_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedElevation(level)}
                  className={`m3-hover-surface ${selectedElevation === level ? 'm3-surface-primary' : 'm3-surface-variant'}`}
                  style={{
                    padding: '0.5rem 1rem',
                    border: selectedElevation === level ? '2px solid var(--m3-color-primary)' : '2px solid var(--m3-color-outline-variant)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Level {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Element */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            Live Preview
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div
              ref={demoElementRef}
              className="m3-surface-base m3-theme-transition"
              style={{
                width: '200px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                cursor: isInteractive ? 'pointer' : 'default',
                userSelect: 'none'
              }}
              tabIndex={isInteractive ? 0 : -1}
            >
              <div className="m3-typography-body-large m3-color-on-surface" style={{ textAlign: 'center' }}>
                <div>Shape: {selectedShape}{isExpressive && selectedShape !== 'none' && selectedShape !== 'full' ? '-expressive' : ''}</div>
                <div>Elevation: {selectedElevation}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Controls */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            Animation Examples
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => animateShapeChange('lg')}
              className="m3-surface-secondary m3-hover-secondary"
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
            >
              Animate to Large Shape
            </button>
            <button
              onClick={() => animateElevationChange(4)}
              className="m3-surface-tertiary m3-hover-tertiary"
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
            >
              Animate to Elevation 4
            </button>
            <button
              onClick={() => {
                if (demoElementRef.current) {
                  Material3ShapeElevation.Animation.floatElement(demoElementRef.current, true);
                  setTimeout(() => {
                    if (demoElementRef.current) {
                      Material3ShapeElevation.Animation.floatElement(demoElementRef.current, false);
                    }
                  }, 3000);
                }
              }}
              className="m3-surface-success m3-hover-surface"
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
            >
              Float Animation (3s)
            </button>
          </div>
        </div>

        {/* Component Examples */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            Component Examples
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            
            {/* Card */}
            <div className="m3-surface-card m3-elevation-interactive" style={{ padding: '1rem' }}>
              <h4 className="m3-typography-title-small" style={{ marginBottom: '0.5rem' }}>Card Surface</h4>
              <p className="m3-typography-body-small">Standard card with elevation level 1 and medium shape</p>
            </div>

            {/* Elevated Card */}
            <div className="m3-surface-card-elevated m3-elevation-interactive" style={{ padding: '1rem' }}>
              <h4 className="m3-typography-title-small" style={{ marginBottom: '0.5rem' }}>Elevated Card</h4>
              <p className="m3-typography-body-small">Elevated card with higher contrast and elevation level 2</p>
            </div>

            {/* Expressive Card */}
            <div className="m3-surface-card-expressive m3-elevation-interactive" style={{ padding: '1rem' }}>
              <h4 className="m3-typography-title-small" style={{ marginBottom: '0.5rem' }}>Expressive Card</h4>
              <p className="m3-typography-body-small">Card with organic, expressive corner radius</p>
            </div>

            {/* Dialog Surface */}
            <div className="m3-surface-dialog" style={{ padding: '1rem' }}>
              <h4 className="m3-typography-title-small" style={{ marginBottom: '0.5rem' }}>Dialog Surface</h4>
              <p className="m3-typography-body-small">Dialog with large corners and elevation level 3</p>
            </div>
          </div>
        </div>

        {/* State Examples */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            Interactive States
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            
            {/* Hoverable */}
            <div 
              className="m3-surface-base m3-elevation-1 m3-elevation-interactive m3-shape-md"
              style={{ padding: '1rem', cursor: 'pointer', minWidth: '120px', textAlign: 'center' }}
            >
              <div className="m3-typography-label-large">Hover Me</div>
              <div className="m3-typography-body-small">Interactive elevation</div>
            </div>

            {/* Focusable */}
            <div 
              className="m3-surface-base m3-elevation-1 m3-elevation-focusable m3-shape-md"
              style={{ padding: '1rem', minWidth: '120px', textAlign: 'center' }}
              tabIndex={0}
            >
              <div className="m3-typography-label-large">Focus Me</div>
              <div className="m3-typography-body-small">Focusable element</div>
            </div>

            {/* Pressable */}
            <div 
              className="m3-surface-base m3-elevation-2 m3-elevation-pressable m3-shape-md"
              style={{ padding: '1rem', cursor: 'pointer', minWidth: '120px', textAlign: 'center' }}
            >
              <div className="m3-typography-label-large">Press Me</div>
              <div className="m3-typography-body-small">Pressable element</div>
            </div>

            {/* Floating Action Button */}
            <div className="m3-surface-fab m3-elevation-interactive" style={{ padding: '1rem', cursor: 'pointer', textAlign: 'center' }}>
              <div className="m3-typography-label-large">FAB</div>
            </div>
          </div>
        </div>

        {/* Shape Variations */}
        <div>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            Shape Variations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            {SHAPE_ELEVATION_UTILS.SHAPE_SIZES.map((shape) => (
              <div
                key={shape}
                className={`m3-surface-variant m3-shape-${shape} m3-elevation-1`}
                style={{ 
                  padding: '1rem', 
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="m3-typography-label-small">{shape}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}