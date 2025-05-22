import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './index'

describe('Alert', () => {
  it('renders with default variant and children', () => {
    render(
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>This is a default alert.</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('Default Alert')).toBeInTheDocument()
    expect(screen.getByText('This is a default alert.')).toBeInTheDocument()
  })

  it('renders all variants', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const
    variants.forEach((variant) => {
      render(
        <Alert variant={variant}>
          <AlertTitle>{variant} title</AlertTitle>
        </Alert>
      )
      expect(screen.getByText(`${variant} title`)).toBeInTheDocument()
    })
  })

  it('shows icon by default and hides when showIcon is false', () => {
    const { rerender } = render(
      <Alert>
        <AlertTitle>With Icon</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole('alert').querySelector('svg')).toBeTruthy()
    rerender(
      <Alert showIcon={false}>
        <AlertTitle>No Icon</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole('alert').querySelector('svg')).toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Alert onClose={onClose}>
        <AlertTitle>Closable</AlertTitle>
      </Alert>
    )
    const button = screen.getByRole('button', { name: /close alert/i })
    fireEvent.click(button)
    expect(onClose).toHaveBeenCalled()
  })

  it('renders children directly if no title/description', () => {
    render(<Alert>Just content</Alert>)
    expect(screen.getByText('Just content')).toBeInTheDocument()
  })

  it('warns and falls back to default for invalid variant', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // @ts-expect-error: Intentional invalid variant for test
    render(<Alert variant='invalid'>Invalid</Alert>)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Invalid alert variant: invalid'))
    warn.mockRestore()
  })
})

describe('AlertTitle', () => {
  it('renders with correct tag and text', () => {
    render(<AlertTitle as='h2'>Heading</AlertTitle>)
    const heading = screen.getByText('Heading')
    expect(heading.tagName).toBe('H2')
  })
})

describe('AlertDescription', () => {
  it('renders description text', () => {
    render(<AlertDescription>Description here</AlertDescription>)
    expect(screen.getByText('Description here')).toBeInTheDocument()
  })
})
