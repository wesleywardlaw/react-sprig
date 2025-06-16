import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/RadioGroup',
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
