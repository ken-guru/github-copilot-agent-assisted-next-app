import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ThemeToggle } from '../components/ui/ThemeToggle'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.documentElement.className = ''
    localStorageMock.getItem.mockReturnValue('light')
  })

  it('should render theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('should show light mode icon in light theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    // Should show sun icon (light mode indicator)
    expect(screen.getByLabelText(/light mode/i)).toBeInTheDocument()
  })

  it('should show dark mode icon in dark theme', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    // Should show moon icon (dark mode indicator)
    expect(screen.getByLabelText(/dark mode/i)).toBeInTheDocument()
  })

  it('should toggle theme when clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    
    // Initially light mode
    expect(screen.getByLabelText(/light mode/i)).toBeInTheDocument()
    
    // Click to toggle to dark
    fireEvent.click(toggleButton)
    
    // Should now show dark mode
    expect(screen.getByLabelText(/dark mode/i)).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should have proper accessibility attributes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    
    expect(toggleButton).toHaveAttribute('aria-label')
    expect(toggleButton).toHaveAttribute('type', 'button')
  })

  it('should be keyboard accessible', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    
    // Focus the button
    toggleButton.focus()
    expect(toggleButton).toHaveFocus()
    
    // Should be able to activate with Enter or Space
    fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' })
    expect(screen.getByLabelText(/dark mode/i)).toBeInTheDocument()
  })

  it('should support custom className', () => {
    render(
      <ThemeProvider>
        <ThemeToggle className="custom-class" />
      </ThemeProvider>
    )

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(toggleButton).toHaveClass('custom-class')
  })
})
