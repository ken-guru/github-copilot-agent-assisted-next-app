import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptimizedAssetsExample from '../examples/OptimizedAssetsExample';
import * as assetOptimization from '../../utils/assetOptimization';

// Mock the asset optimization utilities
jest.mock('../../utils/assetOptimization', () => {
  return {
    useResponsiveImage: jest.fn(() => ({
      src: '/images/test.jpg',
      srcSet: '/images/test.jpg?w=320 320w, /images/test.jpg?w=640 640w',
      sizes: '(max-width: 480px) 480px, 1024px'
    })),
    useImagePreload: jest.fn(() => jest.fn().mockResolvedValue('/images/test.jpg')),
    getOptimizedImageSrc: jest.fn((src, options) => 
      `${src}?q=${options.quality || 80}${options.width ? `&w=${options.width}` : ''}`
    ),
    useOptimizedFonts: jest.fn()
  };
});

describe('OptimizedAssetsExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with initial state', () => {
    render(<OptimizedAssetsExample />);
    
    // Title should be present
    expect(screen.getByText('Optimized Assets Example')).toBeInTheDocument();
    
    // Image controls should be present
    expect(screen.getByText('Landscape')).toBeInTheDocument();
    expect(screen.getByText('Portrait')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Preload Next Image')).toBeInTheDocument();
    
    // Image should be present
    expect(screen.getByAltText(/demo/)).toBeInTheDocument();
    
    // Quality comparison section should be present
    expect(screen.getByText('Quality Comparison')).toBeInTheDocument();
    expect(screen.getByText('Low Quality (30%)')).toBeInTheDocument();
    expect(screen.getByText('High Quality (90%)')).toBeInTheDocument();
  });
  
  test('changes image when buttons are clicked', () => {
    render(<OptimizedAssetsExample />);
    
    // Initially should use landscape
    expect(assetOptimization.useResponsiveImage).toHaveBeenCalledWith(
      '/images/landscape.jpg',
      expect.any(Object)
    );
    
    // Click Portrait button
    fireEvent.click(screen.getByText('Portrait'));
    
    // Should update to portrait image
    expect(assetOptimization.useResponsiveImage).toHaveBeenCalledWith(
      '/images/portrait.jpg',
      expect.any(Object)
    );
    
    // Click Icon button
    fireEvent.click(screen.getByText('Icon'));
    
    // Should update to icon image
    expect(assetOptimization.useResponsiveImage).toHaveBeenCalledWith(
      '/images/icon.png',
      expect.any(Object)
    );
  });
  
  test('preloads next image when button is clicked', () => {
    const mockPreload = jest.fn().mockResolvedValue('/images/portrait.jpg');
    assetOptimization.useImagePreload.mockReturnValue(mockPreload);
    
    render(<OptimizedAssetsExample />);
    
    // Click preload button
    fireEvent.click(screen.getByText('Preload Next Image'));
    
    // Should call preload with next image
    expect(mockPreload).toHaveBeenCalledWith('/images/portrait.jpg');
  });
  
  test('uses optimized fonts', () => {
    render(<OptimizedAssetsExample />);
    
    // Should call useOptimizedFonts
    expect(assetOptimization.useOptimizedFonts).toHaveBeenCalledWith({
      google: {
        families: ['Roboto:400,700', 'Open Sans:400,600']
      },
      preconnect: true,
      display: 'swap'
    });
  });
  
  test('displays technical details', () => {
    render(<OptimizedAssetsExample />);
    
    // Technical details should be present
    expect(screen.getByText('Technical Details')).toBeInTheDocument();
    expect(screen.getByText(/Current Image:/)).toBeInTheDocument();
    expect(screen.getByText(/Source:/)).toBeInTheDocument();
    expect(screen.getByText(/SrcSet:/)).toBeInTheDocument();
    expect(screen.getByText(/Sizes:/)).toBeInTheDocument();
  });
});
