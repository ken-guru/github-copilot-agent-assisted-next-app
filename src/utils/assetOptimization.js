import { useCallback, useEffect, useMemo } from 'react';
import { useViewport } from '../hooks/useViewport';

/**
 * Check if webp format is supported
 * @returns {boolean} True if webp is supported
 */
const isWebpSupported = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
};

/**
 * Get device connection info
 * @returns {Object} Connection information
 */
const getConnectionInfo = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return { saveData: false, effectiveType: '4g' };
  }
  
  return {
    saveData: navigator.connection.saveData || false,
    effectiveType: navigator.connection.effectiveType || '4g'
  };
};

/**
 * Get optimized image source URL with appropriate format and quality
 * @param {string} src - Original image source
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageSrc = (src, options = {}) => {
  const {
    width,
    height,
    quality = 80,
    format = 'auto'
  } = options;
  
  // Base path without query parameters
  const basePath = src.split('?')[0];
  const fileExtension = basePath.split('.').pop().toLowerCase();
  
  // Determine the best format
  let outputFormat = fileExtension;
  if (format === 'auto' && isWebpSupported()) {
    outputFormat = 'webp';
  } else if (format !== 'auto') {
    outputFormat = format;
  }
  
  // Adjust quality and dimensions based on connection
  const { saveData, effectiveType } = getConnectionInfo();
  
  let finalQuality = quality;
  let finalWidth = width;
  let finalHeight = height;
  
  // Reduce quality and size for slow connections or data-save mode
  if (saveData) {
    finalQuality = Math.max(quality - 15, 50);
    if (width && height) {
      finalWidth = Math.round(width * 0.75);
      finalHeight = Math.round(height * 0.75);
    }
  } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
    finalQuality = Math.max(quality - 20, 50);
  } else if (effectiveType === '3g') {
    finalQuality = Math.max(quality - 10, 60);
  }
  
  // Build the output URL
  let outputPath;
  if (outputFormat !== fileExtension) {
    // Change file extension if format is different
    outputPath = basePath.replace(new RegExp(`\\.${fileExtension}$`), `.${outputFormat}`);
  } else {
    outputPath = basePath;
  }
  
  // Add query parameters
  const params = [];
  
  if (finalWidth) params.push(`w=${finalWidth}`);
  if (finalHeight) params.push(`h=${finalHeight}`);
  if (finalQuality) params.push(`q=${finalQuality}`);
  
  if (params.length > 0) {
    outputPath += `?${params.join('&')}`;
  }
  
  return outputPath;
};

/**
 * Hook for generating responsive image attributes
 * @param {string} src - Image source
 * @param {Object} options - Configuration options
 * @returns {Object} Responsive image attributes (src, srcSet, sizes)
 */
export const useResponsiveImage = (src, options = {}) => {
  const {
    mobileSizes = [320, 480],
    tabletSizes = [640, 768],
    desktopSizes = [1024, 1280, 1920],
    defaultWidth = 800,
    formats = ['auto'],
    quality = 80
  } = options;
  
  const { width: viewportWidth, isMobile, isTablet, isDesktop } = useViewport();
  
  // Determine which size set to use based on viewport
  const sizeSet = useMemo(() => {
    if (isMobile) return mobileSizes;
    if (isTablet) return tabletSizes;
    return desktopSizes;
  }, [isMobile, isTablet, mobileSizes, tabletSizes, desktopSizes]);
  
  // Calculate appropriate default size
  const defaultSize = useMemo(() => {
    // Find the smallest size that is larger than the viewport
    const optimalSize = sizeSet.find(size => size >= viewportWidth) || sizeSet[sizeSet.length - 1];
    return optimalSize || defaultWidth;
  }, [sizeSet, viewportWidth, defaultWidth]);
  
  // Generate srcSet for each format
  const srcSetMap = useMemo(() => {
    const result = {};
    
    formats.forEach(format => {
      // Get all sizes for this format
      const sources = [];
      
      [...mobileSizes, ...tabletSizes, ...desktopSizes]
        // Remove duplicates
        .filter((value, index, self) => self.indexOf(value) === index)
        // Sort by width
        .sort((a, b) => a - b)
        // Create source objects
        .forEach(width => {
          sources.push({
            width,
            src: getOptimizedImageSrc(src, { width, quality, format })
          });
        });
      
      result[format] = formatSrcSet(sources);
    });
    
    return result;
  }, [src, mobileSizes, tabletSizes, desktopSizes, formats, quality]);
  
  // Generate sizes attribute
  const sizes = useMemo(() => {
    const parts = [];
    
    if (mobileSizes.length) {
      parts.push(`(max-width: 480px) ${mobileSizes[mobileSizes.length - 1]}px`);
    }
    
    if (tabletSizes.length) {
      parts.push(`(max-width: 768px) ${tabletSizes[tabletSizes.length - 1]}px`);
    }
    
    parts.push(`${desktopSizes[0] || defaultWidth}px`);
    
    return parts.join(', ');
  }, [mobileSizes, tabletSizes, desktopSizes, defaultWidth]);
  
  // Get default image source at the appropriate size
  const defaultSrc = useMemo(() => {
    return getOptimizedImageSrc(src, { 
      width: defaultSize,
      quality,
      format: formats[0]
    });
  }, [src, defaultSize, quality, formats]);
  
  // Combine srcSets of all formats
  const combinedSrcSet = useMemo(() => {
    return formats
      .map(format => srcSetMap[format])
      .filter(Boolean)
      .join(', ');
  }, [formats, srcSetMap]);
  
  return {
    src: defaultSrc,
    srcSet: combinedSrcSet,
    sizes
  };
};

