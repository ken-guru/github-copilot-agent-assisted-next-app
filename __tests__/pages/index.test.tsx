import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../pages/index';
import HomePage from '../../src/app/page';

// Mock the HomePage component to isolate the test
jest.mock('../../src/app/page', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="mocked-home-page">Mocked Home Page</div>),
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the HomePage component', () => {
    const { getByTestId } = render(<Home />);
    
    // Verify that HomePage is rendered
    expect(getByTestId('mocked-home-page')).toBeInTheDocument();
    
    // Verify that HomePage was called exactly once
    expect(HomePage).toHaveBeenCalledTimes(1);
  });
});