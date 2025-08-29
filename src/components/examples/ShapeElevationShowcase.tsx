/**
 * Material 3 Expressive Shape and Elevation System Showcase
 * Demonstrates the organic corner radius system and elevation tokens
 */

import React, { useState } from 'react';
import {
  getMaterial3OrganicShape,
  getMaterial3ContextualElevation,
  getMaterial3ExpressiveContainer,
  getMaterial3ResponsiveShape,
  getMaterial3OrganicElevation,
  getMaterial3InteractiveElevation,
  getMaterial3ComponentStyle,
} from '../../utils/material3-utils';

interface ShapeElevationShowcaseProps {
  className?: string;
}

export const ShapeElevationShowcase: React.FC<ShapeElevationShowcaseProps> = ({
  className = '',
}) => {
  const [selectedComponent, setSelectedComponent] = useState<'button' | 'card' | 'field' | 'navigation' | 'activity' | 'timer' | 'summary' | 'chip'>('card');
  const [selectedVariant, setSelectedVariant] = useState<'primary' | 'secondary' | 'tertiary' | 'organic' | 'asymmetric'>('primary');
  const [selectedElevation, setSelectedElevation] = useState<'resting' | 'hover' | 'pressed' | 'focused' | 'dragged'>('resting');
  const [isInteractive, setIsInteractive] = useState(true);

  const containerStyle = getMaterial3ComponentStyle({
    backgroundColor: 'surface',
    color: 'onSurface',
    shape: 'cornerLarge',
    elevation: 'level1',
  });

  const showcaseItemStyle = getMaterial3ComponentStyle({
    backgroundColor: 'surfaceContainerLow',
    color: 'onSurface',
    shape: 'cornerMedium',
    elevation: 'level0',
  });

  const demoContainerStyle = getMaterial3ExpressiveContainer({
    componentType: selectedComponent,
    shapeVariant: selectedVariant,
    elevationState: selectedElevation,
    responsive: true,
    context: 'comfortable',
    interactive: isInteractive,
  });

  const organicShapes = [
    { name: 'Primary', value: 'primary' as const },
    { name: 'Secondary', value: 'secondary' as const },
    { name: 'Tertiary', value: 'tertiary' as const },
    { name: 'Organic', value: 'organic' as const },
    { name: 'Asymmetric', value: 'asymmetric' as const },
  ];

  const elevationStates = [
    { name: 'Resting', value: 'resting' as const },
    { name: 'Hover', value: 'hover' as const },
    { name: 'Pressed', value: 'pressed' as const },
    { name: 'Focused', value: 'focused' as const },
    { name: 'Dragged', value: 'dragged' as const },
  ];

  const componentTypes = [
    { name: 'Button', value: 'button' as const },
    { name: 'Card', value: 'card' as const },
    { name: 'Field', value: 'field' as const },
    { name: 'Navigation', value: 'navigation' as const },
    { name: 'Activity', value: 'activity' as const },
    { name: 'Timer', value: 'timer' as const },
    { name: 'Summary', value: 'summary' as const },
    { name: 'Chip', value: 'chip' as const },
  ];

  return (
    <div className={`p-6 ${className}`} style={containerStyle}>
      <div className="mb-8">
        <h2 className="md-typescale-headline-large mb-4">
          Material 3 Expressive Shape & Elevation System
        </h2>
        <p className="md-typescale-body-large mb-6" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Explore organic corner radius variations and contextual elevation patterns that create expressive, 
          dynamic interfaces while maintaining accessibility and usability.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Component Type Selector */}
        <div className="p-4" style={showcaseItemStyle}>
          <h3 className="md-typescale-title-medium mb-3">Component Type</h3>
          <div className="space-y-2">
            {componentTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="componentType"
                  value={type.value}
                  checked={selectedComponent === type.value}
                  onChange={(e) => setSelectedComponent(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="md-typescale-body-medium">{type.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Shape Variant Selector */}
        <div className="p-4" style={showcaseItemStyle}>
          <h3 className="md-typescale-title-medium mb-3">Shape Variant</h3>
          <div className="space-y-2">
            {organicShapes.map((shape) => (
              <label key={shape.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="shapeVariant"
                  value={shape.value}
                  checked={selectedVariant === shape.value}
                  onChange={(e) => setSelectedVariant(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="md-typescale-body-medium">{shape.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Elevation State Selector */}
        <div className="p-4" style={showcaseItemStyle}>
          <h3 className="md-typescale-title-medium mb-3">Elevation State</h3>
          <div className="space-y-2">
            {elevationStates.map((state) => (
              <label key={state.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="elevationState"
                  value={state.value}
                  checked={selectedElevation === state.value}
                  onChange={(e) => setSelectedElevation(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="md-typescale-body-medium">{state.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="p-4" style={showcaseItemStyle}>
          <h3 className="md-typescale-title-medium mb-3">Options</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isInteractive}
                onChange={(e) => setIsInteractive(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="md-typescale-body-medium">Interactive Transitions</span>
            </label>
          </div>
        </div>
      </div>

      {/* Demo Container */}
      <div className="mb-8">
        <h3 className="md-typescale-title-large mb-4">Live Preview</h3>
        <div className="flex justify-center p-12" style={{ backgroundColor: 'var(--md-sys-color-surface-container)' }}>
          <div
            className="w-64 h-32 flex items-center justify-center cursor-pointer"
            style={{
              ...demoContainerStyle,
              backgroundColor: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
            }}
          >
            <div className="text-center">
              <div className="md-typescale-title-medium mb-1">
                {selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1)}
              </div>
              <div className="md-typescale-body-small" style={{ opacity: 0.8 }}>
                {selectedVariant} • {selectedElevation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shape Examples Grid */}
      <div className="mb-8">
        <h3 className="md-typescale-title-large mb-4">Organic Shape Variations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {organicShapes.map((shape) => {
            const shapeStyle = getMaterial3OrganicShape(selectedComponent, shape.value);
            return (
              <div key={shape.value} className="text-center">
                <div
                  className="w-20 h-20 mx-auto mb-2 flex items-center justify-center"
                  style={{
                    ...shapeStyle,
                    backgroundColor: 'var(--md-sys-color-secondary-container)',
                    color: 'var(--md-sys-color-on-secondary-container)',
                  }}
                >
                  <span className="md-typescale-label-small">{shape.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elevation Examples Grid */}
      <div className="mb-8">
        <h3 className="md-typescale-title-large mb-4">Elevation Levels</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {Array.from({ length: 9 }, (_, i) => {
            const level = `level${i}` as keyof typeof import('../../types/material3-tokens').Material3CSSProperties.elevation;
            const elevationStyle = getMaterial3ContextualElevation('card', 'resting');
            return (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-2 flex items-center justify-center md-shape-corner-medium"
                  style={{
                    ...elevationStyle,
                    boxShadow: `var(--md-sys-elevation-level${i})`,
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  <span className="md-typescale-label-small">{i}</span>
                </div>
                <div className="md-typescale-body-small">Level {i}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organic Elevation Examples */}
      <div className="mb-8">
        <h3 className="md-typescale-title-large mb-4">Organic Elevation Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['subtle', 'moderate', 'pronounced'] as const).map((intensity) => {
            const organicElevationStyle = getMaterial3OrganicElevation(intensity);
            return (
              <div key={intensity} className="text-center">
                <div
                  className="w-32 h-24 mx-auto mb-3 flex items-center justify-center md-shape-corner-asymmetric-medium"
                  style={{
                    ...organicElevationStyle,
                    backgroundColor: 'var(--md-sys-color-tertiary-container)',
                    color: 'var(--md-sys-color-on-tertiary-container)',
                  }}
                >
                  <span className="md-typescale-title-small">
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Directional Shadows */}
      <div className="mb-8">
        <h3 className="md-typescale-title-large mb-4">Directional Shadows</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(['top', 'bottom', 'left', 'right'] as const).map((direction) => {
            const directionalStyle = getMaterial3OrganicElevation('moderate', direction);
            return (
              <div key={direction} className="text-center">
                <div
                  className="w-24 h-24 mx-auto mb-3 flex items-center justify-center md-shape-corner-large"
                  style={{
                    ...directionalStyle,
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  <span className="md-typescale-label-large">
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive Shape Examples */}
      <div className="mb-8">
        <h3 className="md-typescale-title-large mb-4">Responsive Shape Scaling</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['compact', 'comfortable', 'spacious'] as const).map((context) => {
            const responsiveStyle = getMaterial3ResponsiveShape('cornerMedium', context);
            return (
              <div key={context} className="text-center">
                <div
                  className="w-32 h-24 mx-auto mb-3 flex items-center justify-center"
                  style={{
                    ...responsiveStyle,
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  <span className="md-typescale-title-small">
                    {context.charAt(0).toUpperCase() + context.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Examples */}
      <div>
        <h3 className="md-typescale-title-large mb-4">Usage Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4" style={showcaseItemStyle}>
            <h4 className="md-typescale-title-medium mb-3">CSS Classes</h4>
            <div className="space-y-2 md-typescale-body-small font-mono">
              <div>.md-shape-{selectedComponent}-{selectedVariant}</div>
              <div>.md-elevation-{selectedComponent}-{selectedElevation}</div>
              <div>.md-shape-responsive</div>
              <div>.md-elevation-interactive</div>
            </div>
          </div>
          
          <div className="p-4" style={showcaseItemStyle}>
            <h4 className="md-typescale-title-medium mb-3">Utility Functions</h4>
            <div className="space-y-2 md-typescale-body-small font-mono">
              <div>getMaterial3OrganicShape()</div>
              <div>getMaterial3ContextualElevation()</div>
              <div>getMaterial3ExpressiveContainer()</div>
              <div>getMaterial3ResponsiveShape()</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeElevationShowcase;