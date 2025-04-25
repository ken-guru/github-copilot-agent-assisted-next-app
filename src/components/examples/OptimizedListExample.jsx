import React, { useState, useCallback, useEffect } from 'react';
import { 
  useMemoizedValue,
  useStableCallback,
  useDebouncedValue,
  useThrottledCallback,
  usePreventUnnecessaryRenders,
  measureRenderTime,
  useRenderWarning
} from '../../utils/renderOptimization';

// Helper to generate a large list of items
const generateItems = (count) => {
  return Array(count).fill(0).map((_, index) => ({
    id: `item-${index}`,
    name: `Item ${index}`,
    value: Math.floor(Math.random() * 1000)
  }));
};

// Individual item component optimized with memoization
const ListItem = usePreventUnnecessaryRenders(({ item, onSelect }) => {
  // Only re-render if item.id or item.name change
  useRenderWarning(`ListItem-${item.id}`, 5);
  
  return (
    <div className="list-item">
      <span className="item-name">{item.name}</span>
      <span className="item-value">{item.value}</span>
      <button onClick={() => onSelect(item)}>Select</button>
    </div>
  );
}, ['item.id', 'item.name', 'item.value']);

// List component with optimization techniques
const OptimizedListExample = ({ initialItemCount = 100 }) => {
  const [items, setItems] = useState(() => generateItems(initialItemCount));
  const [filter, setFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Use debounced value for filter to prevent rapid re-renders
  const debouncedFilter = useDebouncedValue(filter, 300);
  
  // Memoize filtered items to prevent recalculation on every render
  const filteredItems = useMemoizedValue(
    items.filter(item => 
      item.name.toLowerCase().includes(debouncedFilter.toLowerCase())
    ),
    [items, debouncedFilter]
  );
  
  // Create stable callback reference for item selection
  const handleSelect = useStableCallback((item) => {
    setSelectedItem(item);
    console.log(`Selected item: ${item.name}`);
  });
  
  // Throttled handler for scroll events
  const handleScroll = useThrottledCallback(() => {
    console.log('List scrolled');
  }, 200);
  
  // Simulate a potentially expensive operation
  const refreshItems = useCallback(() => {
    console.log('Refreshing items...');
    setItems(generateItems(initialItemCount));
  }, [initialItemCount]);
  
  // Throttled version of refresh
  const throttledRefresh = useThrottledCallback(refreshItems, 1000);
  
  // Measure initial render time
  useEffect(() => {
    const stop = measureRenderTime('OptimizedListExample');
    return stop;
  }, []);
  
  return (
    <div className="optimized-list">
      <h2>Optimized List Example</h2>
      
      <div className="list-controls">
        <div className="filter-container">
          <label htmlFor="filter">Filter: </label>
          <input 
            id="filter"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter items..."
          />
          {filter !== debouncedFilter && <span className="debounce-indicator">...</span>}
        </div>
        
        <button onClick={throttledRefresh}>
          Refresh Items
        </button>
      </div>
      
      <div className="list-container" onScroll={handleScroll}>
        {filteredItems.length > 0 ? (
          <div className="list">
            {filteredItems.map(item => (
              <ListItem
                key={item.id}
                item={item}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">No items match your filter</div>
        )}
      </div>
      
      {selectedItem && (
        <div className="selected-item">
          <h3>Selected Item</h3>
          <p>ID: {selectedItem.id}</p>
          <p>Name: {selectedItem.name}</p>
          <p>Value: {selectedItem.value}</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedListExample;
