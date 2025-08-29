'use client';

import React, { useState, useEffect } from 'react';
import { 
  FinalPolishManager, 
  initializeFinalPolish, 
  quickOptimize, 
  productionOptimize,
  getDeploymentChecklist 
} from '@/utils/final-polish-init';

interface OptimizationResults {
  performance: any;
  bundleSize: number;
  optimizationsApplied: string[];
}

interface DeploymentItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
}

export default function FinalPolishDemo() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResults | null>(null);
  const [deploymentItems, setDeploymentItems] = useState<DeploymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-initialize on component mount
    initializeFinalPolish({
      enableColorOptimization: true,
      enableAnimationOptimization: true,
      enablePerformanceMonitoring: true,
      runDeploymentChecklist: false,
    }).then(() => {
      setIsInitialized(true);
      loadDeploymentChecklist();
    }).catch(console.error);
  }, []);

  const loadDeploymentChecklist = () => {
    try {
      const checklist = getDeploymentChecklist();
      setDeploymentItems(checklist);
    } catch (error) {
      console.error('Failed to load deployment checklist:', error);
    }
  };

  const handleQuickOptimize = async () => {
    setIsLoading(true);
    try {
      await quickOptimize();
      console.log('Quick optimization completed!');
    } catch (error) {
      console.error('Quick optimization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductionOptimize = async () => {
    setIsLoading(true);
    try {
      const results = await productionOptimize();
      setOptimizationResults(results.optimizationReport);
      console.log('Production optimization completed!', results);
    } catch (error) {
      console.error('Production optimization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartUAT = () => {
    const manager = FinalPolishManager.getInstance();
    const sessionId = manager.startUATSession('Demo User', 'Desktop', 'Chrome');
    console.log('UAT Session started:', sessionId);
    alert(`UAT Session started: ${sessionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'in-progress': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Final Polish & Performance Optimization Demo
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isInitialized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isInitialized ? '✅ Initialized' : '⏳ Initializing...'}
            </div>
            
            {isLoading && (
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🔄 Processing...
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={handleQuickOptimize}
              disabled={!isInitialized || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ⚡ Quick Optimize
            </button>
            
            <button
              onClick={handleProductionOptimize}
              disabled={!isInitialized || isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🏭 Production Optimize
            </button>
            
            <button
              onClick={handleStartUAT}
              disabled={!isInitialized || isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🧪 Start UAT Session
            </button>
          </div>

          {optimizationResults && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Optimization Results
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Animation FPS</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {optimizationResults.performance?.animationFrameRate || 60}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Bundle Size</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(optimizationResults.bundleSize / 1024)}KB
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Memory Usage</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round((optimizationResults.performance?.memoryUsage || 0) / 1048576)}MB
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Optimizations</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {optimizationResults.optimizationsApplied?.length || 0}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Applied Optimizations
                </h3>
                <ul className="space-y-1">
                  {optimizationResults.optimizationsApplied?.map((optimization, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {optimization}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Deployment Checklist
          </h2>
          
          <div className="space-y-4">
            {deploymentItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Category: {item.category}
                    </div>
                  </div>
                  
                  <div className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {deploymentItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <div>Loading deployment checklist...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}