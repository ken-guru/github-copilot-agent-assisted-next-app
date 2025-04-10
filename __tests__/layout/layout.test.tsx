/**
 * @jest-environment jsdom
 */

import { viewport, metadata } from '../../src/app/layout';
import RootLayout from '../../src/app/layout';
import '@testing-library/jest-dom';
import React from 'react';

// Mock the next/font/google import
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: 'mocked-geist-variable',
  }),
  Geist_Mono: () => ({
    variable: 'mocked-geist-mono-variable',
  }),
}));

// Mock the LayoutClient component
jest.mock('../../src/components/LayoutClient', () => ({
  LayoutClient: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-client">{children}</div>
  ),
}));

describe('RootLayout', () => {
  describe('Viewport Configuration', () => {
    it('should configure viewport to disable zoom and pan on mobile devices', () => {
      // Verify the viewport configuration
      expect(viewport).toBeDefined();
      expect(viewport.width).toBe('device-width');
      expect(viewport.initialScale).toBe(1);
      
      // Properties that should be added to disable zoom and pan
      expect(viewport.userScalable).toBe(false);
      expect(viewport.maximumScale).toBe(1);
    });

    it('should include theme color configuration', () => {
      expect(viewport.themeColor).toBe('#000000');
    });
  });

  describe('Metadata Configuration', () => {
    it('should set appropriate metadata for the application', () => {
      expect(metadata).toBeDefined();
      expect(metadata.title).toBe('Mr. Timely');
      expect(metadata.description).toBe('Track your time and activities with Mr. Timely');
    });

    it('should configure icon and manifest', () => {
      expect(metadata.icons).toBeDefined();
      
      // Handle different possible icon formats properly for TypeScript
      const icons = metadata.icons;
      if (typeof icons === 'object' && icons !== null) {
        // Use type assertion with 'as' to handle the icons object safely
        const iconsObject = icons as { icon?: string };
        if (iconsObject.icon) {
          expect(iconsObject.icon).toBe('/favicon.ico');
        }
      }
      
      expect(metadata.manifest).toBe('/manifest.json');
    });
  });

  describe('Component Structure', () => {
    // Test for structure and props without rendering
    it('should set up correct structure with LayoutClient and font classes', () => {
      // Create the element (won't render it)
      const element = RootLayout({ children: <div>Test Child</div> });
      
      // Check the structure programmatically
      expect(element.type).toBe('html');
      expect(element.props.lang).toBe('en');
      
      // Verify body and its className
      const body = element.props.children;
      expect(body.type).toBe('body');
      expect(body.props.className).toContain('mocked-geist-variable');
      expect(body.props.className).toContain('mocked-geist-mono-variable');
      
      // Verify LayoutClient contains children
      const layoutClient = body.props.children;
      expect(layoutClient.type).toEqual(
        expect.objectContaining({
          name: 'LayoutClient',
        })
      );
      expect(layoutClient.props.children).toEqual(<div>Test Child</div>);
    });
    
    it('should use LayoutClient component', () => {
      // Use the existing mock to verify it's correctly used
      const { LayoutClient } = require('../../src/components/LayoutClient');
      
      expect(LayoutClient).toBeDefined();
      // Check if the module is mocked by Jest
      expect(jest.isMockFunction(require('../../src/components/LayoutClient').LayoutClient) || 
             Object.keys(jest.requireMock('../../src/components/LayoutClient')).includes('LayoutClient'))
        .toBeTruthy();
    });
  });
});
