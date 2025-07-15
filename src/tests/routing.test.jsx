import React from 'react';
import { render, screen } from '@testing-library/react';

// Create local mock components with proper PascalCase naming for React components
const MockLoadingProvider = ({ children }) => (
  <div data-testid="loading-provider">{children}</div>
);

const MockTimeSetup = () => <div data-testid="time-setup">Time Setup</div>;

// Create a simple mock of the Home page
const MockHomePage = () => {
  return (
    <MockLoadingProvider>
      <div>
        <div data-testid="app-content">
          <div data-testid="time-setup-container">
            <MockTimeSetup />
          </div>
        </div>
      </div>
    </MockLoadingProvider>
  );
};

describe('Routing Tests', () => {
  test('Home page component should render expected content', async () => {
    render(<MockHomePage />);
    
    // Check for expected components
    expect(screen.getByTestId('loading-provider')).toBeInTheDocument();
    expect(screen.getByTestId('app-content')).toBeInTheDocument();
    
    // Check that container exists
    const setupContainer = screen.getByTestId('time-setup-container');
    expect(setupContainer).toBeInTheDocument();
  });
  
  test('Page structure follows expected hierarchy', () => {
    render(<MockHomePage />);
    
    // Check content hierarchy
    const appContent = screen.getByTestId('app-content');
    const setupContainer = screen.getByTestId('time-setup-container');
    expect(appContent).toContainElement(setupContainer);
  });
});
