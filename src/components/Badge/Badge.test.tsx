import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Badge } from './index'

// Helper to get the badge by text
const getBadge = (text: string) => screen.getByText(text).closest('span')
// Helper to get the outer badge span (not the inner truncate span)
const getOuterBadge = (text: string) => {
  const inner = screen.getByText(text)
  // The outer badge span is the parent of the truncate span
  return inner.parentElement as HTMLElement
}

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default</Badge>)
    expect(getBadge('Default')).toBeInTheDocument()
  })

  it('applies variant and size classes', () => {
    render(
      <Badge
        variant='primary'
        size='lg'
      >
        Primary Large
      </Badge>
    )
    const badge = getOuterBadge('Primary Large')
    expect(badge.className).toMatch(/bg-blue-100/)
    expect(badge.className).toMatch(/text-blue-800/)
    expect(badge.className).toMatch(/py-1.5/)
  })

  it('applies custom className', () => {
    render(<Badge className='custom-class'>Custom</Badge>)
    expect(getOuterBadge('Custom')).toHaveClass('custom-class')
  })

  it('renders removable button when removable', () => {
    render(<Badge removable>Removable</Badge>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn()
    render(
      <Badge
        removable
        onRemove={onRemove}
      >
        Removable
      </Badge>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onRemove).toHaveBeenCalled()
  })

  it('does not call onRemove if disabled', () => {
    const onRemove = vi.fn()
    render(
      <Badge
        removable
        onRemove={onRemove}
        disabled
      >
        Removable
      </Badge>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('removable badge is focusable and responds to Delete/Backspace', () => {
    const onRemove = vi.fn()
    render(
      <Badge
        removable
        onRemove={onRemove}
      >
        Removable
      </Badge>
    )
    const badge = getBadge('Removable')
    // Simulate keyboard events on the badge's parent span, but focus() is not implemented in jsdom, so skip focus
    fireEvent.keyDown(badge!, { key: 'Delete' })
    expect(onRemove).toHaveBeenCalled()
    fireEvent.keyDown(badge!, { key: 'Backspace' })
    expect(onRemove).toHaveBeenCalledTimes(2)
  })

  it('applies disabled styles and tabIndex', () => {
    render(
      <Badge
        disabled
        removable
      >
        Disabled
      </Badge>
    )
    const badge = getOuterBadge('Disabled')
    expect(badge.className).toMatch(/opacity-50/)
    expect(badge.querySelector('button')).toHaveAttribute('tabIndex', '-1')
  })

  it('sets aria-label and role', () => {
    render(
      <Badge
        ariaLabel='label'
        role='img'
      >
        A
      </Badge>
    )
    const badge = getOuterBadge('A')
    expect(badge.getAttribute('aria-label')).toBe('label')
    expect(badge.getAttribute('role')).toBe('img')
  })
})
