/**
 * User Acceptance Testing Utilities
 * 
 * Comprehensive utilities for conducting user acceptance testing
 * of the Material 3 Expressive design system implementation.
 */

export interface TestScenario {
  id: string;
  title: string;
  description: string;
  category: 'navigation' | 'forms' | 'interactions' | 'accessibility' | 'mobile' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  steps: TestStep[];
  expectedOutcome: string;
  actualOutcome?: string;
  status: 'pending' | 'in-progress' | 'passed' | 'failed';
  notes?: string;
  screenshots?: string[];
}

export interface TestStep {
  id: string;
  action: string;
  element?: string;
  expectedResult: string;
  completed: boolean;
}

export interface TestSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  tester: string;
  device: string;
  browser: string;
  scenarios: TestScenario[];
  overallFeedback: string;
  rating: number; // 1-5 scale
}

export interface UATReport {
  totalScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  criticalIssues: TestScenario[];
  commonIssues: string[];
  userFeedback: string[];
  recommendations: string[];
  overallRating: number;
}

/**
 * User Acceptance Testing Manager
 */
export class UserAcceptanceTestingManager {
  private static instance: UserAcceptanceTestingManager;
  private testScenarios: TestScenario[] = [];
  private testSessions: TestSession[] = [];

  static getInstance(): UserAcceptanceTestingManager {
    if (!UserAcceptanceTestingManager.instance) {
      UserAcceptanceTestingManager.instance = new UserAcceptanceTestingManager();
    }
    return UserAcceptanceTestingManager.instance;
  }

  constructor() {
    this.initializeTestScenarios();
  }

