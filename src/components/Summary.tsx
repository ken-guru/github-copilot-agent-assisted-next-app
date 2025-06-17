import React, { useEffect, useState } from 'react';
import { TimelineEntry } from '@/types';
import { Card, ListGroup, Badge, Alert } from 'react-bootstrap';

interface SummaryProps {
  entries?: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  timerActive?: boolean;
  allActivitiesCompleted?: boolean;
  isTimeUp?: boolean;
}

export default function Summary({ 
  entries = [], 
  totalDuration, 
  elapsedTime, 
  timerActive = false,
  allActivitiesCompleted = false,
  isTimeUp = false
}: SummaryProps) {
  const formatDuration = (seconds: number): string => {
    seconds = Math.round(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const calculateActivityStats = () => {
    if (!entries || entries.length === 0) return null;
    const stats = { idleTime: 0, activeTime: 0 };
    let lastEndTime: number | null = null;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry) continue;
      const endTime = entry.endTime ?? Date.now();
      if (lastEndTime && entry.startTime > lastEndTime) {
        stats.idleTime += Math.round((entry.startTime - lastEndTime) / 1000);
      }
      const duration = Math.round((endTime - entry.startTime) / 1000);
      if (entry.activityId) {
        stats.activeTime += duration;
      } else {
        stats.idleTime += duration;
      }
      lastEndTime = endTime;
    }
    return stats;
  };

  const stats = calculateActivityStats();
  if (!stats) return null;

  const activityTimes = entries.map(entry => ({
    id: entry.activityId || '',
    name: entry.activityName || 'Unnamed Activity',
    duration: Math.round(((entry.endTime ?? Date.now()) - entry.startTime) / 1000)
  }));

  return (
    <Card className="mb-3">
      <Card.Header as="h3">Summary</Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Planned Time:</strong> {formatDuration(totalDuration)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Spent Time:</strong> {formatDuration(elapsedTime)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Idle Time:</strong> {formatDuration(stats.idleTime)}
          </ListGroup.Item>
        </ListGroup>
        {activityTimes.length > 0 ? (
          <ListGroup className="mt-3">
            {activityTimes.map(activity => (
              <ListGroup.Item key={activity.id} className="d-flex justify-content-between align-items-center">
                <span>{activity.name}</span>
                <Badge bg="info">{formatDuration(activity.duration)}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="info" className="mt-3">
            No activities completed yet.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}