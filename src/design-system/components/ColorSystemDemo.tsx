/**
 * Material 3 Dynamic Color System Demo Component
 * 
 * This component demonstrates the dynamic color generation and theme switching
 * capabilities of the Material 3 design system implementation.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  generateColorScheme,
  applyColorScheme,
  toggleTheme,
  getCurrentTheme,
  validateColorAccessibility
} from '../color-utils';
import type { Material3ColorScheme } from '../types';

interface ColorDemoProps {
  className?: string;
}

export function ColorSystemDemo({ className = '' }: ColorDemoProps) {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [sourceColor, setSourceColor] = useState('#0070f3');
  const [colorScheme, setColorScheme] = useState<Material3ColorScheme | null>(null);
  const [accessibilityReport, setAccessibilityReport] = useState<{
    valid: boolean;
    issues: string[];
  } | null>(null);

  // Generate color scheme when source color or theme changes
  useEffect(() => {
    try {
      const scheme = generateColorScheme(sourceColor, currentTheme);
      setColorScheme(scheme);
      
      // Validate accessibility
      const validation = validateColorAccessibility(scheme);
      setAccessibilityReport(validation);
      
      // Apply the scheme to CSS custom properties
      applyColorScheme(scheme);
    } catch (error) {
      console.error('Failed to generate color scheme:', error);
    }
  }, [sourceColor, currentTheme]);

  // Initialize theme on mount
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
  }, []);

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSourceColor(color);
  };

  const presetColors = [
    { name: 'Blue', value: '#0070f3' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Pink', value: '#db2777' }
  ];

  return (
    <div className={`m3-theme-transition ${className}`}>
      <div className="m3-surface-base" style={{ padding: '2rem', borderRadius: '12px' }}>
        <h2 className="m3-typography-headline-medium m3-color-on-surface">
          Material 3 Dynamic Color System
        </h2>
        
        {/* Theme and Color Controls */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={handleThemeToggle}
            className="m3-surface-primary"
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="m3-typography-body-medium m3-color-on-surface">
              Source Color:
            </label>
            <input
              type="color"
              value={sourceColor}
              onChange={handleColorChange}
              style={{
                width: '3rem',
                height: '2rem',
                border: '2px solid var(--m3-color-outline)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            />
            <span className="m3-typography-body-small m3-color-on-surface-variant">
              {sourceColor}
            </span>
          </div>
        </div>

        {/* Preset Colors */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            Preset Colors
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {presetColors.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSourceColor(preset.value)}
                className={`m3-hover-surface ${sourceColor === preset.value ? 'm3-surface-primary' : 'm3-surface-variant'}`}
                style={{
                  padding: '0.5rem 1rem',
                  border: sourceColor === preset.value ? '2px solid var(--m3-color-primary)' : '2px solid var(--m3-color-outline-variant)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: preset.value,
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '0.5rem',
                    verticalAlign: 'middle'
                  }}
                />
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme Preview */}
        {colorScheme && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
              Generated Color Scheme ({currentTheme} mode)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              
              {/* Primary Colors */}
              <div className="m3-surface-primary" style={{ padding: '1rem', borderRadius: '8px' }}>
                <h4 className="m3-typography-title-small" style={{ marginBottom: '0.5rem' }}>Primary</h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <div>Primary: {colorScheme.primary}</div>
                  <div>On Primary: {colorScheme.onPrimary}</div>
                  <div>Container: {colorScheme.primaryContainer}</div>
                  <div>On Container: {colorScheme.onPrimaryContainer}</div>
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="m3-surface-secondary" style={{ padding: '1rem', borderRadius: '8px' }}>
                <h4 className="m3-typography-title-small" style={{ marginBottom: '0.5rem' }}>Secondary</h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <div>Secondary: {colorScheme.secondary}</div>
                  <div>On Secondary: {colorScheme.onSecondary}</div>
                  <div>Container: {colorScheme.secondaryContainer}</div>
                  <div>On Container: {colorScheme.onSecondaryContainer}</div>
                </div>
              </div>

              {/* Tertiary Colors */}
              <div className="m3-surface-tertiary" style={{ padding: '1rem', borderRadius: '8px' }}>
                <h4 className="m3-typography-title-small" style={{ marginBottom: '0.5rem' }}>Tertiary</h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <div>Tertiary: {colorScheme.tertiary}</div>
                  <div>On Tertiary: {colorScheme.onTertiary}</div>
                  <div>Container: {colorScheme.tertiaryContainer}</div>
                  <div>On Container: {colorScheme.onTertiaryContainer}</div>
                </div>
              </div>

              {/* Surface Colors */}
              <div className="m3-surface-variant" style={{ padding: '1rem', borderRadius: '8px' }}>
                <h4 className="m3-typography-title-small m3-color-on-surface" style={{ marginBottom: '0.5rem' }}>Surface</h4>
                <div className="m3-color-on-surface-variant" style={{ fontSize: '0.875rem' }}>
                  <div>Surface: {colorScheme.surface}</div>
                  <div>On Surface: {colorScheme.onSurface}</div>
                  <div>Surface Variant: {colorScheme.surfaceVariant}</div>
                  <div>On Surface Variant: {colorScheme.onSurfaceVariant}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Report */}
        {accessibilityReport && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
              Accessibility Report
            </h3>
            <div 
              className={accessibilityReport.valid ? 'm3-surface-success' : 'm3-surface-warning'}
              style={{ padding: '1rem', borderRadius: '8px' }}
            >
              <div className="m3-typography-body-medium" style={{ marginBottom: '0.5rem' }}>
                {accessibilityReport.valid ? '✅ All color combinations meet WCAG AA requirements' : '⚠️ Some color combinations may not meet accessibility requirements'}
              </div>
              {accessibilityReport.issues.length > 0 && (
                <div className="m3-typography-body-small">
                  <strong>Issues:</strong>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    {accessibilityReport.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactive Examples */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            Interactive Examples
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="m3-surface-primary m3-hover-primary" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
              Primary Button
            </button>
            <button className="m3-surface-secondary m3-hover-secondary" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
              Secondary Button
            </button>
            <button className="m3-surface-tertiary m3-hover-tertiary" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
              Tertiary Button
            </button>
          </div>
        </div>

        {/* State Examples */}
        <div>
          <h3 className="m3-typography-title-medium m3-color-on-surface" style={{ marginBottom: '1rem' }}>
            State Examples
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div className="m3-success-subtle" style={{ padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div className="m3-typography-label-large">Success</div>
              <div className="m3-typography-body-small">Operation completed</div>
            </div>
            <div className="m3-warning-subtle" style={{ padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div className="m3-typography-label-large">Warning</div>
              <div className="m3-typography-body-small">Proceed with caution</div>
            </div>
            <div className="m3-error-subtle" style={{ padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div className="m3-typography-label-large">Error</div>
              <div className="m3-typography-body-small">Something went wrong</div>
            </div>
            <div className="m3-info-subtle" style={{ padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div className="m3-typography-label-large">Info</div>
              <div className="m3-typography-body-small">Additional information</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}