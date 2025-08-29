/**
 * Animation Testing Demo Component
 * 
 * Interactive demo for running animation tests and viewing results.
 * Shows performance metrics, browser compatibility, and test reports.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { 
  AnimationTestRunner, 
  AnimationTestSuite 
} from '../../utils/animation-testing';

export function AnimationTestingDemo() {
  const [testResults, setTestResults] = useState<AnimationTestSuite[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testReport, setTestReport] = useState<string>('');

  /**
   * Run all animation tests
   */
  const runTests = useCallback(async () => {
    setIsRunning(true);
    setTestResults(null);
    setTestReport('');

    try {
      const results = await AnimationTestRunner.runAllTests();
      setTestResults(results);
      setTestReport(AnimationTestRunner.generateReport(results));
    } catch (error) {
      console.error('Failed to run animation tests:', error);
    } finally {
      setIsRunning(false);
    }
  }, []);

  /**
   * Download test report
   */
  const downloadReport = useCallback(() => {
    if (!testReport) return;

    const blob = new Blob([testReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `animation-test-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [testReport]);

  /**
   * Get performance rating color
   */
  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'fair': return '#ff9800';
      case 'poor': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  /**
   * Calculate overall metrics
   */
  const getOverallMetrics = () => {
    if (!testResults) return null;

    const totalTests = testResults.reduce((sum, suite) => sum + suite.tests.length, 0);
    const totalPassed = testResults.reduce((sum, suite) => sum + suite.totalPassed, 0);
    const passRate = (totalPassed / totalTests) * 100;
    
    return {
      totalTests,
      totalPassed,
      totalFailed: totalTests - totalPassed,
      passRate
    };
  };

  const overallMetrics = getOverallMetrics();

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Animation Testing Suite</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Comprehensive testing for animation performance, browser compatibility, 
          and reduced motion compliance.
        </p>

        {/* Test Controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <button
            onClick={runTests}
            disabled={isRunning}
            style={{
              padding: '12px 24px',
              backgroundColor: isRunning ? '#ccc' : '#6750a4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? 'Running Tests...' : 'Run Animation Tests'}
          </button>

          {testReport && (
            <button
              onClick={downloadReport}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              📄 Download Report
            </button>
          )}
        </div>

        {/* Loading State */}
        {isRunning && (
          <div style={{
            padding: '2rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e0e0e0',
              borderTop: '4px solid #6750a4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ margin: 0, color: '#666' }}>
              Running animation tests... This may take a few moments.
            </p>
          </div>
        )}

        {/* Overall Results */}
        {overallMetrics && (
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Overall Test Results</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6750a4' }}>
                  {overallMetrics.totalTests}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Total Tests</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
                  {overallMetrics.totalPassed}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Passed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f44336' }}>
                  {overallMetrics.totalFailed}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Failed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: overallMetrics.passRate >= 80 ? '#4caf50' : overallMetrics.passRate >= 60 ? '#ff9800' : '#f44336' 
                }}>
                  {overallMetrics.passRate.toFixed(1)}%
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Pass Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Suite Results */}
        {testResults && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Test Suite Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {testResults.map((suite, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Suite Header */}
                  <div style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h4 style={{ margin: 0 }}>{suite.name}</h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: 'white',
                          backgroundColor: getPerformanceColor(suite.performanceRating)
                        }}>
                          {suite.performanceRating.toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#666'
                        }}>
                          {suite.totalPassed}/{suite.tests.length} passed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Test Details */}
                  <div style={{ padding: '1rem' }}>
                    {suite.tests.map((test, testIndex) => (
                      <div
                        key={testIndex}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 0',
                          borderBottom: testIndex < suite.tests.length - 1 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem'
                          }}>
                            <span style={{ fontSize: '1.2rem' }}>
                              {test.passed ? '✅' : '❌'}
                            </span>
                            <span style={{ fontWeight: '500' }}>
                              {test.testName}
                            </span>
                          </div>
                          {test.error && (
                            <div style={{
                              fontSize: '0.875rem',
                              color: '#f44336',
                              marginLeft: '1.7rem'
                            }}>
                              {test.error}
                            </div>
                          )}
                          {test.performanceMetrics && (
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#666',
                              marginLeft: '1.7rem'
                            }}>
                              FPS: {test.performanceMetrics.fps} | 
                              Dropped Frames: {test.performanceMetrics.droppedFrames}
                            </div>
                          )}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#666',
                          textAlign: 'right'
                        }}>
                          {test.duration.toFixed(2)}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Report Preview */}
        {testReport && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Generated Report</h3>
            <pre style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              overflow: 'auto',
              maxHeight: '400px',
              whiteSpace: 'pre-wrap'
            }}>
              {testReport}
            </pre>
          </div>
        )}

        {/* Usage Instructions */}
        <div style={{
          background: '#e3f2fd',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>How to Use</h3>
          <ul style={{ margin: 0, color: '#666' }}>
            <li>Click "Run Animation Tests" to start comprehensive testing</li>
            <li>Tests include performance monitoring, browser compatibility, and reduced motion compliance</li>
            <li>Download the report for documentation and CI/CD integration</li>
            <li>Green rating indicates excellent performance, red indicates issues that need attention</li>
          </ul>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}