  private initializeTestScenarios(): void {
    this.testScenarios = [
      // Navigation Testing
      {
        id: 'nav-001',
        title: 'Primary Navigation Functionality',
        description: 'Test that primary navigation works correctly with Material 3 Expressive design',
        category: 'navigation',
        priority: 'critical',
        status: 'pending',
        steps: [
          {
            id: 'nav-001-1',
            action: 'Click on each navigation item',
            element: 'nav[role="navigation"] a',
            expectedResult: 'Navigation item shows active state with organic pill indicator',
            completed: false,
          },
          {
            id: 'nav-001-2',
            action: 'Hover over navigation items',
            element: 'nav[role="navigation"] a',
            expectedResult: 'Smooth hover animation with subtle scale and color change',
            completed: false,
          },
          {
            id: 'nav-001-3',
            action: 'Use keyboard navigation (Tab key)',
            element: 'nav[role="navigation"] a',
            expectedResult: 'Focus indicators are visible and expressive',
            completed: false,
          },
        ],
        expectedOutcome: 'Navigation is intuitive, visually appealing, and accessible',
      },
      {
        id: 'nav-002',
        title: 'Mobile Navigation Experience',
        description: 'Test navigation behavior on mobile devices',
        category: 'mobile',
        priority: 'critical',
        status: 'pending',
        steps: [
          {
            id: 'nav-002-1',
            action: 'Open application on mobile device',
            expectedResult: 'Navigation adapts to mobile screen size',
            completed: false,
          },
          {
            id: 'nav-002-2',
            action: 'Tap navigation items',
            expectedResult: 'Touch targets are appropriately sized (44px minimum)',
            completed: false,
          },
          {
            id: 'nav-002-3',
            action: 'Test navigation in landscape mode',
            expectedResult: 'Navigation remains functional and visually appealing',
            completed: false,
          },
        ],
        expectedOutcome: 'Mobile navigation is touch-friendly and responsive',
      },

      // Form Testing
      {
        id: 'form-001',
        title: 'Time Setup Form Functionality',
        description: 'Test the time setup form with Material 3 Expressive design',
        category: 'forms',
        priority: 'critical',
        status: 'pending',
        steps: [
          {
            id: 'form-001-1',
            action: 'Click on time input field',
            element: 'input[type="number"]',
            expectedResult: 'Floating label animates smoothly, outline becomes expressive',
            completed: false,
          },
          {
            id: 'form-001-2',
            action: 'Enter valid time values',
            element: 'input[type="number"]',
            expectedResult: 'Input accepts values and shows appropriate feedback',
            completed: false,
          },
          {
            id: 'form-001-3',
            action: 'Enter invalid time values',
            element: 'input[type="number"]',
            expectedResult: 'Validation feedback is clear and expressive',
            completed: false,
          },
          {
            id: 'form-001-4',
            action: 'Submit form',
            element: 'button[type="submit"]',
            expectedResult: 'Form submits successfully with visual feedback',
            completed: false,
          },
        ],
        expectedOutcome: 'Form is intuitive, provides clear feedback, and handles validation gracefully',
      },
      {
        id: 'form-002',
        title: 'Activity Creation Form',
        description: 'Test creating new activities through the form interface',
        category: 'forms',
        priority: 'high',
        status: 'pending',
        steps: [
          {
            id: 'form-002-1',
            action: 'Click "Add Activity" button',
            element: 'button[data-testid="add-activity"]',
            expectedResult: 'Form appears with smooth animation',
            completed: false,
          },
          {
            id: 'form-002-2',
            action: 'Fill in activity name',
            element: 'input[name="activityName"]',
            expectedResult: 'Text field shows Material 3 Expressive styling',
            completed: false,
          },
          {
            id: 'form-002-3',
            action: 'Select activity color',
            element: 'color picker or color buttons',
            expectedResult: 'Color selection is intuitive and visually appealing',
            completed: false,
          },
          {
            id: 'form-002-4',
            action: 'Save activity',
            element: 'button[type="submit"]',
            expectedResult: 'Activity is created and appears in the list',
            completed: false,
          },
        ],
        expectedOutcome: 'Activity creation is smooth and user-friendly',
      },

      // Interaction Testing
      {
        id: 'interact-001',
        title: 'Button Interactions',
        description: 'Test all button variants and their interactions',
        category: 'interactions',
        priority: 'high',
        status: 'pending',
        steps: [
          {
            id: 'interact-001-1',
            action: 'Hover over primary buttons',
            element: 'button.md-button-primary',
            expectedResult: 'Subtle scale and elevation change with smooth animation',
            completed: false,
          },
          {
            id: 'interact-001-2',
            action: 'Click primary buttons',
            element: 'button.md-button-primary',
            expectedResult: 'Ripple effect appears with appropriate timing',
            completed: false,
          },
          {
            id: 'interact-001-3',
            action: 'Test button focus states',
            element: 'button',
            expectedResult: 'Focus indicators are visible and expressive',
            completed: false,
          },
          {
            id: 'interact-001-4',
            action: 'Test disabled button states',
            element: 'button:disabled',
            expectedResult: 'Disabled buttons are clearly indicated and non-interactive',
            completed: false,
          },
        ],
        expectedOutcome: 'All button interactions feel responsive and delightful',
      },
      {
        id: 'interact-002',
        title: 'Activity Management Interactions',
        description: 'Test interactions with activity cards and controls',
        category: 'interactions',
        priority: 'critical',
        status: 'pending',
        steps: [
          {
            id: 'interact-002-1',
            action: 'Start an activity timer',
            element: 'button[data-action="start"]',
            expectedResult: 'Timer starts with visual feedback and state change',
            completed: false,
          },
          {
            id: 'interact-002-2',
            action: 'Pause an active timer',
            element: 'button[data-action="pause"]',
            expectedResult: 'Timer pauses with appropriate visual feedback',
            completed: false,
          },
          {
            id: 'interact-002-3',
            action: 'Complete an activity',
            element: 'button[data-action="complete"]',
            expectedResult: 'Activity shows completed state with celebration animation',
            completed: false,
          },
          {
            id: 'interact-002-4',
            action: 'Delete an activity',
            element: 'button[data-action="delete"]',
            expectedResult: 'Confirmation dialog appears, deletion is smooth',
            completed: false,
          },
        ],
        expectedOutcome: 'Activity management feels intuitive and provides clear feedback',
      },

      // Accessibility Testing
      {
        id: 'a11y-001',
        title: 'Keyboard Navigation',
        description: 'Test complete keyboard navigation throughout the application',
        category: 'accessibility',
        priority: 'critical',
        status: 'pending',
        steps: [
          {
            id: 'a11y-001-1',
            action: 'Navigate using Tab key only',
            expectedResult: 'All interactive elements are reachable and have visible focus',
            completed: false,
          },
          {
            id: 'a11y-001-2',
            action: 'Use Enter/Space to activate buttons',
            expectedResult: 'All buttons respond to keyboard activation',
            completed: false,
          },
          {
            id: 'a11y-001-3',
            action: 'Navigate forms using keyboard',
            expectedResult: 'Form navigation is logical and efficient',
            completed: false,
          },
          {
            id: 'a11y-001-4',
            action: 'Test Escape key functionality',
            expectedResult: 'Escape key closes dialogs and cancels actions appropriately',
            completed: false,
          },
        ],
        expectedOutcome: 'Complete keyboard navigation is possible and intuitive',
      },
      {
        id: 'a11y-002',
        title: 'Screen Reader Compatibility',
        description: 'Test application with screen reader software',
        category: 'accessibility',
        priority: 'critical',
        status: 'pending',
        steps: [
          {
            id: 'a11y-002-1',
            action: 'Navigate with screen reader',
            expectedResult: 'All content is announced clearly and logically',
            completed: false,
          },
          {
            id: 'a11y-002-2',
            action: 'Test form labels and descriptions',
            expectedResult: 'Form fields have clear labels and helpful descriptions',
            completed: false,
          },
          {
            id: 'a11y-002-3',
            action: 'Test dynamic content updates',
            expectedResult: 'Screen reader announces changes appropriately',
            completed: false,
          },
          {
            id: 'a11y-002-4',
            action: 'Test error messages',
            expectedResult: 'Error messages are announced and associated with fields',
            completed: false,
          },
        ],
        expectedOutcome: 'Application is fully usable with screen reader software',
      },

      // Performance Testing
      {
        id: 'perf-001',
        title: 'Animation Performance',
        description: 'Test that animations run smoothly at 60fps',
        category: 'performance',
        priority: 'high',
        status: 'pending',
        steps: [
          {
            id: 'perf-001-1',
            action: 'Trigger multiple animations simultaneously',
            expectedResult: 'Animations remain smooth without jank',
            completed: false,
          },
          {
            id: 'perf-001-2',
            action: 'Test animations on slower devices',
            expectedResult: 'Animations adapt gracefully to device capabilities',
            completed: false,
          },
          {
            id: 'perf-001-3',
            action: 'Test with reduced motion preference',
            expectedResult: 'Animations respect user preference and provide alternatives',
            completed: false,
          },
        ],
        expectedOutcome: 'All animations perform well across different devices and preferences',
      },
      {
        id: 'perf-002',
        title: 'Loading Performance',
        description: 'Test application loading and resource optimization',
        category: 'performance',
        priority: 'medium',
        status: 'pending',
        steps: [
          {
            id: 'perf-002-1',
            action: 'Load application on slow network',
            expectedResult: 'Critical content loads quickly, non-critical content lazy loads',
            completed: false,
          },
          {
            id: 'perf-002-2',
            action: 'Monitor memory usage during use',
            expectedResult: 'Memory usage remains reasonable during extended use',
            completed: false,
          },
          {
            id: 'perf-002-3',
            action: 'Test offline functionality',
            expectedResult: 'Application works offline with appropriate messaging',
            completed: false,
          },
        ],
        expectedOutcome: 'Application loads quickly and performs well under various conditions',
      },

      // Mobile-Specific Testing
      {
        id: 'mobile-001',
        title: 'Touch Interactions',
        description: 'Test touch-specific interactions and gestures',
        category: 'mobile',
        priority: 'high',
        status: 'pending',
        steps: [
          {
            id: 'mobile-001-1',
            action: 'Tap all interactive elements',
            expectedResult: 'Touch targets are appropriately sized and responsive',
            completed: false,
          },
          {
            id: 'mobile-001-2',
            action: 'Test swipe gestures (if applicable)',
            expectedResult: 'Swipe gestures work smoothly and provide feedback',
            completed: false,
          },
          {
            id: 'mobile-001-3',
            action: 'Test pinch-to-zoom behavior',
            expectedResult: 'Zoom behavior is appropriate for the application',
            completed: false,
          },
          {
            id: 'mobile-001-4',
            action: 'Test device rotation',
            expectedResult: 'Layout adapts smoothly to orientation changes',
            completed: false,
          },
        ],
        expectedOutcome: 'Touch interactions feel natural and responsive',
      },
    ];
  }

