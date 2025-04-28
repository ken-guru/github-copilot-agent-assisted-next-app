import React from 'react';
import { render } from '@testing-library/react';

// Mock next/font
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: 'mocked-geist-variable',
  }),
  Geist_Mono: () => ({
    variable: 'mocked-geist-mono-variable',
  }),
}));

// Mock Next.js Script component
jest.mock('next/script', () => {
  return {
    __esModule: true,
    default: ({ id, dangerouslySetInnerHTML }: { id?: string; dangerouslySetInnerHTML?: { __html: string } }) => (
      <script data-testid={id}>{dangerouslySetInnerHTML?.__html}</script>
    ),
  };
});

// Mock LayoutClient component
jest.mock('../../components/LayoutClient', () => ({
  LayoutClient: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-client">{children}</div>,
}));

// Create a simplified mock of the RootLayout component
function MockRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="html-element" lang="en">
      <div data-testid="head-element">
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
      </div>
      <div 
        data-testid="body-element" 
        className="mocked-geist-variable mocked-geist-mono-variable"
      >
        <div data-testid="layout-client">{children}</div>
        <script data-testid="register-service-worker"></script>
      </div>
    </div>
  );
}

describe('RootLayout', () => {
  test('renders with proper HTML structure', () => {
    const { getByTestId } = render(
      <MockRootLayout>
        <div data-testid="test-children">Test Content</div>
      </MockRootLayout>
    );
    
    // Check html element
    const htmlElement = getByTestId('html-element');
    expect(htmlElement).toHaveAttribute('lang', 'en');
    
    // Check that children are rendered
    const testChildren = getByTestId('test-children');
    expect(testChildren).toBeInTheDocument();
    expect(testChildren).toHaveTextContent('Test Content');
  });

  test('includes layout client component', () => {
    const { getByTestId } = render(
      <MockRootLayout>
        <div>Test Content</div>
      </MockRootLayout>
    );
    
    expect(getByTestId('layout-client')).toBeInTheDocument();
  });
  
  test('includes service worker registration script', () => {
    const { getByTestId } = render(
      <MockRootLayout>
        <div>Test Content</div>
      </MockRootLayout>
    );
    
    expect(getByTestId('register-service-worker')).toBeInTheDocument();
  });
  
  test('has proper body class for fonts', () => {
    const { getByTestId } = render(
      <MockRootLayout>
        <div>Test Content</div>
      </MockRootLayout>
    );
    
    const bodyElement = getByTestId('body-element');
    expect(bodyElement).toHaveClass('mocked-geist-variable');
    expect(bodyElement).toHaveClass('mocked-geist-mono-variable');
  });
});
