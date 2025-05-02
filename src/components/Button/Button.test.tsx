import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button, ButtonProps } from './index'
import { FaBeer } from 'react-icons/fa'

describe('Button Component', () => {
  const defaultProps: ButtonProps = {
    children: 'Click Me',
    size: 'medium',
    color: 'primary',
    loading: false,
    disabled: false,
    icon: <FaBeer />,
    iconPosition: 'before',
    fullWidth: false,
  }

  it('renders the button with default props', () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn-medium btn-primary')
  })

  it('renders the button with loading state', () => {
    render(
      <Button
        {...defaultProps}
        loading={true}
      />
    )
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(/click me/i)).toBeInTheDocument()
  })

  it('renders the button with an icon before the text', () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole('button', { name: /click me/i })
    const icon = screen.getByTestId('icon')
    expect(icon).toBeInTheDocument()
    const children = button.childNodes
    expect(children[0]).toBe(icon)
    expect(children[1].textContent).toBe('Click Me')
  })

  it('renders the button with an icon after the text', () => {
    render(
      <Button
        {...defaultProps}
        iconPosition='after'
      />
    )
    const button = screen.getByRole('button', { name: /click me/i })
    const icon = screen.getByTestId('icon')
    expect(icon).toBeInTheDocument()
    const children = button.childNodes
    expect(children[1]).toBe(icon)
    expect(children[0].textContent).toBe('Click Me')
  })

  it('renders the button as disabled', () => {
    render(
      <Button
        {...defaultProps}
        disabled={true}
      />
    )
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDisabled()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(
      <Button
        {...defaultProps}
        onClick={handleClick}
      />
    )
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies fullWidth class when fullWidth is true', () => {
    render(
      <Button
        {...defaultProps}
        fullWidth={true}
      />
    )
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('w-full')
  })
})
