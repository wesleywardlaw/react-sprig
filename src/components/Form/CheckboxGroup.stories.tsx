import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '../Form'

interface ExampleFormValues {
  fruits: string[]
}

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange', disabled: true },
  { value: 'grape', label: 'Grape' },
]

const schema = z.object({
  fruits: z.array(z.string()).min(1, 'Select at least one fruit'),
})

const meta: Meta = {
  title: 'Components/Form/CheckboxGroup',
  component: Form.CheckboxGroup,
}
export default meta

type Story = StoryObj<typeof Form.CheckboxGroup>

export const Basic: Story = {
  render: () => (
    <Form<ExampleFormValues>
      schema={schema}
      onSubmit={async (data) => {
        console.log(data)
        return { success: true }
      }}
    >
      <Form.CheckboxGroup<ExampleFormValues>
        name='fruits'
        options={options}
        legend='Select your favorite fruits'
      />
      <Form.Error name='fruits' />
      <Form.Submit className='mt-2'>Submit</Form.Submit>
    </Form>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Form<ExampleFormValues>
      schema={schema}
      onSubmit={async (data) => {
        console.log(data)
        return { success: true }
      }}
    >
      <Form.CheckboxGroup<ExampleFormValues>
        name='fruits'
        options={options}
        legend='Select your favorite fruits'
        orientation='horizontal'
      />
      <Form.Error name='fruits' />
      <Form.Submit className='mt-2'>Submit</Form.Submit>
    </Form>
  ),
}
