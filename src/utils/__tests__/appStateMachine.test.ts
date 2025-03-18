import { AppStateMachine, AppStateType } from '../appStateMachine';

describe('AppStateMachine', () => {
  let stateMachine: AppStateMachine;

  beforeEach(() => {
    stateMachine = new AppStateMachine();
  });

  describe('Initial State', () => {
    test('should initialize with SETUP state', () => {
      expect(stateMachine.getCurrentState()).toBe('SETUP');
      expect(stateMachine.isSetup()).toBe(true);
      expect(stateMachine.isPlanning()).toBe(false);
      expect(stateMachine.isActivity()).toBe(false);
      expect(stateMachine.isCompleted()).toBe(false);
    });
  });

  describe('Valid State Transitions', () => {
    test('should transition from SETUP to PLANNING', () => {
      expect(stateMachine.canTransitionTo('PLANNING')).toBe(true);
      
      stateMachine.moveToPlanning();
      expect(stateMachine.getCurrentState()).toBe('PLANNING');
      expect(stateMachine.isPlanning()).toBe(true);
    });

    test('should transition from PLANNING to ACTIVITY', () => {
      stateMachine.moveToPlanning();
      expect(stateMachine.canTransitionTo('ACTIVITY')).toBe(true);
      
      stateMachine.moveToActivity();
      expect(stateMachine.getCurrentState()).toBe('ACTIVITY');
      expect(stateMachine.isActivity()).toBe(true);
    });

    test('should transition from ACTIVITY to COMPLETED', () => {
      stateMachine.moveToPlanning();
      stateMachine.moveToActivity();
      expect(stateMachine.canTransitionTo('COMPLETED')).toBe(true);
      
      stateMachine.moveToCompleted();
      expect(stateMachine.getCurrentState()).toBe('COMPLETED');
      expect(stateMachine.isCompleted()).toBe(true);
    });

    test('should reset from COMPLETED to SETUP', () => {
      stateMachine.moveToPlanning();
      stateMachine.moveToActivity();
      stateMachine.moveToCompleted();
      expect(stateMachine.canTransitionTo('SETUP')).toBe(true);
      
      stateMachine.reset();
      expect(stateMachine.getCurrentState()).toBe('SETUP');
      expect(stateMachine.isSetup()).toBe(true);
    });
  });

  describe('Invalid State Transitions', () => {
    test('should not allow skipping states', () => {
      // Cannot go from SETUP to ACTIVITY (skipping PLANNING)
      expect(stateMachine.canTransitionTo('ACTIVITY')).toBe(false);
      expect(() => stateMachine.moveToActivity()).toThrow();
      
      // Cannot go from SETUP to COMPLETED (skipping PLANNING and ACTIVITY)
      expect(stateMachine.canTransitionTo('COMPLETED')).toBe(false);
      expect(() => stateMachine.moveToCompleted()).toThrow();
      
      // Move to PLANNING
      stateMachine.moveToPlanning();
      
      // Cannot go from PLANNING to COMPLETED (skipping ACTIVITY)
      expect(stateMachine.canTransitionTo('COMPLETED')).toBe(false);
      expect(() => stateMachine.moveToCompleted()).toThrow();
    });

    test('should not allow backwards transitions except reset', () => {
      // Move through states
      stateMachine.moveToPlanning();
      
      // Cannot go back to SETUP
      expect(stateMachine.canTransitionTo('SETUP')).toBe(false);
      expect(() => stateMachine.transitionTo('SETUP')).toThrow();
      
      stateMachine.moveToActivity();
      
      // Cannot go back to PLANNING or SETUP
      expect(stateMachine.canTransitionTo('PLANNING')).toBe(false);
      expect(() => stateMachine.transitionTo('PLANNING')).toThrow();
      expect(stateMachine.canTransitionTo('SETUP')).toBe(false);
      expect(() => stateMachine.transitionTo('SETUP')).toThrow();
      
      stateMachine.moveToCompleted();
      
      // Cannot go back to ACTIVITY or PLANNING
      expect(stateMachine.canTransitionTo('ACTIVITY')).toBe(false);
      expect(() => stateMachine.transitionTo('ACTIVITY')).toThrow();
      expect(stateMachine.canTransitionTo('PLANNING')).toBe(false);
      expect(() => stateMachine.transitionTo('PLANNING')).toThrow();
    });

    test('should not allow reset unless in COMPLETED state', () => {
      // Cannot reset from SETUP
      expect(() => stateMachine.reset()).toThrow();
      
      // Cannot reset from PLANNING
      stateMachine.moveToPlanning();
      expect(() => stateMachine.reset()).toThrow();
      
      // Cannot reset from ACTIVITY
      stateMachine.moveToActivity();
      expect(() => stateMachine.reset()).toThrow();
      
      // Can reset from COMPLETED
      stateMachine.moveToCompleted();
      expect(() => stateMachine.reset()).not.toThrow();
    });
  });
});