import { render, fireEvent, screen } from '@testing-library/react'
import { Accordion, AccordionItem } from './index'

describe('Accordion', () => {
  it('renders all AccordionItem titles', () => {
    render(
      <Accordion defaultOpenItems={['item-1']}>
        <AccordionItem
          id='item-1'
          title='Item 1'
        >
          Content 1
        </AccordionItem>
        <AccordionItem
          id='item-2'
          title='Item 2'
        >
          Content 2
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('shows content for defaultOpenItems', () => {
    render(
      <Accordion defaultOpenItems={['item-1']}>
        <AccordionItem
          id='item-1'
          title='Item 1'
        >
          Content 1
        </AccordionItem>
        <AccordionItem
          id='item-2'
          title='Item 2'
        >
          Content 2
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByTestId('accordion-content-item-1')).toHaveClass('max-h-96')
    expect(screen.getByTestId('accordion-content-item-2')).toHaveClass('max-h-0')
  })

  it('toggles content on click (single selection)', () => {
    render(
      <Accordion>
        <AccordionItem
          id='item-1'
          title='Item 1'
        >
          Content 1
        </AccordionItem>
        <AccordionItem
          id='item-2'
          title='Item 2'
        >
          Content 2
        </AccordionItem>
      </Accordion>
    )
    const button1 = screen.getByRole('button', { name: 'Item 1' })
    const button2 = screen.getByRole('button', { name: 'Item 2' })
    fireEvent.click(button1)
    expect(screen.getByTestId('accordion-content-item-1')).toHaveClass('max-h-96')
    expect(screen.getByTestId('accordion-content-item-2')).toHaveClass('max-h-0')
    fireEvent.click(button2)
    expect(screen.getByTestId('accordion-content-item-1')).toHaveClass('max-h-0')
    expect(screen.getByTestId('accordion-content-item-2')).toHaveClass('max-h-96')
  })

  it('allows multiple open if allowMultiple is true', () => {
    render(
      <Accordion allowMultiple>
        <AccordionItem
          id='item-1'
          title='Item 1'
        >
          Content 1
        </AccordionItem>
        <AccordionItem
          id='item-2'
          title='Item 2'
        >
          Content 2
        </AccordionItem>
      </Accordion>
    )
    const button1 = screen.getByRole('button', { name: 'Item 1' })
    const button2 = screen.getByRole('button', { name: 'Item 2' })
    fireEvent.click(button1)
    fireEvent.click(button2)
    expect(screen.getByTestId('accordion-content-item-1')).toHaveClass('max-h-96')
    expect(screen.getByTestId('accordion-content-item-2')).toHaveClass('max-h-96')
  })

  it('does not open disabled items', () => {
    render(
      <Accordion>
        <AccordionItem
          id='item-1'
          title='Item 1'
        >
          Content 1
        </AccordionItem>
        <AccordionItem
          id='item-2'
          title='Item 2'
          disabled
        >
          Content 2
        </AccordionItem>
      </Accordion>
    )
    const button2 = screen.getByRole('button', { name: 'Item 2' })
    fireEvent.click(button2)
    expect(screen.getByTestId('accordion-content-item-2')).toHaveClass('max-h-0')
  })

  it('applies custom className, buttonClassName, and iconClassName', () => {
    render(
      <Accordion
        className='accordion-root'
        buttonClassName='btn-custom'
        iconClassName='icon-custom'
      >
        <AccordionItem
          id='item-1'
          title='Item 1'
        >
          Content 1
        </AccordionItem>
        <AccordionItem
          id='item-2'
          title='Item 2'
        >
          Content 1
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByRole('button', { name: 'Item 1' })).toHaveClass('btn-custom')
    expect(document.querySelector('.icon-custom')).toBeInTheDocument()
    expect(document.querySelector('.accordion-root')).toBeInTheDocument()
  })
})