  /**
   * Start a new test session
   */
  startTestSession(tester: string, device: string, browser: string): string {
    const sessionId = `uat-${Date.now()}`;
    const session: TestSession = {
      id: sessionId,
      startTime: new Date(),
      tester,
      device,
      browser,
      scenarios: [...this.testScenarios],
      overallFeedback: '',
      rating: 0,
    };

    this.testSessions.push(session);
    return sessionId;
  }

  /**
   * Update test scenario status
   */
  updateScenarioStatus(
    sessionId: string,
    scenarioId: string,
    status: TestScenario['status'],
    actualOutcome?: string,
    notes?: string
  ): void {
    const session = this.testSessions.find(s => s.id === sessionId);
    if (!session) return;

    const scenario = session.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    scenario.status = status;
    if (actualOutcome) scenario.actualOutcome = actualOutcome;
    if (notes) scenario.notes = notes;
  }

  /**
   * Update test step completion
   */
  updateStepCompletion(
    sessionId: string,
    scenarioId: string,
    stepId: string,
    completed: boolean
  ): void {
    const session = this.testSessions.find(s => s.id === sessionId);
    if (!session) return;

    const scenario = session.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    const step = scenario.steps.find(s => s.id === stepId);
    if (!step) return;

    step.completed = completed;

    // Auto-update scenario status based on step completion
    const allStepsCompleted = scenario.steps.every(s => s.completed);
    if (allStepsCompleted && scenario.status === 'in-progress') {
      scenario.status = 'passed'; // Default to passed, can be manually changed
    }
  }

