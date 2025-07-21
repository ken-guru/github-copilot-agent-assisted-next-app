import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityForm from '../feature/ActivityForm';
import { Activity } from '../../types/activity';

describe('ActivityForm - Smart Color Selection (Issue #241)', () => {
  const mockExistingActivities: Activity[] = [
    {
      id: '1',
      name: 'Homework',
      colorIndex: 0, // Green
      createdAt: '2025-01-01T00:00:00.000Z',
      isActive: true
    },
    {
      id: '2', 
      name: 'Reading',
      colorIndex: 1, // Blue
      createdAt: '2025-01-01T00:00:00.000Z',
      isActive: true
    },
    {
      id: '3',
      name: 'Play Time', 
      colorIndex: 2, // Orange
      createdAt: '2025-01-01T00:00:00.000Z',
      isActive: true
    },
    {
      id: '4',
      name: 'Chores',
      colorIndex: 3, // Purple
      createdAt: '2025-01-01T00:00:00.000Z',
      isActive: true
    }
  ];

  it('should default to first unused color (Red, index 4) when colors 0-3 are used', () => {
    render(
      <ActivityForm 
        existingActivities={mockExistingActivities}
        onAddActivity={() => {}}
      />
    );

    // Check that the form defaults to colorIndex 4 (Red)
    const colorInput = screen.getByDisplayValue('4');
    expect(colorInput).toBeInTheDocument();
    
    // Check that "Red" is displayed as the selected color
    const redButton = screen.getByText('Red');
    expect(redButton).toBeInTheDocument();
  });

  it('should default to Green (index 0) when no existing activities', () => {
    render(
      <ActivityForm 
        existingActivities={[]}
        onAddActivity={() => {}}
      />
    );

    // Check that the form defaults to colorIndex 0 (Green)
    const colorInput = screen.getByDisplayValue('0');
    expect(colorInput).toBeInTheDocument();
    
    // Check that "Green" is displayed as the selected color
    const greenButton = screen.getByText('Green');
    expect(greenButton).toBeInTheDocument();
  });

  it('should select least used color when all colors are in use', () => {
    // Create activities that use all 12 colors, with some used more than others
    const allColorsUsed: Activity[] = [
      // Use all colors 0-11 once
      { id: '1', name: 'Activity 1', colorIndex: 0, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '2', name: 'Activity 2', colorIndex: 1, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '3', name: 'Activity 3', colorIndex: 2, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '4', name: 'Activity 4', colorIndex: 3, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '5', name: 'Activity 5', colorIndex: 4, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '6', name: 'Activity 6', colorIndex: 5, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '7', name: 'Activity 7', colorIndex: 6, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '8', name: 'Activity 8', colorIndex: 7, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '9', name: 'Activity 9', colorIndex: 8, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '10', name: 'Activity 10', colorIndex: 9, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '11', name: 'Activity 11', colorIndex: 10, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '12', name: 'Activity 12', colorIndex: 11, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      // Use some colors additional times
      { id: '13', name: 'Activity 13', colorIndex: 5, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }, // Cyan used twice
      { id: '14', name: 'Activity 14', colorIndex: 8, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }, // Indigo used twice
    ];

    render(
      <ActivityForm 
        existingActivities={allColorsUsed}
        onAddActivity={() => {}}
      />
    );

    // Should default to colorIndex 0 (Green) since colors 0, 1, 2, 3, 4, 6, 7, 9, 10, 11 are used once each
    // and color 0 (Green) is the first/lowest index among the least used
    const colorInput = screen.getByDisplayValue('0');
    expect(colorInput).toBeInTheDocument();
    
    const greenButton = screen.getByText('Green');
    expect(greenButton).toBeInTheDocument();
  });
});
