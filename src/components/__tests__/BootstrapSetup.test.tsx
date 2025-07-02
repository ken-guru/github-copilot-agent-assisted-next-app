import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from 'react-bootstrap';

describe('Bootstrap Setup', () => {
  it('should render Bootstrap Button component correctly', () => {
    render(
      <Button variant="primary" data-testid="bootstrap-button">
        Test Bootstrap Button
      </Button>
    );

    const button = screen.getByTestId('bootstrap-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Bootstrap Button');
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it('should render Bootstrap Button with different variants', () => {
    const { rerender } = render(
      <Button variant="secondary" data-testid="bootstrap-button">
        Secondary Button
      </Button>
    );

    let button = screen.getByTestId('bootstrap-button');
    expect(button).toHaveClass('btn', 'btn-secondary');

    rerender(
      <Button variant="success" data-testid="bootstrap-button">
        Success Button
      </Button>
    );

    button = screen.getByTestId('bootstrap-button');
    expect(button).toHaveClass('btn', 'btn-success');
  });

  it('should render Bootstrap Button with disabled state', () => {
    render(
      <Button variant="primary" disabled data-testid="bootstrap-button">
        Disabled Button
      </Button>
    );

    const button = screen.getByTestId('bootstrap-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn', 'btn-primary');
  });
});
