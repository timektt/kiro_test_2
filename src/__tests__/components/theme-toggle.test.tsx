import { render, screen, fireEvent } from '@testing-library/react'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render theme toggle button', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    })

    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
  })

  it('should show moon icon in dark theme', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    })

    render(<ThemeToggle />)

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('should toggle to dark theme when clicked in light mode', () => {
    const mockSetTheme = jest.fn()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should toggle to light theme when clicked in dark mode', () => {
    const mockSetTheme = jest.fn()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should handle system theme', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      setTheme: jest.fn(),
    })

    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    })

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('theme'))
  })

  it('should apply custom className when provided', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    })

    render(<ThemeToggle className="custom-class" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should handle undefined theme gracefully', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: undefined,
      setTheme: jest.fn(),
    })

    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})