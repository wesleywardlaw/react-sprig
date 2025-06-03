import type { Meta, StoryObj } from '@storybook/react'
import { Navigation } from './index'

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  argTypes: {
    className: { control: 'text' },
  },
}
export default meta

type Story = StoryObj<typeof Navigation>

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    children: [
      { label: 'Web Development', href: '/products/web' },
      { label: 'Mobile Apps', href: '/products/mobile' },
      { label: 'Desktop Software', href: '/products/desktop' },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'Consulting', onClick: () => alert('Consulting clicked') },
      { label: 'Support', href: '/support' },
      { label: 'Training', href: '/training' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', onClick: () => alert('Contact clicked') },
]

const brand = {
  label: 'MyCompany',
  href: '/',
}

export const Basic: Story = {
  render: (args) => (
    <Navigation
      {...args}
      items={navItems}
      brand={brand}
    />
  ),
}

export const NoBrand: Story = {
  render: (args) => (
    <Navigation
      {...args}
      items={navItems}
    />
  ),
}

export const OnlyLinks: Story = {
  render: (args) => (
    <Navigation
      {...args}
      items={[
        { label: 'Home', href: '/' },
        { label: 'Docs', href: '/docs' },
        { label: 'Blog', href: '/blog' },
      ]}
    />
  ),
}

export const OnlyButtons: Story = {
  render: (args) => (
    <Navigation
      {...args}
      items={[
        { label: 'Dashboard', onClick: () => alert('Dashboard') },
        { label: 'Settings', onClick: () => alert('Settings') },
      ]}
      brand={brand}
    />
  ),
}

export const WithDropdowns: Story = {
  render: (args) => (
    <Navigation
      {...args}
      items={[
        { label: 'Main', href: '/' },
        {
          label: 'Dropdown',
          children: [
            { label: 'Option 1', href: '/option1' },
            { label: 'Option 2', onClick: () => alert('Option 2') },
          ],
        },
      ]}
      brand={brand}
    />
  ),
}
