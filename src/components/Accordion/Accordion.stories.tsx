import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem } from './index'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem: AccordionItem as React.ComponentType<unknown> },
  argTypes: {
    allowMultiple: { control: 'boolean' },
    headingLevel: { control: { type: 'number', min: 1, max: 6 } },
    className: { control: 'text' },
    buttonClassName: { control: 'text' },
    iconClassName: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className='flex justify-center items-center min-h-screen'>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Accordion>

export const SingleSelection: Story = {
  args: {
    className: 'w-96',
    defaultOpenItems: ['item-1'],
    headingLevel: 3,
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem
        key='item-1'
        id='item-1'
        title='First Item'
      >
        <p>This is the content of the first item.</p>
      </AccordionItem>
      <AccordionItem
        key='item-2'
        id='item-2'
        title='Second Item'
      >
        <p>This is the content of the second item.</p>
      </AccordionItem>
      <AccordionItem
        key='item-3'
        id='item-3'
        title='Third Item'
      >
        <p>This is the content of the third item.</p>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Only one item can be open at a time (default behavior).',
      },
    },
  },
}

export const MultipleSelection: Story = {
  args: {
    className: 'w-96',
    allowMultiple: true,
    defaultOpenItems: ['item-1', 'item-3'],
    headingLevel: 4,
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem
        key='item-1'
        id='item-1'
        title='Performance'
      >
        <p>Optimized for performance with smooth transitions.</p>
      </AccordionItem>
      <AccordionItem
        key='item-2'
        id='item-2'
        title='Accessibility'
      >
        <ul>
          <li>ARIA attributes</li>
          <li>Keyboard navigation</li>
          <li>Focus management</li>
        </ul>
      </AccordionItem>
      <AccordionItem
        key='item-3'
        id='item-3'
        title='Customizable'
      >
        <p>Easy to customize with Tailwind classes.</p>
      </AccordionItem>
      <AccordionItem
        key='item-4'
        id='item-4'
        title='Disabled Example'
        disabled
      >
        <p>This item is disabled.</p>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple items can be open at once.',
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    defaultOpenItems: ['item-1'],
    buttonClassName: 'bg-blue-100 hover:bg-blue-200 focus:bg-red-100',
    iconClassName: 'text-blue-600',
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem
        key='item-1'
        id='item-1'
        title='Custom Styled Item'
      >
        <p>This item uses custom button and icon styling.</p>
      </AccordionItem>
      <AccordionItem
        key='item-2'
        id='item-2'
        title='Default Styled Item'
      >
        <p>This item uses default styling.</p>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom styling via buttonClassName and iconClassName props.',
      },
    },
  },
}