/**
 * Preload an image to ensure it's in the browser cache
 * @param {string} src - Image URL to preload
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Hook for preloading images
 * @returns {Function} Preload function that accepts image URL
 */
export const useImagePreload = () => {
  return useCallback((src) => {
    return preloadImage(src);
  }, []);
};

/**
 * Get the best matching image source from a srcSet for a given width
 * @param {string} srcSet - Image srcSet attribute
 * @param {number} targetWidth - Target width to match
 * @returns {string|null} The best matching image source
 */
export const getImageSizeFromSrcSet = (srcSet, targetWidth) => {
  if (!srcSet) return null;
  
  const sources = srcSet.split(', ').map(source => {
    const [url, width] = source.split(' ');
    return { 
      url, 
      width: parseInt(width.replace('w', ''), 10)
    };
  });
  
  if (sources.length === 0) return null;
  
  // Find the source with the closest width (prefer slightly larger)
  let bestMatch = sources[0];
  let bestDiff = Math.abs(bestMatch.width - targetWidth);
  
  for (const source of sources) {
    const diff = Math.abs(source.width - targetWidth);
    
    // Prefer larger images up to a point
    if (diff <= bestDiff) {
      bestMatch = source;
      bestDiff = diff;
    }
  }
  
  return bestMatch.url;
};

/**
 * Format sources array into srcSet string
 * @param {Array} sources - Array of source objects with src and width
 * @returns {string} Formatted srcSet string
 */
export const formatSrcSet = (sources) => {
  if (!sources || sources.length === 0) return '';
  
  return sources
    .map(source => `${source.src} ${source.width}w`)
    .join(', ');
};

/**
 * Hook for optimizing font loading
 * @param {Object} config - Font configuration
 */
export const useOptimizedFonts = (config) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const {
      google,
      preconnect = true,
      display = 'swap'
    } = config;
    
    // Add preconnect for Google Fonts
    if (preconnect && google) {
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnectLink);
      
      const preconnectLink2 = document.createElement('link');
      preconnectLink2.rel = 'preconnect';
      preconnectLink2.href = 'https://fonts.gstatic.com';
      preconnectLink2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnectLink2);
    }
    
    // Add Google Fonts
    if (google?.families?.length > 0) {
      const fontFamilies = google.families.map(family => {
        // If it has weights or styles, keep them
        if (family.includes(':')) return family;
        // Otherwise, add display option
        return `${family}:100,300,400,500,700,900`;
      });
      
      // Create URL for Google Fonts API
      const familyParam = fontFamilies.map(family => {
        // Replace spaces with plus and encode
        return family.replace(/ /g, '+');
      }).join('&family=');
      
      // Create link element
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${familyParam}&display=${display}`;
      
      document.head.appendChild(link);
    }
  }, [config]);
};

/**
 * Apply modern font loading optimizations
 * @param {HTMLElement} element - DOM element to apply optimizations to
 */
export const optimizeFontLoading = (element) => {
  if (typeof document === 'undefined' || !element) return;
  
  // Use font-display: swap
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  
  element.appendChild(style);
  
  // Add font-loading class to body
  document.body.classList.add('fonts-loading');
  
  // Remove class when fonts are loaded
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.remove('fonts-loading');
      document.body.classList.add('fonts-loaded');
    });
  } else {
    // Fallback for browsers that don't support document.fonts
    setTimeout(() => {
      document.body.classList.remove('fonts-loading');
      document.body.classList.add('fonts-loaded');
    }, 2000);
  }
};
