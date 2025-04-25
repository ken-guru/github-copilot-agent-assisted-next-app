# Asset Optimization Guide

This guide provides best practices for optimizing assets in our mobile React application, with a focus on images, fonts, and other media to ensure fast loading and smooth experience on mobile devices.

## Table of Contents

1. [Image Optimization](#image-optimization)
2. [Font Optimization](#font-optimization)
3. [SVG Optimization](#svg-optimization)
4. [Video Optimization](#video-optimization)
5. [Network-Aware Loading](#network-aware-loading)
6. [Preloading Strategies](#preloading-strategies)
7. [Measuring Asset Performance](#measuring-asset-performance)

## Image Optimization

### Use Responsive Images

Always provide multiple image sizes using the `useResponsiveImage` hook:

```jsx
const { src, srcSet, sizes } = useResponsiveImage('/images/photo.jpg', {
  mobileSizes: [320, 480],
  tabletSizes: [640, 768],
  desktopSizes: [1024, 1280, 1920]
});

return (
  <img 
    src={src} 
    srcSet={srcSet} 
    sizes={sizes}
    alt="Description" 
    loading="lazy"
  />
);
```

### Choose the Right Format

Let the utilities determine the best format based on browser support:

```jsx
// Automatically chooses WebP when supported
const optimizedSrc = getOptimizedImageSrc('/images/photo.jpg', {
  format: 'auto',
  quality: 85
});
```

### Use Appropriate Quality Settings

Balance quality vs. file size:
- Photos/complex images: 75-85%
- Icons/simple graphics: 90%
- Text-heavy images: 85-90%

### Apply Loading Attributes

Use appropriate loading strategies:
- `loading="lazy"` for below-the-fold images
- `loading="eager"` for hero images and above-the-fold content
- `fetchpriority="high"` for the most important images

### Image Guidelines by Type

| Image Type | Format | Quality | Loading |
|------------|--------|---------|---------|
| Hero | JPEG/WebP | 80-85% | eager, high priority |
| Product | JPEG/WebP | 80-90% | lazy |
| Icons | SVG/WebP | 90% | lazy |
| Thumbnails | WebP | 70-80% | lazy |
| Background | JPEG/WebP | 70-80% | lazy |

## Font Optimization

### Optimize Font Loading

Use the `useOptimizedFonts` hook for better font performance:

```jsx
useOptimizedFonts({
  google: {
    families: ['Roboto:400,700', 'Open Sans:400']
  },
  preconnect: true,
  display: 'swap'
});
```

### Limit Font Weights and Styles

Each font weight and style is a separate download. Limit to what you actually need:

```javascript
// Good: Only necessary weights
'Roboto:400,500,700'

// Bad: Too many unused weights
'Roboto:100,200,300,400,500,600,700,800,900,100i,200i...'
```

### Use Font Display Settings

Always use appropriate font-display settings:
- `swap`: Shows fallback font immediately until custom font loads (best for most text)
- `optional`: Only uses custom font if already cached (best for non-essential text)
- `fallback`: Short block period, then fallback (compromise between swap and block)

### System Font Stack

Consider using system fonts for better performance:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
```

## SVG Optimization

### Optimize SVG Files

- Remove unnecessary metadata
- Simplify paths
- Use fewer points
- Avoid unnecessary precision

### Inline Critical SVGs

For frequently used small SVGs, consider inlining:

```jsx
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <path d="M6.5 12.5L3 9l1.4-1.4 2.1 2.1 5.1-5.1 1.4 1.4z" />
  </svg>
);
```

### Use SVG Sprites for Icon Sets

Combine multiple icons into a sprite sheet to reduce HTTP requests:

```jsx
// Access from sprite sheet
const IconComponent = ({ name }) => (
  <svg>
    <use xlinkHref={`/sprite.svg#${name}`} />
  </svg>
);
```

## Video Optimization

### Use Appropriate Video Formats

- MP4 (H.264) for wide compatibility
- WebM for better compression when supported

### Lazy Load Videos

Don't load videos until they're close to the viewport:

```jsx
const VideoComponent = () => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.load();
        }
      },
      { rootMargin: '200px' }
    );
    
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);
  
  return (
    <video 
      ref={videoRef}
      poster="/path/to/poster.jpg"
      preload="none"
      controls
    >
      <source src="/path/to/video.webm" type="video/webm" />
      <source src="/path/to/video.mp4" type="video/mp4" />
    </video>
  );
};
```

### Provide Poster Images

Always include a poster image that loads before the video:

```html
<video poster="/path/to/poster.jpg">
  <!-- sources -->
</video>
```

## Network-Aware Loading

### Detect Connection Speed

Use the Network Information API when available:

```javascript
const getConnectionSpeed = () => {
  if (!navigator.connection) return 'unknown';
  
  return navigator.connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
};
```

### Adapt Content to Connection

Provide lower quality resources on slower connections:

```javascript
const getAppropriateImageQuality = () => {
  if (!navigator.connection) return 80;
  
  switch (navigator.connection.effectiveType) {
    case 'slow-2g':
    case '2g':
      return 50;
    case '3g':
      return 65;
    default:
      return 80;
  }
};
```

### Respect Save-Data Preference

Provide low-data alternatives when users have enabled data saving:

```javascript
const shouldUseLowDataMode = () => {
  return navigator.connection && navigator.connection.saveData;
};
```

## Preloading Strategies

### Critical Resources

Use link preload for critical resources:

```html
<link rel="preload" href="/fonts/critical-font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/images/hero-image.webp" as="image">
```

### Component-Specific Preloading

Use the `useImagePreload` hook for component-specific preloading:

```jsx
const preloadImage = useImagePreload();

// Later, when appropriate
preloadImage('/images/next-page-hero.jpg')
  .then(() => console.log('Preloaded successfully'))
  .catch(err => console.error('Preload failed:', err));
```

### Intelligent Preloading

Preload based on user behavior:

```jsx
const NavLink = ({ to, preloadImage }) => {
  const handleMouseEnter = useCallback(() => {
    // Preload the page's hero image when hovering over its link
    preloadImage(`/images/${to}-hero.jpg`);
  }, [to, preloadImage]);
  
  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {to}
    </Link>
  );
};
```

## Measuring Asset Performance

### Key Metrics to Track

- **Image Loading Time**: Time to load and decode images
- **First Contentful Paint**: When the first content is painted
- **Largest Contentful Paint**: When the largest content element is painted
- **Layout Shifts**: Cumulative Layout Shift due to late-loading assets
- **Total Transfer Size**: Amount of data transferred

### Performance Budget

Establish and maintain performance budgets:
- Total image weight per page: < 700KB
- Maximum image size: < 200KB
- Critical-path resources: < 150KB
- Fonts: < 100KB total
- Layout shifts from assets: CLS < 0.1

### Monitoring Tools

- Lighthouse for lab testing
- Web Vitals for field data
- Network panel in DevTools for size analysis
- Performance panel for loading bottlenecks

### Automation

Consider automating asset optimization:
- Add image optimization to the build pipeline
- Set up size budgets in CI
- Automate responsive image generation
- Implement automatic WebP conversion
