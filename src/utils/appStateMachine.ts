/**
 * Application Flow State Machine
 * 
 * This module implements a state machine for managing the overall application flow.
 * The application transitions through these states:
 * - SETUP: Initial state for configuring time settings
 * - PLANNING: State for adding, removing, and reordering activities
 * - ACTIVITY: State for executing activities (start and complete)
 * - COMPLETED: Final state after all activities are handled
 * 
 * Valid transitions:
 * - SETUP → PLANNING → ACTIVITY → COMPLETED
 */

export type AppStateType = 'SETUP' | 'PLANNING' | 'ACTIVITY' | 'COMPLETED';

export class AppStateMachine {
  private currentState: AppStateType;

  constructor() {
    this.currentState = 'SETUP';
  }

  /**
   * Get the current application state
   */
  getCurrentState(): AppStateType {
    return this.currentState;
  }

  /**
   * Check if the state machine can transition to the given state
   */
  canTransitionTo(state: AppStateType): boolean {
    // Define valid transitions
    switch (this.currentState) {
      case 'SETUP':
        return state === 'PLANNING';
      case 'PLANNING':
        return state === 'ACTIVITY';
      case 'ACTIVITY':
        return state === 'COMPLETED';
      case 'COMPLETED':
        return state === 'SETUP'; // Only allow reset to SETUP from COMPLETED
      default:
        return false;
    }
  }

  /**
   * Transition to the given state if it's a valid transition
   * @throws Error if transition is invalid
   */
  transitionTo(state: AppStateType): void {
    if (!this.canTransitionTo(state)) {
      throw new Error(`Cannot transition from ${this.currentState} to ${state}`);
    }
    this.currentState = state;
  }

  /**
   * Move to the PLANNING state from SETUP
   * @throws Error if current state is not SETUP
   */
  moveToPlanning(): void {
    this.transitionTo('PLANNING');
  }

  /**
   * Move to the ACTIVITY state from PLANNING
   * @throws Error if current state is not PLANNING
   */
  moveToActivity(): void {
    this.transitionTo('ACTIVITY');
  }

  /**
   * Move to the COMPLETED state from ACTIVITY
   * @throws Error if current state is not ACTIVITY
   */
  moveToCompleted(): void {
    this.transitionTo('COMPLETED');
  }

  /**
   * Reset to the SETUP state from COMPLETED
   * @throws Error if current state is not COMPLETED
   */
  reset(): void {
    if (this.currentState !== 'COMPLETED') {
      throw new Error(`Cannot reset from ${this.currentState} state, must be in COMPLETED state`);
    }
    this.currentState = 'SETUP';
  }

  /**
   * Check if the current state is SETUP
   */
  isSetup(): boolean {
    return this.currentState === 'SETUP';
  }

  /**
   * Check if the current state is PLANNING
   */
  isPlanning(): boolean {
    return this.currentState === 'PLANNING';
  }

  /**
   * Check if the current state is ACTIVITY
   */
  isActivity(): boolean {
    return this.currentState === 'ACTIVITY';
  }

  /**
   * Check if the current state is COMPLETED
   */
  isCompleted(): boolean {
    return this.currentState === 'COMPLETED';
  }
}