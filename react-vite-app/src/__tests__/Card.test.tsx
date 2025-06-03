import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with children', () => {
      render(
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      )
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      )
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
    })

    it('should have proper default styling', () => {
      render(<Card data-testid="card">Content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('rounded-card')
      expect(card).toHaveClass('bg-background-alt')
      expect(card).toHaveClass('border')
    })
  })

  describe('CardHeader', () => {
    it('should render header content', () => {
      render(
        <Card>
          <CardHeader data-testid="header">
            <CardTitle>Title</CardTitle>
          </CardHeader>
        </Card>
      )
      
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render title text', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
        </Card>
      )
      
      const title = screen.getByText('Test Title')
      expect(title).toBeInTheDocument()
    })

    it('should have proper heading styles', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="title">Test Title</CardTitle>
          </CardHeader>
        </Card>
      )
      
      const title = screen.getByTestId('title')
      expect(title).toHaveClass('text-lg')
      expect(title).toHaveClass('font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('should render description text', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Test description</CardDescription>
          </CardHeader>
        </Card>
      )
      
      const description = screen.getByText('Test description')
      expect(description).toBeInTheDocument()
    })

    it('should have muted text styling', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="description">Test description</CardDescription>
          </CardHeader>
        </Card>
      )
      
      const description = screen.getByTestId('description')
      expect(description).toHaveClass('text-foreground-muted')
    })
  })

  describe('CardContent', () => {
    it('should render content', () => {
      render(
        <Card>
          <CardContent data-testid="content">
            <p>Card body content</p>
          </CardContent>
        </Card>
      )
      
      const content = screen.getByTestId('content')
      expect(content).toBeInTheDocument()
      expect(screen.getByText('Card body content')).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render footer content', () => {
      render(
        <Card>
          <CardFooter data-testid="footer">
            <button>Action</button>
          </CardFooter>
        </Card>
      )
      
      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Full Card Structure', () => {
    it('should render complete card with all components', () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Weather Widget</CardTitle>
            <CardDescription>Current weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>25°C and sunny</p>
          </CardContent>
          <CardFooter>
            <button>Refresh</button>
          </CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Weather Widget')).toBeInTheDocument()
      expect(screen.getByText('Current weather conditions')).toBeInTheDocument()
      expect(screen.getByText('25°C and sunny')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
    })
  })
})
