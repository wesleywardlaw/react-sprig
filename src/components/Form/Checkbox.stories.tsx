import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '../Form'

interface ExampleFormValues {
  agree: boolean
}

const schema = z.object({
  agree: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to continue' }),
  }),
})

const meta: Meta = {
  title: 'Components/Form/Checkbox',
  component: Form.Checkbox,
}
export default meta

type Story = StoryObj<typeof Form.Checkbox>

export const Basic: Story = {
  render: () => (
    <Form<ExampleFormValues>
      schema={schema}
      onSubmit={async (data) => {
        console.log(data)
        return { success: true }
      }}
    >
      <Form.Checkbox<ExampleFormValues>
        name='agree'
        label='I agree to the terms and conditions'
      />
      <Form.Error name='agree' />
      <Form.Submit className='mt-2'>Submit</Form.Submit>
    </Form>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Form<ExampleFormValues>
      schema={schema}
      onSubmit={async (data) => {
        console.log(data)
        return { success: true }
      }}
    >
      <Form.Checkbox<ExampleFormValues>
        name='agree'
        label='I agree to the terms and conditions (disabled)'
        disabled
      />
      <Form.Submit className='mt-2'>Submit</Form.Submit>
    </Form>
  ),
}
