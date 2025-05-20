import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './index'
import { Button } from '../Button'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  subcomponents: {
    'Card.Title': Card.Title,
    'Card.Content': Card.Content,
    'Card.Footer': Card.Footer,
    'Card.Actions': Card.Actions,
    'Card.Image': Card.Image,
  },
}
export default meta

type Story = StoryObj<typeof Card>

export const Basic: Story = {
  render: () => (
    <Card>
      <Card.Title>Basic Card</Card.Title>
      <Card.Content>
        <p>This is a basic card with default styling.</p>
      </Card.Content>
    </Card>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Card>
      <Card.Image
        src='https://placehold.co/400X400/00000/FFF'
        alt='Card header image'
      />
      <Card.Title>Card with Image</Card.Title>
      <Card.Content>
        <p>This card includes an image at the top.</p>
      </Card.Content>
      <Card.Footer>
        <span className='text-xs text-gray-400'>Image courtesy of Unsplash</span>
      </Card.Footer>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card>
      <Card.Title>Card with Actions</Card.Title>
      <Card.Content>
        <p>Card with primary and secondary actions using the Button component.</p>
      </Card.Content>
      <Card.Actions>
        <Button color='primary'>Primary Action</Button>
        <Button color='secondary'>Secondary Action</Button>
      </Card.Actions>
    </Card>
  ),
}

export const CustomStyled: Story = {
  args: {
    padding: 'p-2',
    rounded: 'rounded-2xl',
    shadow: 'shadow-lg',
    bgColor: 'bg-blue-50',
    border: 'border-blue-200',
    hover: 'hover:shadow-xl',
    transition: 'transition-all duration-300',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title className='text-blue-700'>Custom Styled Card</Card.Title>
      <Card.Content>
        <p>This card uses custom Tailwind classes for a unique look.</p>
      </Card.Content>
      <Card.Actions>
        <Button color='success'>Accept</Button>
        <Button color='danger'>Decline</Button>
      </Card.Actions>
    </Card>
  ),
}
