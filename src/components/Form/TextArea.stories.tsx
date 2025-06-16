import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/TextArea',
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

export const BasicTextArea: Story = {
  render: () => (
    <Form
      schema={z.object({
        description: z.string().min(10, 'Description must be at least 10 characters long'),
      })}
      onSubmit={async (data: { description: string }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='description'>
        <Form.Label htmlFor='description'>Description</Form.Label>
        <Form.TextArea
          name='description'
          placeholder='Enter a description'
          rows={4}
        />
        <Form.Error name='description' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const TextAreaWithMaxLength: Story = {
  render: () => (
    <Form
      schema={z.object({
        feedback: z.string().max(100, 'Feedback must not exceed 100 characters'),
      })}
      onSubmit={async (data: { feedback: string }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='feedback'>
        <Form.Label htmlFor='feedback'>Feedback</Form.Label>
        <Form.TextArea
          name='feedback'
          placeholder='Enter your feedback'
          maxLength={100}
        />
        <Form.Error name='feedback' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const DisabledTextArea: Story = {
  render: () => (
    <Form
      schema={z.object({
        notes: z.string().min(1, 'Must be at least 1 character long'),
      })}
      onSubmit={async (data: { notes?: string }) => {
        console.log('Form submitted:', data)
        return { success: false }
      }}
    >
      <Form.Field name='notes'>
        <Form.Label htmlFor='notes'>Notes</Form.Label>
        <Form.TextArea
          name='notes'
          placeholder='This field is disabled'
          disabled
        />
        <Form.Error name='notes' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const TextAreaWithDescription: Story = {
  render: () => (
    <Form
      schema={z.object({
        bio: z.string().min(20, 'Bio must be at least 20 characters long'),
      })}
      onSubmit={async (data: { bio: string }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='bio'>
        <Form.Label htmlFor='bio'>Bio</Form.Label>
        <Form.TextArea
          name='bio'
          placeholder='Tell us about yourself'
          description='Provide a brief bio of at least 20 characters.'
        />
        <Form.Error name='bio' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const RequiredTextArea: Story = {
  render: () => (
    <Form
      schema={z.object({
        comments: z.string().min(1, 'Comments are required'),
      })}
      onSubmit={async (data: { comments: string }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='comments'>
        <Form.Label htmlFor='comments'>Comments</Form.Label>
        <Form.TextArea
          name='comments'
          placeholder='Enter your comments'
          required
          rows={6}
          autoComplete='on'
        />
        <Form.Error name='comments' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}
