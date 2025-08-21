import React from 'react';
import { Button, ListGroup, Card } from 'react-bootstrap';
import { Activity } from '../../types/activity';
import { getColorDisplay } from '../../utils/colorNames';
import { getActivityColorsForTheme } from '../../utils/colors';
import { useThemeReactive } from '../../hooks/useThemeReactive';

interface ActivityListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
  onAdd?: () => void; // New prop for Add Activity button
  onImport?: () => void; // New prop for Import button
  onExport?: () => void; // New prop for Export button
  onReset?: () => void; // New prop for Reset button
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit, onDelete, onAdd, onImport, onExport, onReset }) => {
  // Get current theme and theme-appropriate colors for visual indicators
  const theme = useThemeReactive();
  const activityColors = getActivityColorsForTheme(theme);

  if (!activities.length) {
    return (
      <Card>
        <Card.Header className="card-header-consistent">
          <h5 className="mb-0">Your Activities</h5>
          {onAdd && (
            <Button variant="primary" onClick={onAdd} size="sm" className="d-flex align-items-center px-3">
              <i className="bi bi-plus me-2"></i>
              Add Activity
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          <div className="text-center py-4">
            <div className="text-muted">
              <i className="bi bi-kanban fa-2x mb-3"></i>
              <p>No activities found</p>
              <p className="mb-0 small">You can import a JSON file or reset to defaults to get started.</p>
            </div>
          </div>
        </Card.Body>
        {(onImport || onReset) && (
          <Card.Footer className={theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}>
            <div className="d-flex gap-2 justify-content-center">
              {onImport && (
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={onImport}
                  className="d-flex align-items-center px-3"
                  title="Import activities from JSON file"
                >
                  <i className="bi bi-upload me-2"></i>
                  Import
                </Button>
              )}
              {onReset && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={onReset}
                  className="d-flex align-items-center px-3"
                  title="Reset to default activities"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reset Activities
                </Button>
              )}
            </div>
          </Card.Footer>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="card-header-consistent">
        <h5 className="mb-0">Your Activities</h5>
        {onAdd && (
          <Button variant="primary" onClick={onAdd} size="sm" className="d-flex align-items-center px-3">
            <i className="bi bi-plus me-2"></i>
            Add Activity
          </Button>
        )}
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush" aria-label="Activity List">
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
                  aria-hidden="true"
                ></div>
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
                className="d-flex align-items-center px-3"
              >
                <i className="bi bi-pencil me-2"></i>
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => onDelete?.(activity)} 
                aria-label={`Delete ${activity.name}`}
                className="d-flex align-items-center px-3"
              >
                <i className="bi bi-trash me-2"></i>
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
        </ListGroup>
      </Card.Body>
      {/* Toolbar at bottom of activities card - only render if actions are available */}
      {(onImport || onExport || onReset) && (
        <Card.Footer className={theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}>
          <div className="d-flex gap-2 justify-content-center">
            {onImport && (
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={onImport}
                className="d-flex align-items-center px-3"
                title="Import activities from JSON file"
              >
                <i className="bi bi-upload me-2"></i>
                Import
              </Button>
            )}
            {onExport && (
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={onExport}
                className="d-flex align-items-center px-3"
                title="Export activities to JSON file"
              >
                <i className="bi bi-download me-2"></i>
                Export
              </Button>
            )}
            {onReset && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={onReset}
                className="d-flex align-items-center px-3"
                title="Reset to default activities"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset Activities
              </Button>
            )}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ActivityList;
