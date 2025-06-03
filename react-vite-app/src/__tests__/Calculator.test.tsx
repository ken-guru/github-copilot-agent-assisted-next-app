import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Calculator } from '../components/widgets/Calculator'

describe('Calculator', () => {
  beforeEach(() => {
    render(<Calculator />)
  })

  describe('Basic Rendering', () => {
    it('renders calculator display', () => {
      expect(screen.getByTestId('calculator-display')).toBeInTheDocument()
    })

    it('renders number buttons 0-9', () => {
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument()
      }
    })

    it('renders operator buttons', () => {
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument()
    })

    it('renders function buttons', () => {
      expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'CE' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '.' })).toBeInTheDocument()
    })

    it('displays initial value of 0', () => {
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0')
    })
  })

  describe('Number Input', () => {
    it('displays single digit when clicked', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5')
    })

    it('displays multiple digits in sequence', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('123')
    })

    it('handles leading zeros correctly', () => {
      fireEvent.click(screen.getByRole('button', { name: '0' }))
      fireEvent.click(screen.getByRole('button', { name: '0' }))
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5')
    })

    it('handles decimal point input', () => {
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: '.' }))
      fireEvent.click(screen.getByRole('button', { name: '1' }))
      fireEvent.click(screen.getByRole('button', { name: '4' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('3.14')
    })

    it('prevents multiple decimal points', () => {
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: '.' }))
      fireEvent.click(screen.getByRole('button', { name: '1' }))
      fireEvent.click(screen.getByRole('button', { name: '.' }))
      fireEvent.click(screen.getByRole('button', { name: '4' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('3.14')
    })

    it('handles decimal point at start', () => {
      fireEvent.click(screen.getByRole('button', { name: '.' }))
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0.5')
    })
  })

  describe('Basic Operations', () => {
    it('performs addition correctly', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('8')
    })

    it('performs subtraction correctly', () => {
      fireEvent.click(screen.getByRole('button', { name: '9' }))
      fireEvent.click(screen.getByRole('button', { name: '-' }))
      fireEvent.click(screen.getByRole('button', { name: '4' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5')
    })

    it('performs multiplication correctly', () => {
      fireEvent.click(screen.getByRole('button', { name: '6' }))
      fireEvent.click(screen.getByRole('button', { name: '×' }))
      fireEvent.click(screen.getByRole('button', { name: '7' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('42')
    })

    it('performs division correctly', () => {
      fireEvent.click(screen.getByRole('button', { name: '8' }))
      fireEvent.click(screen.getByRole('button', { name: '÷' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('4')
    })

    it('handles decimal operations', () => {
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '.' }))
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '1' }))
      fireEvent.click(screen.getByRole('button', { name: '.' }))
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('4')
    })
  })

  describe('Chained Operations', () => {
    it('performs chained addition operations', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('6')
    })

    it('handles mixed operations with correct precedence', () => {
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: '×' }))
      fireEvent.click(screen.getByRole('button', { name: '4' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('14')
    })

    it('continues operations after equals', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('10')
    })
  })

  describe('Clear Operations', () => {
    it('clears current entry with CE', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: 'CE' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0')
    })

    it('clears everything with Clear', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0')
    })

    it('CE only clears current entry in operation', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: 'CE' }))
      fireEvent.click(screen.getByRole('button', { name: '7' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('12')
    })
  })

  describe('Error Handling', () => {
    it('handles division by zero', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '÷' }))
      fireEvent.click(screen.getByRole('button', { name: '0' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('Error')
    })

    it('recovers from error state with Clear', () => {
      // Trigger error
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '÷' }))
      fireEvent.click(screen.getByRole('button', { name: '0' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      
      // Clear and use calculator normally
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5')
    })

    it('handles very large numbers', () => {
      // Create a large number
      fireEvent.click(screen.getByRole('button', { name: '9' }))
      for (let i = 0; i < 15; i++) {
        fireEvent.click(screen.getByRole('button', { name: '9' }))
      }
      expect(screen.getByTestId('calculator-display')).toHaveTextContent(/^9+$/)
    })
  })

  describe('Keyboard Support', () => {
    it('handles number key presses', () => {
      fireEvent.keyDown(document, { key: '5' })
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5')
    })

    it('handles operator key presses', () => {
      fireEvent.keyDown(document, { key: '3' })
      fireEvent.keyDown(document, { key: '+' })
      fireEvent.keyDown(document, { key: '2' })
      fireEvent.keyDown(document, { key: 'Enter' })
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5')
    })

    it('handles equals with Enter key', () => {
      fireEvent.keyDown(document, { key: '7' })
      fireEvent.keyDown(document, { key: '*' })
      fireEvent.keyDown(document, { key: '6' })
      fireEvent.keyDown(document, { key: 'Enter' })
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('42')
    })

    it('handles clear with Escape key', () => {
      fireEvent.keyDown(document, { key: '1' })
      fireEvent.keyDown(document, { key: '2' })
      fireEvent.keyDown(document, { key: '3' })
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0')
    })

    it('handles backspace for current entry', () => {
      fireEvent.keyDown(document, { key: '1' })
      fireEvent.keyDown(document, { key: '2' })
      fireEvent.keyDown(document, { key: '3' })
      fireEvent.keyDown(document, { key: 'Backspace' })
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('12')
    })
  })

  describe('Visual States', () => {
    it('shows active operator state', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      
      const addButton = screen.getByRole('button', { name: '+' })
      expect(addButton).toHaveClass('bg-orange-500', 'text-white')
    })

    it('clears operator state after next number', () => {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      
      const addButton = screen.getByRole('button', { name: '+' })
      expect(addButton).not.toHaveClass('bg-orange-500', 'text-white')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      expect(screen.getByTestId('calculator-display')).toHaveAttribute('aria-label', 'Calculator display')
    })

    it('supports tab navigation', () => {
      const firstButton = screen.getByRole('button', { name: 'Clear' })
      firstButton.focus()
      expect(firstButton).toHaveFocus()
    })

    it('has proper button roles', () => {
      const numberButtons = screen.getAllByRole('button')
      expect(numberButtons.length).toBeGreaterThan(0)
      numberButtons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })
  })
})
