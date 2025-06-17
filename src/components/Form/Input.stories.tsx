import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'
import { useState } from 'react'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/Input',
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

export const Input: Story = {
  render: () => (
    <Form
      schema={z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
      })}
      onSubmit={async (data: { email?: string; password?: string }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
      className='flex flex-col'
    >
      <Form.Field name='email'>
        <Form.Label htmlFor='email'>Email</Form.Label>
        <Form.Input
          name='email'
          type='email'
          placeholder='Enter your email'
        />
        <Form.Error name='email' />
      </Form.Field>

      <Form.Field
        name='password'
        className='mb-4'
      >
        <Form.Label htmlFor='password'>Password</Form.Label>
        <Form.Input
          name='password'
          type='password'
          placeholder='Enter your password'
        />
        <Form.Error name='password' />
      </Form.Field>

      <Form.Submit className='self-end'>Submit</Form.Submit>
    </Form>
  ),
}

export const FieldErrorSubmission: Story = {
  render: () => (
    <Form
      schema={z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password too short'),
      })}
      onSubmit={async () => {
        return {
          errors: {
            email: ['This email is already in use'],
          },
        }
      }}
      className='flex flex-col'
    >
      <Form.Field name='email'>
        <Form.Label htmlFor='email'>Email</Form.Label>
        <Form.Input
          name='email'
          type='email'
          placeholder='Enter your email'
        />
        <Form.Error name='email' />
      </Form.Field>

      <Form.Field
        name='password'
        className='mb-4'
      >
        <Form.Label htmlFor='password'>Password</Form.Label>
        <Form.Input
          name='password'
          type='password'
          placeholder='Enter your password'
        />
        <Form.Error name='password' />
      </Form.Field>

      <Form.Submit className='self-end'>Submit</Form.Submit>
    </Form>
  ),
}

export const RootErrorSubmission: Story = {
  render: () => (
    <Form
      schema={z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password too short'),
      })}
      onSubmit={async () => {
        return {
          errors: {
            root: ['Submission failed due to server error'],
          },
        }
      }}
    >
      <Form.Field name='email'>
        <Form.Label htmlFor='email'>Email</Form.Label>
        <Form.Input
          name='email'
          type='email'
          placeholder='Enter your email'
        />
        <Form.Error name='email' />
      </Form.Field>

      <Form.Field
        name='password'
        className='mb-4'
      >
        <Form.Label htmlFor='password'>Password</Form.Label>
        <Form.Input
          name='password'
          type='password'
          placeholder='Enter your password'
        />
        <Form.Error name='password' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const Disabled: Story = {
  render: () => {
    const [disabled, setDisabled] = useState(false)
    const schema = z.object({
      disabledField: z.preprocess(
        (val: unknown) => (typeof val === 'string' ? (val === '' ? undefined : val) : undefined),
        z.string().min(3, 'must be at least 3 characters').optional()
      ),
      alwaysEnabled: z.string().optional(),
    }) as unknown as z.ZodType<{ disabledField?: string; alwaysEnabled?: string }>
    return (
      <Form
        schema={schema}
        onSubmit={async (data: { disabledField?: string; alwaysEnabled?: string }) => {
          console.log('Form submitted:', data)
          return { success: true }
        }}
        className='flex flex-col gap-4'
      >
        <button
          type='button'
          onClick={() => setDisabled((d) => !d)}
          className='mb-2 border rounded px-2 py-1 bg-gray-100 hover:bg-gray-200 self-start'
        >
          {disabled ? 'Enable' : 'Disable'} Disabled Field
        </button>
        <Form.Field name='disabledField'>
          <Form.Label htmlFor='disabledField'>Toggle Disabled Field</Form.Label>
          <Form.Input
            name='disabledField'
            placeholder='Can be disabled'
            disabled={disabled}
          />
          <Form.Error name='disabledField' />
        </Form.Field>
        <Form.Field name='alwaysEnabled'>
          <Form.Label htmlFor='alwaysEnabled'>Always Enabled Field</Form.Label>
          <Form.Input
            name='alwaysEnabled'
            placeholder='Always enabled'
          />
        </Form.Field>
        <Form.Submit className='self-end'>Submit</Form.Submit>
      </Form>
    )
  },
}
