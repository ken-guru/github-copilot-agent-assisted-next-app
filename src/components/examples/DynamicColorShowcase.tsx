/**
 * Dynamic Color System Showcase Component
 * Demonstrates Material 3 Expressive dynamic color generation, tonal palettes,
 * theme adaptation, and accessibility validation
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  generateDynamicColorScheme,
  getSemanticColorRoles,
  validateColorSchemeAccessibility,
  generateColorCSSProperties,
  applyDynamicColorScheme,
  createThemeAwareColorAdapter,
  getContextualColor,
  type DynamicColorScheme,
  type ThemeMode,
  type InterfaceState,
  type ContrastValidationResult
} from '../../utils/material3-color-system';
import {
  getMaterial3DynamicColorStates,
  getMaterial3SemanticColor,
  getMaterial3AccessibleColors
} from '../../utils/material3-utils';

interface DynamicColorShowcaseProps {
  className?: string;
}

interface ColorPaletteDisplayProps {
  title: string;
  palette: Record<string, string>;
  onColorClick?: (color: string) => void;
}

interface AccessibilityReportProps {
  validationResults: Record<string, ContrastValidationResult>;
}

interface InteractiveColorDemoProps {
  colorRole: string;
  baseColor: string;
}

/**
 * Color Palette Display Component
 */
