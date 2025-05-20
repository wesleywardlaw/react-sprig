import { render, screen } from '@testing-library/react'
import { SortableContainer } from './index'

describe('SortableContainer', () => {
  it('renders children in order', () => {
    render(
      <SortableContainer>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </SortableContainer>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
    const items = screen.getAllByText(/Item/)
    expect(items[0]).toHaveTextContent('Item 1')
    expect(items[1]).toHaveTextContent('Item 2')
    expect(items[2]).toHaveTextContent('Item 3')
  })

  it('applies custom className and itemClassName', () => {
    render(
      <SortableContainer
        className='container-class'
        itemClassName='item-class'
      >
        <div>Item A</div>
        <div>Item B</div>
      </SortableContainer>
    )
    const container = screen.getByText('Item A').parentElement?.parentElement
    expect(container).toHaveClass('container-class')
    const items = screen.getAllByText(/Item/)
    items.forEach((item) => {
      expect(item.parentElement).toHaveClass('item-class')
    })
  })
})
