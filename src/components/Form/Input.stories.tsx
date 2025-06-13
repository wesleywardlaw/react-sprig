import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'

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
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password too short'),
      })}
      onSubmit={async (data: { email: string; password: string }) => {
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
