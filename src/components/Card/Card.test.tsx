import { render, screen } from '@testing-library/react'
import { Card } from './index'
import { Button } from '../Button'

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <span>Test Content</span>
      </Card>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Card className='custom-class'>
        <span>Content</span>
      </Card>
    )
    const card = screen.getByText('Content').parentElement
    expect(card).toHaveClass('custom-class')
  })

  it('renders Card.Title, Card.Content, Card.Footer, Card.Actions, and Card.Image', () => {
    render(
      <Card>
        <Card.Image
          src='test.jpg'
          alt='Test Image'
        />
        <Card.Title>Title</Card.Title>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer</Card.Footer>
        <Card.Actions>
          <Button>Action</Button>
        </Card.Actions>
      </Card>
    )
    expect(screen.getByAltText('Test Image')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('applies custom Tailwind props', () => {
    render(
      <Card
        padding='p-2'
        rounded='rounded-2xl'
        shadow='shadow-lg'
        bgColor='bg-blue-50'
        border='border-blue-200'
      >
        <span>Styled</span>
      </Card>
    )
    const card = screen.getByText('Styled').parentElement
    expect(card?.className).toMatch(/p-2/)
    expect(card?.className).toMatch(/rounded-2xl/)
    expect(card?.className).toMatch(/shadow-lg/)
    expect(card?.className).toMatch(/bg-blue-50/)
    expect(card?.className).toMatch(/border-blue-200/)
  })
})
