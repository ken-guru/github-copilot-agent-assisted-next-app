import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, Card } from 'react-bootstrap';

describe('Bootstrap Theme Integration', () => {
  it('should render Bootstrap components with default styling', () => {
    render(
      <div>
        <Card data-testid="bootstrap-card">
          <Card.Body>
            <Card.Title>Default Bootstrap Card</Card.Title>
            <Button 
              variant="primary" 
              data-testid="primary-button"
            >
              Primary Button
            </Button>
            <Button 
              variant="secondary" 
              data-testid="secondary-button"
              className="ms-2"
            >
              Secondary Button
            </Button>
          </Card.Body>
        </Card>
      </div>
    );

    const card = screen.getByTestId('bootstrap-card');
    const primaryButton = screen.getByTestId('primary-button');
    const secondaryButton = screen.getByTestId('secondary-button');
    
    expect(card).toBeInTheDocument();
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).toHaveTextContent('Primary Button');
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveTextContent('Secondary Button');
    expect(secondaryButton).toHaveClass('ms-2');
  });

  it('should support Bootstrap responsive utilities', () => {
    render(
      <div className="d-flex flex-column flex-md-row" data-testid="responsive-container">
        <Button variant="outline-primary" className="mb-2 mb-md-0 me-md-2">
          Responsive Button 1
        </Button>
        <Button variant="outline-secondary">
          Responsive Button 2
        </Button>
      </div>
    );

    const container = screen.getByTestId('responsive-container');
    expect(container).toHaveClass('d-flex', 'flex-column', 'flex-md-row');
  });

  it('should render Bootstrap form components', () => {
    render(
      <form data-testid="bootstrap-form">
        <div className="mb-3">
          <label htmlFor="test-input" className="form-label">Test Input</label>
          <input 
            type="text" 
            className="form-control" 
            id="test-input"
            data-testid="form-input"
            placeholder="Enter text"
          />
        </div>
      </form>
    );

    const form = screen.getByTestId('bootstrap-form');
    const input = screen.getByTestId('form-input');
    
    expect(form).toBeInTheDocument();
    expect(input).toHaveClass('form-control');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });
});
