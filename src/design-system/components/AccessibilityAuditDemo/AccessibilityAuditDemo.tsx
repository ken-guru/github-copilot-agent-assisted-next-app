/**
 * Accessibility Audit Demo Component
 * 
 * Interactive tool for running accessibility audits and viewing contrast results.
 * Shows WCAG compliance status and provides recommendations for improvements.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { runAccessibilityAudit, logAccessibilityResults } from '../../utils/accessibility-audit';
import { ContrastAuditResult } from '../../utils/accessibility-contrast';

interface AuditSummary {
  totalCombinations: number;
  wcagAACompliant: number;
  wcagAAACompliant: number;
  issues: number;
  passRate: number;
}

export function AccessibilityAuditDemo() {
  const [auditResults, setAuditResults] = useState<{
    lightResults: ContrastAuditResult[];
    darkResults: ContrastAuditResult[];
    report: string;
    summary: AuditSummary;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'both'>('both');

  /**
   * Run accessibility audit
   */
  const runAudit = useCallback(async () => {
    setIsRunning(true);
    setAuditResults(null);

    try {
      const results = await runAccessibilityAudit();
      setAuditResults(results);
      
      // Log results to console for developers
      logAccessibilityResults(results.lightResults, results.darkResults);
    } catch (error) {
      console.error('Failed to run accessibility audit:', error);
    } finally {
      setIsRunning(false);
    }
  }, []);

  /**
   * Auto-run audit on component mount
   */
  useEffect(() => {
    runAudit();
  }, [runAudit]);

  /**
   * Download audit report
   */
  const downloadReport = useCallback(() => {
    if (!auditResults?.report) return;

    const blob = new Blob([auditResults.report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accessibility-audit-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [auditResults?.report]);

  /**
   * Get results to display based on selected theme
   */
  const getDisplayResults = (): ContrastAuditResult[] => {
    if (!auditResults) return [];
    
    switch (selectedTheme) {
      case 'light':
        return auditResults.lightResults;
      case 'dark':
        return auditResults.darkResults;
      case 'both':
      default:
        return [...auditResults.lightResults, ...auditResults.darkResults];
    }
  };

  /**
   * Get compliance level styling
   */
  const getComplianceStyle = (wcagAA: boolean, wcagAAA: boolean) => {
    if (wcagAAA) return { backgroundColor: '#4caf50', color: 'white' };
    if (wcagAA) return { backgroundColor: '#8bc34a', color: 'white' };
    return { backgroundColor: '#f44336', color: 'white' };
  };

  /**
   * Get compliance text
   */
  const getComplianceText = (wcagAA: boolean, wcagAAA: boolean): string => {
    if (wcagAAA) return 'AAA';
    if (wcagAA) return 'AA';
    return 'FAIL';
  };

  const displayResults = getDisplayResults();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Color Accessibility Audit</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          WCAG 2.1 contrast compliance check for Material 3 color combinations.
          Ensures all text/background pairs meet accessibility standards.
        </p>

        {/* Audit Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={runAudit}
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
            {isRunning ? 'Running Audit...' : 'Run Accessibility Audit'}
          </button>

          {auditResults && (
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

          {/* Theme Filter */}
          {auditResults && (
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark' | 'both')}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              <option value="both">Both Themes</option>
              <option value="light">Light Theme Only</option>
              <option value="dark">Dark Theme Only</option>
            </select>
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
              Analyzing color combinations for WCAG compliance...
            </p>
          </div>
        )}

        {/* Summary Results */}
        {auditResults && (
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Audit Summary</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6750a4' }}>
                  {auditResults.summary.totalCombinations}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Total Combinations</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
                  {auditResults.summary.wcagAACompliant}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>WCAG AA Compliant</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8bc34a' }}>
                  {auditResults.summary.wcagAAACompliant}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>WCAG AAA Compliant</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: auditResults.summary.passRate >= 95 ? '#4caf50' : 
                         auditResults.summary.passRate >= 85 ? '#ff9800' : '#f44336'
                }}>
                  {auditResults.summary.passRate.toFixed(1)}%
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Pass Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        {displayResults.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>
              Detailed Results ({displayResults.length} combinations)
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
            }}>
              {displayResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Header with compliance status */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '0.875rem', 
                      fontWeight: '600'
                    }}>
                      {result.combination}
                    </h4>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      ...getComplianceStyle(result.wcagAA, result.wcagAAA)
                    }}>
                      {getComplianceText(result.wcagAA, result.wcagAAA)}
                    </span>
                  </div>

                  {/* Color sample */}
                  <div style={{
                    display: 'flex',
                    height: '60px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                    border: '1px solid #ddd'
                  }}>
                    <div style={{
                      flex: 1,
                      backgroundColor: result.background,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: result.foreground,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      Sample Text
                    </div>
                    <div style={{
                      flex: 1,
                      backgroundColor: result.background,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: result.foreground,
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      Large Text
                    </div>
                  </div>

                  {/* Contrast details */}
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Contrast Ratio:</strong> {result.ratio}:1
                    </div>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Foreground:</strong> {result.foreground}
                    </div>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Background:</strong> {result.background}
                    </div>
                    {result.recommendation && (
                      <div style={{ 
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: '#fff3cd',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        <strong>💡 Recommendation:</strong> {result.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WCAG Guidelines */}
        <div style={{
          background: '#e3f2fd',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>WCAG 2.1 Contrast Guidelines</h3>
          <ul style={{ margin: 0, color: '#666' }}>
            <li><strong>WCAG AA:</strong> Minimum 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)</li>
            <li><strong>WCAG AAA:</strong> Minimum 7:1 for normal text, 4.5:1 for large text</li>
            <li><strong>Large Text:</strong> 18+ points or 14+ points bold (24px+ or 18.5px+ bold)</li>
            <li><strong>Color Alone:</strong> Never rely on color alone to convey information</li>
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