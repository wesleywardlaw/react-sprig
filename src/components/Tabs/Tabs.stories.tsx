import { Tabs } from './index'
import type { Meta, StoryObj } from '@storybook/react-vite'

const demoTabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: <div className='p-4'>Project overview content goes here.</div>,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    content: <div className='p-4'>Analytics dashboard content goes here.</div>,
  },
  {
    id: 'settings',
    label: 'Settings',
    disabled: true,
    content: <div className='p-4'>Settings content goes here.</div>,
  },
  {
    id: 'help',
    label: 'Help',
    content: <div className='p-4'>Help content goes here.</div>,
  },
]

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Tabs>

const regularTabs = demoTabs.filter((tab) => !tab.disabled)

export const Default: Story = {
  args: {
    tabs: regularTabs,
    defaultActiveTab: 'overview',
    variant: 'default',
    size: 'md',
  },
}

export const Pills: Story = {
  args: {
    tabs: regularTabs,
    defaultActiveTab: 'analytics',
    variant: 'pills',
    size: 'md',
  },
}

export const Underline: Story = {
  args: {
    tabs: regularTabs,
    defaultActiveTab: 'settings',
    variant: 'underline',
    size: 'lg',
  },
}

export const Small: Story = {
  args: {
    tabs: regularTabs,
    defaultActiveTab: 'overview',
    variant: 'default',
    size: 'sm',
  },
}

export const WithDisabledTab: Story = {
  args: {
    tabs: demoTabs,
    defaultActiveTab: 'overview',
    variant: 'default',
    size: 'md',
  },
}
