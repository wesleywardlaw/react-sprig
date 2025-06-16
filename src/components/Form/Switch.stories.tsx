import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'
import { Switch } from './Switch'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/Switch',
  component: Form,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ minWidth: 200, width: '100%', maxWidth: 400 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Form>

export const BasicSwitch: Story = {
  render: () => (
    <Form
      schema={z.object({
        notifications: z.boolean(),
      })}
      onSubmit={async (data: { notifications: boolean }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='notifications'>
        <Form.Label htmlFor='notifications'>Enable Notifications</Form.Label>
        <Switch name='notifications' />
        <Form.Error name='notifications' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const DisabledSwitch: Story = {
  render: () => (
    <Form
      schema={z.object({
        notifications: z.boolean().optional(),
      })}
      onSubmit={async (data: { notifications?: boolean }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='notifications'>
        <Form.Label htmlFor='notifications'>Enable Notifications</Form.Label>
        <Switch
          name='notifications'
          disabled
        />
        <Form.Error name='notifications' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const SwitchWithCustomColors: Story = {
  render: () => (
    <Form
      schema={z.object({
        darkMode: z.boolean(),
      })}
      onSubmit={async (data: { darkMode: boolean }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='darkMode'>
        <Form.Label htmlFor='darkMode'>Enable Dark Mode</Form.Label>
        <Switch
          name='darkMode'
          onColor='bg-green-500'
          offColor='bg-red-500'
        />
        <Form.Error name='darkMode' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const SwitchWithError: Story = {
  render: () => (
    <Form
      schema={z.object({
        notifications: z.boolean().refine(() => false, {
          message: 'This is a forced error',
        }),
      })}
      onSubmit={async (data: { notifications: boolean }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='notifications'>
        <Form.Label htmlFor='notifications'>Enable Notifications</Form.Label>
        <Switch name='notifications' />
        <Form.Error name='notifications' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}
