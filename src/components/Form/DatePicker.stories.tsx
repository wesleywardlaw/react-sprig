import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/DatePicker',
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

export const BasicDatePicker: Story = {
  render: () => (
    <Form
      schema={z.object({
        date: z.date({
          invalid_type_error: 'Please select a valid date',
        }),
      })}
      onSubmit={async (data: { date: Date }) => {
        console.log('Date submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='date'>
        <Form.Label htmlFor='date'>Select Date</Form.Label>
        <Form.DatePicker
          name='date'
          required
        />
        <Form.Error name='date' />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const RequiredDatePicker: Story = {
  render: () => (
    <Form
      schema={z.object({
        date: z.date({
          invalid_type_error: 'Please select a valid date',
        }),
      })}
      onSubmit={async (data: { date: Date }) => {
        console.log('Date submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='date'>
        <Form.Label htmlFor='date'>Date (Required)</Form.Label>
        <Form.DatePicker
          name='date'
          required
        />
        <Form.Error name='date' />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const DatePickerWithDefaultValue: Story = {
  render: () => (
    <Form
      schema={z.object({
        date: z.date({
          invalid_type_error: 'Please select a valid date',
        }),
      })}
      onSubmit={async (data: { date?: Date }) => {
        console.log('Date submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='date'>
        <Form.Label htmlFor='date'>Date (Default: 2025-01-01)</Form.Label>
        <Form.DatePicker
          name='date'
          defaultValue={new Date(2025, 1, 1)}
        />
        <Form.Error name='date' />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const DisabledDatePicker: Story = {
  render: () => (
    <Form
      schema={z.object({
        date: z.date({
          invalid_type_error: 'Please select a valid date',
        }),
      })}
      onSubmit={async (data: { date?: Date }) => {
        console.log('Date submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='date'>
        <Form.Label htmlFor='date'>Date (Disabled)</Form.Label>
        <Form.DatePicker
          name='date'
          disabled
        />
        <Form.Error name='date' />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const DatePickerWithMinMax: Story = {
  render: () => {
    const minDate = new Date('2025-01-01')
    const maxDate = new Date('2025-12-31')
    return (
      <Form
        schema={z.object({
          date: z
            .date({
              required_error: 'Please select a date',
              invalid_type_error: 'Please select a valid date',
            })
            .min(minDate, { message: 'Date must be in 2025' })
            .max(maxDate, { message: 'Date must be in 2025' })
            .optional(),
        })}
        onSubmit={async (data: { date?: Date }) => {
          console.log('Date submitted:', data)
          return { success: true }
        }}
      >
        <Form.Field name='date'>
          <Form.Label htmlFor='date'>Date (2025 only)</Form.Label>
          <Form.DatePicker name='date' />
          <Form.Error name='date' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )
  },
}
