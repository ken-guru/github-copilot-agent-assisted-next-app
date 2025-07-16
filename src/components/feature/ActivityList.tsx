import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { Activity } from '../../types/activity';

interface ActivityListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit, onDelete }) => {
  if (!activities.length) {
    return <div>No activities found</div>;
  }
  return (
    <ListGroup aria-label="Activity List">
      {activities.map(activity => (
        <ListGroup.Item key={activity.id} className="d-flex justify-content-between align-items-center">
          <span>{activity.name}</span>
          <div>
            <Button variant="outline-secondary" size="sm" onClick={() => onEdit?.(activity)} aria-label={`Edit ${activity.name}`}>Edit</Button>{' '}
            <Button variant="outline-danger" size="sm" onClick={() => onDelete?.(activity)} aria-label={`Delete ${activity.name}`}>Delete</Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ActivityList;
