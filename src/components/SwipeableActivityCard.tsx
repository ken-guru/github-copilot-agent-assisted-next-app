'use client';
import React, { useState, ReactNode } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button } from 'react-bootstrap';

interface SwipeableActivityCardProps {
  activity: {
    id: string;
    name?: string;
  };
  onDelete: (activityId: string) => void;
  children: ReactNode;
}

export const SwipeableActivityCard: React.FC<SwipeableActivityCardProps> = ({ 
  activity, 
  onDelete, 
  children 
}) => {
  const [offset, setOffset] = useState(0);
  
  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (e.deltaX < 0) {
        setOffset(Math.max(e.deltaX, -120));
      }
    },
    onSwipedLeft: () => setOffset(-120),
    onSwipedRight: () => setOffset(0),
    preventScrollOnSwipe: true,
    trackMouse: false, // Disable mouse tracking for better performance
  });

  const handleDelete = () => {
    onDelete(activity.id);
    setOffset(0); // Reset offset after delete
  };

  return (
    <div className="swipeable-wrapper">
      <div 
        {...handlers} 
        className="swipeable-content" 
        style={{ transform: `translateX(${offset}px)` }}
      >
        {children}
      </div>
      <div className="swipeable-actions">
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <i className="bi bi-trash" aria-hidden="true"></i> Delete
        </Button>
      </div>
    </div>
  );
};
