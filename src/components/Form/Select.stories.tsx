import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/Select',
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
