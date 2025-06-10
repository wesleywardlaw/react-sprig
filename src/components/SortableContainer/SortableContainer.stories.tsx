import { Meta, StoryObj } from '@storybook/react-vite'
import { SortableContainer } from './index'

const meta: Meta<typeof SortableContainer> = {
  title: 'Components/SortableContainer',
  component: SortableContainer,
  argTypes: {
    className: { control: 'text' },
    itemClassName: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof SortableContainer>

export const Basic: Story = {
  args: {
    children: [<div key='a'>Item A</div>, <div key='b'>Item B</div>, <div key='c'>Item C</div>],
  },
}

export const WithCustomContentAndStyles: Story = {
  args: {
    children: [
      <button
        key='1'
        onClick={() => console.log('hello')}
      >
        Button 1
      </button>,
      <span key='2'>Span 2</span>,
      <strong key='3'>Strong 3</strong>,
    ],
    itemClassName: 'bg-black text-white p-4 rounded-md',
  },
}
