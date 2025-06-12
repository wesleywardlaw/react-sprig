import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './index'

describe('Skeleton', () => {
  it('renders a single text skeleton by default', () => {
    render(<Skeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveStyle({ width: '100%' })
  })

  it('renders multiple lines for text variant', () => {
    render(
      <Skeleton
        variant='text'
        lines={3}
      />
    )
    const skeletons = screen.getAllByRole('status')
    expect(skeletons.length).toBe(3)
  })

  it('renders rectangular variant', () => {
    render(
      <Skeleton
        variant='rectangular'
        width={150}
        height={80}
      />
    )
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveStyle({ width: '150px', height: '80px' })
  })

  it('renders circular variant', () => {
    render(
      <Skeleton
        variant='circular'
        width={40}
        height={40}
      />
    )
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveStyle({ borderRadius: '50%' })
  })

  it('renders children when loading is false', () => {
    render(
      <Skeleton loading={false}>
        <div>Loaded content</div>
      </Skeleton>
    )
    expect(screen.getByText('Loaded content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Skeleton className='custom-class' />)
    const skeleton = screen.getByRole('status')
    expect(skeleton.className).toMatch(/custom-class/)
  })

  it('sets aria-label and aria-live', () => {
    render(<Skeleton aria-label='Loading test' />)
    const skeleton = screen.getByLabelText('Loading test')
    expect(skeleton).toHaveAttribute('aria-live', 'polite')
  })
})
