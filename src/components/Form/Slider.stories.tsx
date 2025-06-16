import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/Slider',
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

type SliderStory = StoryObj<{ step: number; min: number; max: number }>

export const BasicSlider: SliderStory = {
  args: {
    step: 1,
    min: 0,
    max: 100,
  },
  render: ({ step, min, max }) => (
    <Form
      schema={z.object({
        volume: z.number().min(min).max(max),
      })}
      onSubmit={async (data: { volume: number }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='volume'>
        <Form.Label htmlFor='volume'>Volume</Form.Label>
        <Form.Slider
          name='volume'
          min={min}
          max={max}
          step={step}
        />
        <Form.Error name='volume' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const SliderWithDefaultValue: Story = {
  render: () => (
    <Form
      schema={z.object({
        brightness: z.number().min(0).max(100),
      })}
      onSubmit={async (data: { brightness: number }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='brightness'>
        <Form.Label htmlFor='brightness'>Brightness</Form.Label>
        <Form.Slider
          name='brightness'
          min={0}
          max={100}
          step={5}
          defaultValue={50}
        />
        <Form.Error name='brightness' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const DisabledSlider: Story = {
  render: () => (
    <Form
      schema={z.object({
        speed: z.number(),
      })}
      onSubmit={async (data: { speed: number }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='speed'>
        <Form.Label htmlFor='speed'>Speed</Form.Label>
        <Form.Slider
          name='speed'
          min={0}
          max={200}
          step={10}
          disabled
        />
        <Form.Error name='speed' />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const SliderWithError: Story = {
  render: () => (
    <Form
      schema={z.object({
        temperature: z
          .number()
          .min(10, 'Temperature must be at least 10')
          .max(30, 'Temperature must not exceed 30'),
      })}
      onSubmit={async (data: { temperature: number }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='temperature'>
        <Form.Label htmlFor='temperature'>Temperature</Form.Label>
        <Form.Slider
          name='temperature'
          min={0}
          max={40}
          step={1}
        />
        <Form.Error name='temperature' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const SliderWithPrefixAndSuffix: Story = {
  render: () => (
    <Form
      schema={z.object({
        price: z.number().min(0).max(1000),
      })}
      onSubmit={async (data: { price: number }) => {
        console.log('Form submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='price'>
        <Form.Label htmlFor='price'>Price</Form.Label>
        <Form.Slider
          name='price'
          min={0}
          max={1000}
          step={50}
          valuePrefix='$'
          valueSuffix=' USD'
        />
        <Form.Error name='price' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}
