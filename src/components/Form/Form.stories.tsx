import { Meta, StoryObj } from '@storybook/react'
import { z } from 'zod'
import { Form } from './index'

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
        acceptTerms: z.literal(true, {
          errorMap: () => ({ message: 'You must accept the terms and conditions' }),
        }),
        interests: z.array(z.string()).min(1, 'Select at least one interest'),
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

      <Form.Field name='interests'>
        <Form.CheckboxGroup
          name='interests'
          legend='Your interests'
          orientation='horizontal'
          options={[
            { value: 'tech', label: 'Technology' },
            { value: 'sports', label: 'Sports' },
            { value: 'music', label: 'Music' },
            { value: 'travel', label: 'Travel' },
          ]}
        />
        <Form.Error name='interests' />
      </Form.Field>

      <Form.Field name='acceptTerms'>
        <Form.Checkbox
          name='acceptTerms'
          label='I accept the terms and conditions'
        />
        <Form.Error name='acceptTerms' />
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

export const SelectBasic: Story = {
  render: () => (
    <Form
      schema={z.object({
        country: z.string().nonempty('Please select a country'),
      })}
      onSubmit={async (data: { country: string }) => {
        console.log('Selected country:', data)
        return { success: true }
      }}
    >
      <Form.Field
        name='country'
        className='mb-4'
      >
        <Form.Label htmlFor='country'>Country</Form.Label>
        <Form.Select
          name='country'
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'mx', label: 'Mexico' },
          ]}
        />
        <Form.Error name='country' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const SelectWithDefaultValue: Story = {
  render: () => (
    <Form
      schema={z.object({
        country: z.string().nonempty('Please select a country'),
      })}
      onSubmit={async (data: { country: string }) => {
        console.log('Selected country:', data)
        return { success: true }
      }}
    >
      <Form.Field
        name='country'
        className='mb-4'
      >
        <Form.Label htmlFor='country'>Country</Form.Label>
        <Form.Select
          name='country'
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'mx', label: 'Mexico' },
          ]}
          defaultValue='ca'
        />
        <Form.Error name='country' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const SelectWithDisabledOption: Story = {
  render: () => (
    <Form
      schema={z.object({
        country: z.string().nonempty('Please select a country'),
      })}
      onSubmit={async (data: { country: string }) => {
        console.log('Selected country:', data)
        return { success: true }
      }}
    >
      <Form.Field
        name='country'
        className='mb-4'
      >
        <Form.Label htmlFor='country'>Country</Form.Label>
        <Form.Select
          name='country'
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada', disabled: true },
            { value: 'mx', label: 'Mexico' },
          ]}
        />
        <Form.Error name='country' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const RadioGroup: Story = {
  render: () => (
    <Form
      schema={z.object({
        gender: z.string().nonempty('Please select a gender'),
      })}
      onSubmit={async (data: { gender: string }) => {
        console.log('Selected gender:', data)
        return { success: true }
      }}
    >
      <Form.Field name='gender'>
        <Form.Label>Gender</Form.Label>
        <Form.RadioGroup
          name='gender'
          className='mt-2'
        >
          <div className='flex items-center gap-2'>
            <Form.Radio
              id='gender-male'
              value='male'
            />
            <Form.Label htmlFor='gender-male'>Male</Form.Label>
          </div>

          <div className='flex items-center gap-2'>
            <Form.Radio
              id='gender-female'
              value='female'
            />
            <Form.Label htmlFor='gender-female'>Female</Form.Label>
          </div>

          <div className='flex items-center gap-2'>
            <Form.Radio
              id='gender-non-binary'
              value='non-binary'
            />
            <Form.Label htmlFor='gender-non-binary'>Non-binary</Form.Label>
          </div>

          <div className='flex items-center gap-2'>
            <Form.Radio
              id='gender-prefer-not-to-say'
              value='prefer-not-to-say'
            />
            <Form.Label htmlFor='gender-prefer-not-to-say'>Prefer not to say</Form.Label>
          </div>
        </Form.RadioGroup>
        <Form.Error name='gender' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const RadioGroupErrorExample: Story = {
  render: () => (
    <Form
      schema={z.object({
        gender: z.literal('impossible_value', {
          errorMap: () => ({ message: 'This value is not allowed' }),
        }),
      })}
      onSubmit={async (data: { gender: string }) => {
        console.log('Selected gender:', data)
        return { success: true }
      }}
    >
      <Form.Field name='gender'>
        <Form.Label>Gender</Form.Label>
        <Form.RadioGroup
          name='gender'
          className='mt-2'
        >
          <div className='flex items-center gap-2'>
            <Form.Radio
              id='gender-male'
              value='male'
            />
            <Form.Label htmlFor='gender-male'>Male</Form.Label>
          </div>

          <div className='flex items-center gap-2'>
            <Form.Radio
              id='gender-female'
              value='female'
            />
            <Form.Label htmlFor='gender-female'>Female</Form.Label>
          </div>
        </Form.RadioGroup>
        <Form.Error name='gender' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

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
        notes: z.string().optional(),
      })}
      onSubmit={async (data: { notes?: string }) => {
        console.log('Form submitted:', data)
        return { success: true }
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