const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = ({ 
  title, 
  palette, 
  onColorClick 
}) => {
  return (
    <div className="color-palette">
      <h3 className="md-typescale-title-medium" style={{ marginBottom: '16px' }}>
        {title}
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
        gap: '8px',
        marginBottom: '24px'
      }}>
        {Object.entries(palette).map(([tone, color]) => (
          <div
            key={tone}
            onClick={() => onColorClick?.(color)}
            style={{
              backgroundColor: color,
              height: '60px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid var(--md-sys-color-outline-variant)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span
              className="md-typescale-label-small"
              style={{
                color: parseInt(tone) > 50 ? '#000000' : '#ffffff',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {tone}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Accessibility Report Component
 */
const AccessibilityReport: React.FC<AccessibilityReportProps> = ({ validationResults }) => {
  const passedAA = Object.values(validationResults).filter(result => result.wcagAA).length;
  const passedAAA = Object.values(validationResults).filter(result => result.wcagAAA).length;
  const total = Object.values(validationResults).length;

  return (
    <div className="accessibility-report" style={{ marginBottom: '24px' }}>
      <h3 className="md-typescale-title-medium" style={{ marginBottom: '16px' }}>
        Accessibility Report
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div style={{
          ...getMaterial3AccessibleColors('onSurfaceVariant', 'surfaceContainerHigh'),
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div className="md-typescale-headline-small" style={{ fontWeight: 'bold' }}>
            {passedAA}/{total}
          </div>
          <div className="md-typescale-body-medium">WCAG AA Compliant</div>
        </div>
        
        <div style={{
          ...getMaterial3AccessibleColors('onTertiaryContainer', 'tertiaryContainer'),
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div className="md-typescale-headline-small" style={{ fontWeight: 'bold' }}>
            {passedAAA}/{total}
          </div>
          <div className="md-typescale-body-medium">WCAG AAA Compliant</div>
        </div>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {Object.entries(validationResults).map(([pair, result]) => (
          <div
            key={pair}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              marginBottom: '4px',
              backgroundColor: result.wcagAA 
                ? 'var(--md-sys-color-tertiary-container)' 
                : 'var(--md-sys-color-error-container)',
              color: result.wcagAA 
                ? 'var(--md-sys-color-on-tertiary-container)' 
                : 'var(--md-sys-color-on-error-container)',
              borderRadius: '8px'
            }}
          >
            <span className="md-typescale-body-small">{pair}</span>
            <span className="md-typescale-label-medium">
              {result.ratio.toFixed(2)} {result.wcagAA ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Interactive Color Demo Component
 */
const InteractiveColorDemo: React.FC<InteractiveColorDemoProps> = ({ colorRole, baseColor }) => {
  const [currentState, setCurrentState] = useState<InterfaceState>('default');
  
  const states: InterfaceState[] = ['default', 'hover', 'focus', 'pressed', 'disabled', 'selected'];
  const contextualColor = getContextualColor(baseColor, currentState);
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 className="md-typescale-title-small" style={{ marginBottom: '12px' }}>
        Interactive States: {colorRole}
      </h4>
      
      <div style={{
        backgroundColor: contextualColor,
        color: currentState === 'disabled' ? '#666666' : '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '12px',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        cursor: currentState === 'disabled' ? 'not-allowed' : 'pointer'
      }}>
        <div className="md-typescale-title-medium">
          Current State: {currentState}
        </div>
        <div className="md-typescale-body-small" style={{ opacity: 0.8 }}>
          Color: {contextualColor}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {states.map(state => (
          <button
            key={state}
            onClick={() => setCurrentState(state)}
            style={{
              ...getMaterial3SemanticColor('info', currentState === state ? 'filled' : 'outlined'),
              padding: '8px 16px',
              borderRadius: '20px',
              border: currentState === state ? 'none' : undefined,
              cursor: 'pointer',
              fontSize: '14px',
              textTransform: 'capitalize'
            }}
          >
            {state}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Dynamic Color Showcase Component
 */
export const DynamicColorShowcase: React.FC<DynamicColorShowcaseProps> = ({ className }) => {
  const [seedColor, setSeedColor] = useState('#6750a4');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Generate dynamic color scheme from seed color
  const colorScheme = useMemo(() => {
    return generateDynamicColorScheme(seedColor);
  }, [seedColor]);

  // Get semantic color roles for current theme
  const semanticColors = useMemo(() => {
    return getSemanticColorRoles(colorScheme, themeMode);
  }, [colorScheme, themeMode]);

  // Validate accessibility
  const accessibilityResults = useMemo(() => {
    return validateColorSchemeAccessibility(colorScheme, themeMode);
  }, [colorScheme, themeMode]);

  // Apply color scheme to document when it changes
  useEffect(() => {
    applyDynamicColorScheme(colorScheme, themeMode);
  }, [colorScheme, themeMode]);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    // Copy color to clipboard
    navigator.clipboard.writeText(color).catch(() => {
      // Fallback for older browsers
      console.log('Color copied:', color);
    });
  };

  const handleSeedColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeedColor(event.target.value);
  };

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <div className={className} style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="md-typescale-display-small" style={{ marginBottom: '16px' }}>
          Material 3 Dynamic Color System
        </h1>
        <p className="md-typescale-body-large" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)',
          marginBottom: '24px'
        }}>
          Explore dynamic color generation, tonal palettes, theme adaptation, and accessibility validation.
        </p>

        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          marginBottom: '32px',
          padding: '20px',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderRadius: '16px'
        }}>
          <div>
            <label className="md-typescale-label-medium" style={{ display: 'block', marginBottom: '8px' }}>
              Seed Color:
            </label>
            <input
              type="color"
              value={seedColor}
              onChange={handleSeedColorChange}
              style={{
                width: '60px',
                height: '40px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            />
            <input
              type="text"
              value={seedColor}
              onChange={handleSeedColorChange}
              style={{
                marginLeft: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--md-sys-color-outline)',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)',
                width: '100px'
              }}
            />
          </div>

          <div>
            <label className="md-typescale-label-medium" style={{ display: 'block', marginBottom: '8px' }}>
              Theme Mode:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['light', 'dark', 'auto'] as ThemeMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleThemeModeChange(mode)}
                  style={{
                    ...getMaterial3SemanticColor('info', themeMode === mode ? 'filled' : 'outlined'),
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: themeMode === mode ? 'none' : undefined,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedColor && (
          <div style={{
            ...getMaterial3AccessibleColors('onPrimaryContainer', 'primaryContainer'),
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div className="md-typescale-title-medium">
              Selected Color: {selectedColor}
            </div>
            <div className="md-typescale-body-small" style={{ opacity: 0.8 }}>
              Copied to clipboard!
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Report */}
      <AccessibilityReport validationResults={accessibilityResults} />

      {/* Tonal Palettes */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="md-typescale-headline-medium" style={{ marginBottom: '24px' }}>
          Tonal Palettes
        </h2>
        
        <ColorPaletteDisplay
          title="Primary Palette"
          palette={colorScheme.primary}
          onColorClick={handleColorClick}
        />
        
        <ColorPaletteDisplay
          title="Secondary Palette"
          palette={colorScheme.secondary}
          onColorClick={handleColorClick}
        />
        
        <ColorPaletteDisplay
          title="Tertiary Palette"
          palette={colorScheme.tertiary}
          onColorClick={handleColorClick}
        />
        
        <ColorPaletteDisplay
          title="Neutral Palette"
          palette={colorScheme.neutral}
          onColorClick={handleColorClick}
        />
        
        <ColorPaletteDisplay
          title="Error Palette"
          palette={colorScheme.error}
          onColorClick={handleColorClick}
        />
      </div>

      {/* Semantic Color Roles */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="md-typescale-headline-medium" style={{ marginBottom: '24px' }}>
          Semantic Color Roles
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          {Object.entries(semanticColors).map(([role, color]) => (
            <div
              key={role}
              onClick={() => handleColorClick(color)}
              style={{
                backgroundColor: color,
                color: role.startsWith('on') ? undefined : 
                       semanticColors[`on${role.charAt(0).toUpperCase() + role.slice(1)}` as keyof typeof semanticColors] || 
                       (color === '#000000' ? '#ffffff' : '#000000'),
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                border: '1px solid var(--md-sys-color-outline-variant)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div className="md-typescale-label-medium" style={{ fontWeight: 'bold' }}>
                {role}
              </div>
              <div className="md-typescale-body-small" style={{ opacity: 0.8 }}>
                {color}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Color States */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="md-typescale-headline-medium" style={{ marginBottom: '24px' }}>
          Interactive Color States
        </h2>
        
        <InteractiveColorDemo
          colorRole="Primary"
          baseColor={semanticColors.primary}
        />
        
        <InteractiveColorDemo
          colorRole="Secondary"
          baseColor={semanticColors.secondary}
        />
        
        <InteractiveColorDemo
          colorRole="Tertiary"
          baseColor={semanticColors.tertiary}
        />
      </div>

      {/* Semantic Color Examples */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="md-typescale-headline-medium" style={{ marginBottom: '24px' }}>
          Semantic Color Applications
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {(['success', 'warning', 'info', 'neutral'] as const).map(intent => (
            <div key={intent} style={{ marginBottom: '16px' }}>
              <h4 className="md-typescale-title-small" style={{ marginBottom: '8px', textTransform: 'capitalize' }}>
                {intent}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(['filled', 'outlined', 'text'] as const).map(variant => (
                  <button
                    key={variant}
                    style={{
                      ...getMaterial3SemanticColor(intent, variant),
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      border: variant === 'outlined' ? undefined : 'none'
                    }}
                  >
                    {variant} {intent}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicColorShowcase;