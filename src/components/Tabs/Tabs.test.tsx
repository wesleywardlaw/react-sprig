import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Tabs } from './index'

const demoTabs = [
  { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
  { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  { id: 'tab3', label: 'Tab 3', content: <div>Content 3</div>, disabled: true },
]

describe('Tabs', () => {
  it('renders all tab buttons', () => {
    render(<Tabs tabs={demoTabs} />)
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument()
  })

  it('shows the correct tab panel by default', () => {
    render(
      <Tabs
        tabs={demoTabs}
        defaultActiveTab='tab2'
      />
    )
    const content2 = screen.getByText('Content 2').parentElement
    expect(content2).toBeInTheDocument()
    expect(content2).not.toHaveClass('hidden')

    const content1 = screen.getByText('Content 1').parentElement
    expect(content1).toHaveClass('hidden')
  })

  it('switches tab on click', () => {
    render(<Tabs tabs={demoTabs} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
    const content2 = screen.getByText('Content 2').parentElement
    expect(content2).toBeInTheDocument()
    expect(content2).not.toHaveClass('hidden')
  })

  it('does not activate disabled tab on click', () => {
    render(<Tabs tabs={demoTabs} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 3' }))
    const content1 = screen.getByText('Content 1').parentElement
    expect(content1).not.toHaveClass('hidden')
  })

  it('supports keyboard navigation (ArrowRight, ArrowLeft, Home, End)', () => {
    render(<Tabs tabs={demoTabs} />)
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })

    // ArrowRight from Tab 1 to Tab 2
    tab1.focus()
    fireEvent.keyDown(tab1, { key: 'ArrowRight' })
    expect(tab2).toHaveFocus()
    const content2 = screen.getByText('Content 2').parentElement
    expect(content2).toBeInTheDocument()
    expect(content2).not.toHaveClass('hidden')

    // ArrowRight from Tab 2 should skip disabled Tab 3 and go to Tab 1
    fireEvent.keyDown(tab2, { key: 'ArrowRight' })
    expect(tab1).toHaveFocus()
    const content1 = screen.getByText('Content 1').parentElement
    expect(content1).toBeInTheDocument()
    expect(content1).not.toHaveClass('hidden')

    // ArrowLeft from Tab 1 should skip disabled Tab 3 and go to Tab 2
    fireEvent.keyDown(tab1, { key: 'ArrowLeft' })
    expect(tab2).toHaveFocus()
    expect(screen.getByText('Content 2')).toBeVisible()

    // Home key goes to first enabled tab
    fireEvent.keyDown(tab2, { key: 'Home' })
    expect(tab1).toHaveFocus()
    expect(screen.getByText('Content 1')).toBeVisible()

    // End key goes to last enabled tab (Tab 2, since Tab 3 is disabled)
    fireEvent.keyDown(tab1, { key: 'End' })
    expect(tab2).toHaveFocus()
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  it('applies correct aria attributes', () => {
    render(<Tabs tabs={demoTabs} />)
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    const tabPanel1 = screen.getAllByRole('tabpanel')[0]
    expect(tab1).toHaveAttribute('aria-selected', 'true')
    expect(tabPanel1).toHaveAttribute('aria-labelledby', expect.stringContaining('tab-'))
  })

  it('shows message if no tabs are provided', () => {
    render(<Tabs tabs={[]} />)
    expect(screen.getByText(/no tabs available/i)).toBeInTheDocument()
  })
})
