import React, { Suspense, useState, useEffect } from 'react';
import { lazyWithPreload, useComponentPreloader, loadingPerformanceData } from '../../utils/lazyLoading';

// Create placeholder loading components
const LoadingPlaceholder = ({ height = '200px', width = '100%' }) => (
  <div 
    style={{ 
      height, 
      width, 
      backgroundColor: 'var(--color-background-alt, #f5f5f5)',
      borderRadius: 'var(--radius-md, 4px)',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} 
    aria-label="Content is loading"
    role="progressbar"
  />
);

// Define keyframes for the animation
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
  }
`;
document.head.appendChild(styleElement);

// Create lazy-loaded components
const LazyChart = lazyWithPreload(
  () => import('../visualizations/Chart'),
  (metric) => loadingPerformanceData.addMetric(metric)
);

const LazyDataTable = lazyWithPreload(
  () => import('../DataTable'),
  (metric) => loadingPerformanceData.addMetric(metric)
);

const LazyTimelineDetail = lazyWithPreload(
  () => import('../TimelineDetail'),
  (metric) => loadingPerformanceData.addMetric(metric)
);

/**
 * Example component demonstrating lazy loading functionality
 */
const LazyLoadingExample = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [performanceData, setPerformanceData] = useState(null);
  const preloadComponents = useComponentPreloader();
  
  // Effect to preload components when hovering tabs
  useEffect(() => {
    // Preload the active component immediately
    if (activeTab === 'chart') LazyChart.preload();
    if (activeTab === 'table') LazyDataTable.preload();
    if (activeTab === 'timeline') LazyTimelineDetail.preload();
  }, [activeTab]);
  
  // Handle tab mouse enter to preload components
  const handleTabHover = (tabName) => {
    if (tabName === 'chart') preloadComponents([LazyChart]);
    if (tabName === 'table') preloadComponents([LazyDataTable]);
    if (tabName === 'timeline') preloadComponents([LazyTimelineDetail]);
  };
  
  // Get performance data
  const handleShowPerformance = () => {
    setPerformanceData(loadingPerformanceData.getSummary());
  };

  return (
    <div className="lazy-loading-example">
      <h2>Data Visualization</h2>
      
      {/* Tab navigation */}
      <div className="tab-navigation">
        <button 
          className={activeTab === 'chart' ? 'active' : ''}
          onClick={() => setActiveTab('chart')}
          onMouseEnter={() => handleTabHover('chart')}
        >
          Chart View
        </button>
        <button 
          className={activeTab === 'table' ? 'active' : ''}
          onClick={() => setActiveTab('table')}
          onMouseEnter={() => handleTabHover('table')}
        >
          Table View
        </button>
        <button 
          className={activeTab === 'timeline' ? 'active' : ''}
          onClick={() => setActiveTab('timeline')}
          onMouseEnter={() => handleTabHover('timeline')}
        >
          Timeline View
        </button>
      </div>
      
      {/* Content area with Suspense boundary */}
      <div className="content-area">
        <Suspense fallback={<LoadingPlaceholder height="300px" />}>
          {activeTab === 'chart' && <LazyChart />}
          {activeTab === 'table' && <LazyDataTable />}
          {activeTab === 'timeline' && <LazyTimelineDetail />}
        </Suspense>
      </div>
      
      {/* Performance metrics display */}
      <div className="metrics-section">
        <button onClick={handleShowPerformance}>
          Show Loading Performance
        </button>
        
        {performanceData && (
          <div className="performance-metrics">
            <h3>Performance Metrics</h3>
            <ul>
              <li>Average Load Time: {performanceData.averageLoadTimeMs.toFixed(2)}ms</li>
              <li>Max Load Time: {performanceData.maxLoadTimeMs.toFixed(2)}ms</li>
              <li>Min Load Time: {performanceData.minLoadTimeMs.toFixed(2)}ms</li>
              <li>Total Components Loaded: {performanceData.totalComponentsLoaded}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LazyLoadingExample;
