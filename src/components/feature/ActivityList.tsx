import React from 'react';
import { Button, ListGroup, Badge } from 'react-bootstrap';
import { Activity } from '../../types/activity';
import { getColorDisplay } from '../../utils/colorNames';
import { getActivityColors } from '../../utils/colors';

interface ActivityListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit, onDelete }) => {
  // Get current theme colors for visual indicators
  const activityColors = getActivityColors();

  if (!activities.length) {
    return (
      <div className="text-center py-4">
        <div className="text-muted">
          <i className="fas fa-tasks fa-2x mb-3"></i>
          <p>No activities found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Your Activities</h5>
        <Badge bg="secondary" className="fs-6">
          {activities.length} activity{activities.length !== 1 ? 'ies' : ''}
        </Badge>
      </div>
      
      <ListGroup aria-label="Activity List">
        {activities.map(activity => (
          <ListGroup.Item 
            key={activity.id} 
            className="d-flex justify-content-between align-items-center py-3"
          >
            <div className="d-flex align-items-center">
              <div className="me-3 d-flex align-items-center">
                {/* Color indicator */}
                <div 
                  className="me-2 rounded border"
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: activityColors[activity.colorIndex]?.background || '#f0f0f0',
                    borderColor: activityColors[activity.colorIndex]?.border || '#ccc',
                    borderWidth: '2px'
                  }}
                  title={`Color: ${getColorDisplay(activity.colorIndex)}`}
                  aria-label={`Activity color: ${getColorDisplay(activity.colorIndex)}`}
                ></div>
                <i className="fas fa-circle-check text-success"></i>
              </div>
              <div>
                <h6 className="mb-1">{activity.name}</h6>
                {activity.description && (
                  <p className="text-muted small mb-0">{activity.description}</p>
                )}
                <small className="text-muted">
                  Created: {new Date(activity.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => onEdit?.(activity)} 
                aria-label={`Edit ${activity.name}`}
                className="d-flex align-items-center"
              >
                <i className="fas fa-edit me-1"></i>
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => onDelete?.(activity)} 
                aria-label={`Delete ${activity.name}`}
                className="d-flex align-items-center"
              >
                <i className="fas fa-trash me-1"></i>
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ActivityList;
