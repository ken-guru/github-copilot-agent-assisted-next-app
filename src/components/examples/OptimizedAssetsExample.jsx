import React, { useState, useEffect } from 'react';
import { 
  useResponsiveImage, 
  useImagePreload, 
  getOptimizedImageSrc, 
  useOptimizedFonts 
} from '../../utils/assetOptimization';

// Optimize fonts
const fontConfig = {
  google: {
    families: ['Roboto:400,700', 'Open Sans:400,600']
  },
  preconnect: true,
  display: 'swap'
};

const OptimizedAssetsExample = () => {
  const [loading, setLoading] = useState(true);
  const [loadTimes, setLoadTimes] = useState({});
  const [selectedImage, setSelectedImage] = useState('landscape');
  const preloadImage = useImagePreload();
  
  // Configure optimized fonts
  useOptimizedFonts(fontConfig);
  
  // Example images to demonstrate optimization
  const images = {
    landscape: '/images/landscape.jpg',
    portrait: '/images/portrait.jpg',
    icon: '/images/icon.png'
  };
  
  // Get responsive image attributes
  const { src, srcSet, sizes } = useResponsiveImage(images[selectedImage], {
    mobileSizes: [320, 480],
    tabletSizes: [640, 768],
    desktopSizes: [1024, 1280, 1920],
    formats: ['auto', 'jpg'],
    quality: 85
  });
  
  // Additional optimized images with different settings
  const lowQualitySrc = getOptimizedImageSrc(images[selectedImage], {
    quality: 30,
    width: 320
  });
  
  const highQualitySrc = getOptimizedImageSrc(images[selectedImage], {
    quality: 90,
    width: 1280
  });
  
  // Preload the next image in the sequence
  const preloadNextImage = () => {
    const imageKeys = Object.keys(images);
    const currentIndex = imageKeys.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % imageKeys.length;
    const nextKey = imageKeys[nextIndex];
    
    // Start time for measurement
    const startTime = performance.now();
    
    preloadImage(images[nextKey])
      .then(() => {
        const loadTime = performance.now() - startTime;
        
        setLoadTimes(prev => ({
          ...prev,
          [nextKey]: loadTime.toFixed(0)
        }));
        
        console.log(`Preloaded ${nextKey} in ${loadTime.toFixed(0)}ms`);
      })
      .catch(error => {
        console.error('Failed to preload image:', error);
      });
  };
  
  // Handle image switching
  const handleImageChange = (imageName) => {
    setLoading(true);
    setSelectedImage(imageName);
  };
  
  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedImage]);
  
  return (
    <div className="optimized-assets-example">
      <h2 style={{ fontFamily: 'Roboto, sans-serif' }}>Optimized Assets Example</h2>
      
      {/* Image selection controls */}
      <div className="image-controls">
        <button 
          onClick={() => handleImageChange('landscape')}
          className={selectedImage === 'landscape' ? 'active' : ''}
        >
          Landscape
        </button>
        <button 
          onClick={() => handleImageChange('portrait')}
          className={selectedImage === 'portrait' ? 'active' : ''}
        >
          Portrait
        </button>
        <button 
          onClick={() => handleImageChange('icon')}
          className={selectedImage === 'icon' ? 'active' : ''}
        >
          Icon
        </button>
        <button onClick={preloadNextImage}>
          Preload Next Image
        </button>
      </div>
      
      {/* Optimized responsive image */}
      <div className="image-container">
        {loading && (
          <div className="image-placeholder" aria-label="Image loading">
            Loading...
          </div>
        )}
        <img 
          src={src} 
          srcSet={srcSet} 
          sizes={sizes}
          alt={`${selectedImage} demo`} 
          style={{ opacity: loading ? 0 : 1 }}
          onLoad={() => setLoading(false)}
          width="800" 
          height="450"
          loading="lazy"
          className="responsive-image"
        />
      </div>
      
      {/* Quality comparison */}
      <div className="quality-comparison">
        <h3 style={{ fontFamily: 'Open Sans, sans-serif' }}>Quality Comparison</h3>
        <div className="image-row">
          <div className="image-example">
            <h4>Low Quality (30%)</h4>
            <img 
              src={lowQualitySrc} 
              alt="Low quality example" 
              width="320"
              height="180"
            />
            <p>File size: smaller</p>
          </div>
          
          <div className="image-example">
            <h4>High Quality (90%)</h4>
            <img 
              src={highQualitySrc} 
              alt="High quality example" 
              width="320"
              height="180"
            />
            <p>File size: larger</p>
          </div>
        </div>
      </div>
      
      {/* Performance data */}
      <div className="performance-data">
        <h3 style={{ fontFamily: 'Open Sans, sans-serif' }}>Image Loading Performance</h3>
        <ul>
          {Object.entries(loadTimes).map(([image, time]) => (
            <li key={image}>
              {image}: <strong>{time}ms</strong>
            </li>
          ))}
        </ul>
        
        <div className="technical-details">
          <h4>Technical Details</h4>
          <p><strong>Current Image:</strong> {selectedImage}</p>
          <p><strong>Source:</strong> {src}</p>
          <p><strong>SrcSet:</strong> <code>{srcSet}</code></p>
          <p><strong>Sizes:</strong> <code>{sizes}</code></p>
        </div>
      </div>
    </div>
  );
};

export default OptimizedAssetsExample;
