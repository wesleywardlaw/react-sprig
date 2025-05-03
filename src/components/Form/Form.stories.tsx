import { Meta, StoryObj } from '@storybook/react'
import { z } from 'zod'
import Form from './index'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
}

export default meta

type Story = StoryObj<typeof Form>

export const BasicForm: Story = {
  render: () => (
    <Form
      schema={z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password too short'),
      })}
      onSubmit={async (data: { email: string; password: string }) => {
        console.log('Form submitted:', data)
        return { success: true }
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
