import { render, fireEvent, screen } from '@testing-library/react'
import { Tooltip } from './index'

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip content='Tooltip content'>
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('shows tooltip on mouse enter and hides on mouse leave', async () => {
    render(
      <Tooltip content='Tooltip content'>
        <button>Hover me</button>
      </Tooltip>
    )
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    fireEvent.mouseLeave(trigger)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows tooltip on focus and hides on blur', async () => {
    render(
      <Tooltip content='Tooltip content'>
        <button>Focus me</button>
      </Tooltip>
    )
    const trigger = screen.getByText('Focus me')
    fireEvent.focus(trigger)
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    fireEvent.blur(trigger)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('applies custom className and color', async () => {
    render(
      <Tooltip
        content='Tooltip content'
        className='custom-class'
        color='#ff0000'
      >
        <button>Hover me</button>
      </Tooltip>
    )
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip.className).toMatch(/custom-class/)
    expect(tooltip).toHaveStyle({ background: '#ff0000' })
  })

  it('renders in the correct position', async () => {
    render(
      <Tooltip
        content='Tooltip content'
        position='bottom'
      >
        <button>Hover me</button>
      </Tooltip>
    )
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip.style.position).toBe('fixed')
  })
})
