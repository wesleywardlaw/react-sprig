import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem } from './index'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem },
  argTypes: {
    allowMultiple: { control: 'boolean' },
    headingLevel: { control: { type: 'number', min: 1, max: 6 } },
    className: { control: 'text' },
    buttonClassName: { control: 'text' },
    iconClassName: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

export const SingleSelection: Story = {
  args: {
    defaultOpenItems: ['item-1'],
    headingLevel: 3,
    children: [
      <AccordionItem
        key='item-1'
        id='item-1'
        title='First Item'
      >
        <p>This is the content of the first item.</p>
      </AccordionItem>,
      <AccordionItem
        key='item-2'
        id='item-2'
        title='Second Item'
      >
        <p>This is the content of the second item.</p>
      </AccordionItem>,
      <AccordionItem
        key='item-3'
        id='item-3'
        title='Third Item'
      >
        <p>This is the content of the third item.</p>
      </AccordionItem>,
    ],
  },
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
    allowMultiple: true,
    defaultOpenItems: ['item-1', 'item-3'],
    headingLevel: 4,
    children: [
      <AccordionItem
        key='item-1'
        id='item-1'
        title='Performance'
      >
        <p>Optimized for performance with smooth transitions.</p>
      </AccordionItem>,
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
      </AccordionItem>,
      <AccordionItem
        key='item-3'
        id='item-3'
        title='Customizable'
      >
        <p>Easy to customize with Tailwind classes.</p>
      </AccordionItem>,
      <AccordionItem
        key='item-4'
        id='item-4'
        title='Disabled Example'
        disabled
      >
        <p>This item is disabled.</p>
      </AccordionItem>,
    ],
  },
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
    buttonClassName: 'bg-blue-100 hover:bg-blue-200',
    iconClassName: 'text-blue-600',
    children: [
      <AccordionItem
        key='item-1'
        id='item-1'
        title='Custom Styled Item'
      >
        <p>This item uses custom button and icon styling.</p>
      </AccordionItem>,
      <AccordionItem
        key='item-2'
        id='item-2'
        title='Default Styled Item'
      >
        <p>This item uses default styling.</p>
      </AccordionItem>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom styling via buttonClassName and iconClassName props.',
      },
    },
  },
}