  /**
   * Complete test session
   */
  completeTestSession(
    sessionId: string,
    overallFeedback: string,
    rating: number
  ): void {
    const session = this.testSessions.find(s => s.id === sessionId);
    if (!session) return;

    session.endTime = new Date();
    session.overallFeedback = overallFeedback;
    session.rating = Math.max(1, Math.min(5, rating)); // Ensure rating is 1-5
  }

  /**
   * Generate UAT report
   */
  generateUATReport(): UATReport {
    const allScenarios = this.testSessions.flatMap(session => session.scenarios);
    const totalScenarios = allScenarios.length;
    const passedScenarios = allScenarios.filter(s => s.status === 'passed').length;
    const failedScenarios = allScenarios.filter(s => s.status === 'failed').length;
    const criticalIssues = allScenarios.filter(
      s => s.status === 'failed' && s.priority === 'critical'
    );

    // Analyze common issues
    const commonIssues = this.analyzeCommonIssues(allScenarios);

    // Collect user feedback
    const userFeedback = this.testSessions
      .filter(session => session.overallFeedback)
      .map(session => `${session.tester} (${session.device}): ${session.overallFeedback}`);

    // Generate recommendations
    const recommendations = this.generateRecommendations(allScenarios);

    // Calculate overall rating
    const validRatings = this.testSessions
      .filter(session => session.rating > 0)
      .map(session => session.rating);
    const overallRating = validRatings.length > 0
      ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
      : 0;

    return {
      totalScenarios,
      passedScenarios,
      failedScenarios,
      criticalIssues,
      commonIssues,
      userFeedback,
      recommendations,
      overallRating,
    };
  }

  private analyzeCommonIssues(scenarios: TestScenario[]): string[] {
    const failedScenarios = scenarios.filter(s => s.status === 'failed');
    const issueCategories = new Map<string, number>();

    failedScenarios.forEach(scenario => {
      const category = scenario.category;
      issueCategories.set(category, (issueCategories.get(category) || 0) + 1);
    });

    const commonIssues: string[] = [];
    issueCategories.forEach((count, category) => {
      if (count > 1) {
        commonIssues.push(`Multiple issues in ${category} (${count} scenarios affected)`);
      }
    });

    return commonIssues;
  }

