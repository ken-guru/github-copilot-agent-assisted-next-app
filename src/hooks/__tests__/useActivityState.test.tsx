import { renderHook, act } from '@testing-library/react';
import { useActivityState } from '../useActivityState';

describe('useActivityState', () => {
  const mockActivity1 = { id: '1', name: 'Test Activity 1' };
  const mockActivity2 = { id: '2', name: 'Test Activity 2' };
  const mockActivity3 = { id: '3', name: 'Test Activity 3' };

  const waitForStateUpdate = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));

  it('should mark all activities as completed when completing activities one by one', async () => {
    const { result } = renderHook(() => useActivityState());

    // First, start tracking these activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();

    // Debug state
    console.log('After first activity:', {
      activities: Array.from(result.current.activities),
      completed: result.current.completedActivityIds,
      allCompleted: result.current.allActivitiesCompleted
    });
    
    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Now complete them one by one
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    // Debug state after completing first activity
    console.log('After completing first activity:', {
      activities: Array.from(result.current.activities),
      completed: result.current.completedActivityIds,
      allCompleted: result.current.allActivitiesCompleted
    });

    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    // Debug final state
    console.log('Final state:', {
      activities: Array.from(result.current.activities),
      completed: result.current.completedActivityIds,
      allCompleted: result.current.allActivitiesCompleted
    });

    expect(result.current.allActivitiesCompleted).toBe(true);
  });

  it('should mark all activities as completed when removing uncompleted activities', async () => {
    const { result } = renderHook(() => useActivityState());

    // First, start tracking these activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    console.log('After first activity:', {
      activities: Array.from(result.current.activities),
      completed: result.current.completedActivityIds,
      allCompleted: result.current.allActivitiesCompleted
    });
    
    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Start first activity
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    console.log('After starting activity:', {
      activities: Array.from(result.current.activities),
      completed: result.current.completedActivityIds,
      allCompleted: result.current.allActivitiesCompleted
    });

    // Remove other activities
    act(() => {
      result.current.handleActivityRemoval(mockActivity2.id);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivityRemoval(mockActivity3.id);
    });
    await waitForStateUpdate();
    console.log('After removing activities:', {
      activities: Array.from(result.current.activities),
      completed: result.current.completedActivityIds,
      allCompleted: result.current.allActivitiesCompleted
    });

    // Complete the running activity
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();
    console.log('Final state:', {
      activities: Array.from(result.current.activities),
      completed: result.current.completedActivityIds,
      allCompleted: result.current.allActivitiesCompleted
    });

    expect(result.current.allActivitiesCompleted).toBe(true);
  });

  it('should mark all activities as completed when completing one and removing the rest', async () => {
    const { result } = renderHook(() => useActivityState());

    // First, start tracking these activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Start and complete first activity
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    // Remove remaining activities
    act(() => {
      result.current.handleActivityRemoval(mockActivity2.id);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivityRemoval(mockActivity3.id);
    });
    await waitForStateUpdate();

    expect(result.current.allActivitiesCompleted).toBe(true);
  });

  it('should mark all activities as completed when removing all activities without starting any', async () => {
    const { result } = renderHook(() => useActivityState());

    // Initialize activities one by one
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Deselect any active activity
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    // Remove all activities without starting any
    act(() => {
      result.current.handleActivityRemoval(mockActivity1.id);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivityRemoval(mockActivity2.id);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivityRemoval(mockActivity3.id);
    });
    await waitForStateUpdate();

    expect(result.current.allActivitiesCompleted).toBe(true);
  });
});