  private generateRecommendations(scenarios: TestScenario[]): string[] {
    const recommendations: string[] = [];
    const failedScenarios = scenarios.filter(s => s.status === 'failed');

    if (failedScenarios.length === 0) {
      recommendations.push('🎉 All test scenarios passed! The design system is ready for deployment.');
      return recommendations;
    }

    const criticalFailed = failedScenarios.filter(s => s.priority === 'critical');
    const highFailed = failedScenarios.filter(s => s.priority === 'high');

    if (criticalFailed.length > 0) {
      recommendations.push(`⚠️ ${criticalFailed.length} critical issues must be resolved before deployment.`);
    }

    if (highFailed.length > 0) {
      recommendations.push(`🔶 ${highFailed.length} high-priority issues should be addressed.`);
    }

    // Category-specific recommendations
    const categoryIssues = new Map<string, number>();
    failedScenarios.forEach(scenario => {
      categoryIssues.set(scenario.category, (categoryIssues.get(scenario.category) || 0) + 1);
    });

    categoryIssues.forEach((count, category) => {
      switch (category) {
        case 'accessibility':
          recommendations.push('♿ Focus on accessibility improvements - ensure keyboard navigation and screen reader compatibility.');
          break;
        case 'mobile':
          recommendations.push('📱 Improve mobile experience - check touch targets and responsive behavior.');
          break;
        case 'performance':
          recommendations.push('⚡ Optimize performance - focus on animation smoothness and loading times.');
          break;
        case 'forms':
          recommendations.push('📝 Enhance form usability - improve validation feedback and user guidance.');
          break;
        case 'interactions':
          recommendations.push('🎯 Refine interactions - ensure all interactive elements provide appropriate feedback.');
          break;
        case 'navigation':
          recommendations.push('🧭 Improve navigation - ensure it\'s intuitive and accessible across devices.');
          break;
      }
    });

    recommendations.push('🧪 Conduct additional testing after addressing issues.');
    recommendations.push('📊 Monitor user feedback after deployment for continuous improvement.');

    return recommendations;
  }

  /**
   * Get test scenarios by category
   */
  getScenariosByCategory(category: TestScenario['category']): TestScenario[] {
    return this.testScenarios.filter(scenario => scenario.category === category);
  }

  /**
   * Get test session by ID
   */
  getTestSession(sessionId: string): TestSession | undefined {
    return this.testSessions.find(session => session.id === sessionId);
  }

  /**
   * Get all test sessions
   */
  getAllTestSessions(): TestSession[] {
    return [...this.testSessions];
  }

  /**
   * Export test results to JSON
   */
  exportTestResults(): string {
    const report = this.generateUATReport();
    const exportData = {
      report,
      sessions: this.testSessions,
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Print UAT report
   */
  printUATReport(report: UATReport): void {
    console.group('🧪 User Acceptance Testing Report');
    console.log(`Overall Rating: ${report.overallRating.toFixed(1)}/5.0`);
    console.log(`Test Results: ${report.passedScenarios}/${report.totalScenarios} scenarios passed`);
    
    if (report.failedScenarios > 0) {
      console.log(`Failed Scenarios: ${report.failedScenarios}`);
    }
    
    if (report.criticalIssues.length > 0) {
      console.group('⚠️ Critical Issues');
      report.criticalIssues.forEach(issue => {
        console.log(`- ${issue.title}: ${issue.description}`);
        if (issue.notes) {
          console.log(`  Notes: ${issue.notes}`);
        }
      });
      console.groupEnd();
    }
    
    if (report.commonIssues.length > 0) {
      console.group('🔍 Common Issues');
      report.commonIssues.forEach(issue => console.log(`- ${issue}`));
      console.groupEnd();
    }
    
    if (report.userFeedback.length > 0) {
      console.group('💬 User Feedback');
      report.userFeedback.forEach(feedback => console.log(`- ${feedback}`));
      console.groupEnd();
    }
    
    console.group('📋 Recommendations');
    report.recommendations.forEach(rec => console.log(rec));
    console.groupEnd();
    
    console.groupEnd();
  }
}