import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { z } from 'zod'
import { Form } from './index'
import { Switch } from './Switch'

describe('Form Component', () => {
  const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password too short'),
  })

  it('renders the form with all fields and submit button', () => {
    render(
      <Form
        schema={schema}
        onSubmit={vi.fn()}
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

        <Form.Field name='password'>
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
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('displays field-specific error messages on validation failure', async () => {
    const onSubmit = vi.fn()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
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

        <Form.Field name='password'>
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
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
    expect(await screen.findByText(/password too short/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
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

        <Form.Field name='password'>
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
    )

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('displays root-level error messages on submission failure', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      errors: {
        root: ['Submission failed due to server error'],
      },
    })

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
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

        <Form.Field name='password'>
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
    )

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(/submission failed due to server error/i)).toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
  })

  it('displays a success message on successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true })

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
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

        <Form.Field name='password'>
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
    )

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(/submission successful!/i)).toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('renders the select field with options and handles selection', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          country: z.string().nonempty('Country is required'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='country'>
          <Form.Label htmlFor='country'>Country</Form.Label>
          <Form.Select
            name='country'
            options={[
              { value: '', label: 'Select a country' },
              { value: 'usa', label: 'USA' },
              { value: 'canada', label: 'Canada' },
            ]}
          />
          <Form.Error name='country' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /select a country/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /usa/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /canada/i })).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText(/country/i), 'usa')
    expect(screen.getByLabelText(/country/i)).toHaveValue('usa')

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ country: 'usa' })
    })
  })

  it('disables the submit button when the form is invalid', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          country: z.string().nonempty('Country is required'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='country'>
          <Form.Label htmlFor='country'>Country</Form.Label>
          <Form.Select
            name='country'
            options={[
              { value: '', label: 'Select a country' },
              { value: 'usa', label: 'USA' },
              { value: 'canada', label: 'Canada' },
            ]}
          />
          <Form.Error name='country' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Initially, the submit button should be disabled
    expect(submitButton).toBeDisabled()

    // Select a valid option
    await user.selectOptions(screen.getByLabelText(/country/i), 'usa')

    // The submit button should now be enabled
    expect(submitButton).toBeEnabled()

    // Submit the form
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ country: 'usa' })
    })
  })

  it('renders a disabled option in the select field', async () => {
    render(
      <Form
        schema={z.object({
          country: z.string().nonempty('Country is required'),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='country'>
          <Form.Label htmlFor='country'>Country</Form.Label>
          <Form.Select
            name='country'
            options={[
              { value: '', label: 'Select a country', disabled: true },
              { value: 'usa', label: 'USA' },
              { value: 'canada', label: 'Canada' },
            ]}
          />
          <Form.Error name='country' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const disabledOption = screen.getByRole('option', { name: /select a country/i })

    // Check that the option is disabled
    expect(disabledOption).toBeDisabled()
  })

  it('renders a checkbox and allows form submission when checked', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='terms'>
          <Form.Checkbox
            name='terms'
            label='I accept the terms and conditions'
          />
          <Form.Label htmlFor='terms'>I accept the terms and conditions</Form.Label>
          <Form.Error name='terms' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const checkbox = screen.getByLabelText(/i accept the terms and conditions/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Initially, the checkbox should be unchecked and the submit button disabled
    expect(checkbox).not.toBeChecked()
    expect(submitButton).toBeDisabled()

    // Check the checkbox
    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    // The submit button should now be enabled
    expect(submitButton).toBeEnabled()

    // Submit the form
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ terms: true })
    })
  })

  it('renders an error message when the checkbox is not checked', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='terms'>
          <Form.Checkbox
            name='terms'
            label='I accept the terms and conditions'
          />
          <Form.Label htmlFor='terms'>I accept the terms and conditions</Form.Label>
          <Form.Error name='terms' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Initially, the submit button should be disabled
    expect(submitButton).toBeDisabled()

    // Check and uncheck the checkbox to trigger the error message
    await user.click(screen.getByLabelText(/i accept the terms and conditions/i))
    await user.click(screen.getByLabelText(/i accept the terms and conditions/i))

    // Check for the error message
    expect(await screen.findByText(/you must accept the terms/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders a group of checkboxes and handles their state', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          preferences: z.array(z.string()).nonempty('At least one option must be selected'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='preferences'>
          <Form.CheckboxGroup
            name='preferences'
            legend='Select your preferences'
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3', disabled: true },
            ]}
          />
          <Form.Error name='preferences' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const option1 = screen.getByLabelText(/option 1/i)
    const option2 = screen.getByLabelText(/option 2/i)
    const option3 = screen.getByLabelText(/option 3/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Initially, no checkboxes should be checked and the submit button disabled
    expect(option1).not.toBeChecked()
    expect(option2).not.toBeChecked()
    expect(option3).not.toBeChecked()
    expect(submitButton).toBeDisabled()

    // Check the first two options
    await user.click(option1)
    await user.click(option2)
    expect(option1).toBeChecked()
    expect(option2).toBeChecked()

    // The disabled option should remain unchecked
    expect(option3).not.toBeChecked()

    // The submit button should now be enabled
    expect(submitButton).toBeEnabled()

    // Submit the form
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ preferences: ['option1', 'option2'] })
    })
  })

  it('displays an error message when no checkboxes are selected', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          preferences: z.array(z.string()).nonempty('At least one option must be selected'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='preferences'>
          <Form.CheckboxGroup
            name='preferences'
            legend='Select your preferences'
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3', disabled: true },
            ]}
          />
          <Form.Error name='preferences' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const option1 = screen.getByLabelText(/option 1/i)
    await user.click(option1)
    await user.click(option1)

    // Check for the error message
    expect(await screen.findByText(/at least one option must be selected/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders a RadioGroup with individual Radio components and ensures proper typing and submission', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          gender: z.string().nonempty('Please select a gender'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='gender'>
          <Form.Label>Gender</Form.Label>
          <Form.RadioGroup name='gender'>
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
    )

    const maleOption = screen.getByLabelText('Male')
    const femaleOption = screen.getByLabelText('Female')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Initially, no radio buttons should be selected and the submit button disabled
    expect(maleOption).not.toBeChecked()
    expect(femaleOption).not.toBeChecked()
    expect(submitButton).toBeDisabled()

    // Select an option
    await user.click(maleOption)
    expect(maleOption).toBeChecked()

    // The submit button should now be enabled
    expect(submitButton).toBeEnabled()

    // Submit the form
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ gender: 'male' })
    })
  })

  it('throws an error if Radio is used outside of RadioGroup without a name', () => {
    expect(() => {
      render(
        <Form
          schema={z.object({
            gender: z.string().nonempty('Please select a gender'),
          })}
          onSubmit={vi.fn()}
        >
          <Form.Field name='gender'>
            <Form.Radio value='male' />
          </Form.Field>
        </Form>
      )
    }).toThrow('Radio component must have a name prop when used outside of RadioGroup')
  })

  it('displays an error when the schema cannot be satisfied after a selection', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          gender: z.literal('impossible_value', {
            errorMap: () => ({ message: 'This value is not allowed' }),
          }),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='gender'>
          <Form.Label>Gender</Form.Label>
          <Form.RadioGroup name='gender'>
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
    )

    const maleOption = screen.getByLabelText('Male')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Select an option
    await user.click(maleOption)
    expect(maleOption).toBeChecked()

    // Submit the form
    await user.click(submitButton)

    // Check for the error message
    expect(await screen.findByText(/this value is not allowed/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

describe('TextArea Component', () => {
  const schema = z.object({
    description: z.string().min(10, 'Description must be at least 10 characters long'),
  })

  it('renders the TextArea and allows data submission', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='description'>
          <Form.Label htmlFor='description'>Description</Form.Label>
          <Form.TextArea
            name='description'
            placeholder='Enter a description'
            rows={4}
            autoComplete='on'
          />
          <Form.Error name='description' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const textArea = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Initially, the submit button should be disabled
    expect(submitButton).toBeDisabled()

    // Enter valid data
    await user.type(textArea, 'This is a valid description.')

    // The submit button should now be enabled
    expect(submitButton).toBeEnabled()

    // Submit the form
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ description: 'This is a valid description.' })
    })
  })

  it('displays an error message when the input is invalid', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='description'>
          <Form.Label htmlFor='description'>Description</Form.Label>
          <Form.TextArea
            name='description'
            placeholder='Enter a description'
            rows={4}
            autoComplete='on'
          />
          <Form.Error name='description' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const textArea = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Enter invalid data
    await user.type(textArea, 'Short')
    await user.click(submitButton)

    // Check for the error message
    expect(
      await screen.findByText(/description must be at least 10 characters long/i)
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders a disabled TextArea', () => {
    render(
      <Form
        schema={schema}
        onSubmit={vi.fn()}
      >
        <Form.Field name='description'>
          <Form.Label htmlFor='description'>Description</Form.Label>
          <Form.TextArea
            name='description'
            placeholder='This field is disabled'
            disabled
          />
          <Form.Error name='description' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const textArea = screen.getByLabelText(/description/i)

    // Check that the TextArea is disabled
    expect(textArea).toBeDisabled()
  })

  it('respects the maxLength property', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          feedback: z.string().max(20, 'Feedback must not exceed 20 characters'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='feedback'>
          <Form.Label htmlFor='feedback'>Feedback</Form.Label>
          <Form.TextArea
            name='feedback'
            placeholder='Enter your feedback'
            maxLength={20}
          />
          <Form.Error name='feedback' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const textArea = screen.getByLabelText(/feedback/i)

    // Enter data exceeding maxLength
    await user.type(textArea, 'This feedback is too long.')

    // Check that the value is truncated to maxLength
    expect(textArea).toHaveValue('This feedback is too')
  })
})

describe('TextArea Component - Additional Tests', () => {
  it('renders with the correct placeholder', () => {
    render(
      <Form
        schema={z.object({
          description: z.string().optional(),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='description'>
          <Form.Label htmlFor='description'>Description</Form.Label>
          <Form.TextArea
            name='description'
            placeholder='Custom placeholder'
          />
          <Form.Error name='description' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const textArea = screen.getByPlaceholderText(/custom placeholder/i)
    expect(textArea).toBeInTheDocument()
  })

  it('renders with the correct defaultValue', () => {
    render(
      <Form
        schema={z.object({
          description: z.string().optional(),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='description'>
          <Form.Label htmlFor='description'>Description</Form.Label>
          <Form.TextArea
            name='description'
            defaultValue='Default text'
          />
          <Form.Error name='description' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const textArea = screen.getByDisplayValue(/default text/i)
    expect(textArea).toBeInTheDocument()
  })

  it('renders with the correct number of rows', () => {
    render(
      <Form
        schema={z.object({
          description: z.string().optional(),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='description'>
          <Form.Label htmlFor='description'>Description</Form.Label>
          <Form.TextArea
            name='description'
            rows={6}
          />
          <Form.Error name='description' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const textArea = screen.getByLabelText(/description/i)
    expect(textArea).toHaveAttribute('rows', '6')
  })
})

describe('Form.Slider Component', () => {
  it('renders the slider and allows value changes', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          volume: z.number().min(0).max(100),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='volume'>
          <Form.Label htmlFor='volume'>Volume</Form.Label>
          <Form.Slider
            name='volume'
            min={0}
            max={100}
            step={1}
          />
          <Form.Error name='volume' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const slider = screen.getByTestId('slider-input')
    expect(slider).toBeInTheDocument()

    fireEvent.change(slider, { target: { value: '50' } })

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ volume: 50 })
    })
  })

  it('displays an error when the value is out of range', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          volume: z
            .number()
            .min(10, 'Volume must be at least 10')
            .max(90, 'Volume must not exceed 90'),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='volume'>
          <Form.Label htmlFor='volume'>Volume</Form.Label>
          <Form.Slider
            name='volume'
            min={0}
            max={100}
            step={1}
          />
          <Form.Error name='volume' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const slider = screen.getByLabelText(/volume/i)

    // Set an invalid value
    fireEvent.change(slider, { target: { value: '5' } })
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    // Check for the error message
    expect(await screen.findByText(/volume must be at least 10/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders a disabled slider', () => {
    render(
      <Form
        schema={z.object({
          volume: z.number().optional(),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='volume'>
          <Form.Label htmlFor='volume'>Volume</Form.Label>
          <Form.Slider
            name='volume'
            min={0}
            max={100}
            step={1}
            disabled
          />
          <Form.Error name='volume' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const slider = screen.getByLabelText(/volume/i)
    expect(slider).toBeDisabled()
  })

  it('respects the defaultValue property', () => {
    render(
      <Form
        schema={z.object({
          volume: z.number().optional(),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='volume'>
          <Form.Label htmlFor='volume'>Volume</Form.Label>
          <Form.Slider
            name='volume'
            min={0}
            max={100}
            step={1}
            defaultValue={30}
          />
          <Form.Error name='volume' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const slider = screen.getByLabelText(/volume/i)
    expect(slider).toHaveValue('30')
  })

  it('renders with a prefix and suffix', () => {
    render(
      <Form
        schema={z.object({
          price: z.number().min(0).max(1000),
        })}
        onSubmit={vi.fn()}
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
    )
    expect(screen.getByText(/\$0 USD/i)).toBeInTheDocument()
  })
})

describe('Form.Switch Component', () => {
  it('renders the switch and toggles its state', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          notifications: z.boolean(),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='notifications'>
          <Form.Label htmlFor='notifications'>Enable Notifications</Form.Label>
          <Switch name='notifications' />
          <Form.Error name='notifications' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const switchInput = screen.getByRole('switch')
    expect(switchInput).not.toBeChecked()

    // Toggle the switch
    await user.click(switchInput)
    expect(switchInput).toBeChecked()

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith({ notifications: true })
  })

  it('renders a disabled switch', () => {
    render(
      <Form
        schema={z.object({
          notifications: z.boolean().optional(),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='notifications'>
          <Form.Label htmlFor='notifications'>Enable Notifications</Form.Label>
          <Switch
            name='notifications'
            disabled
          />
          <Form.Error name='notifications' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const switchInput = screen.getByRole('checkbox')
    expect(switchInput).toBeDisabled()
  })

  it('displays an error message when validation fails', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={z.object({
          notifications: z.boolean().refine(() => false, {
            message: 'This is a forced error',
          }),
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name='notifications'>
          <Form.Label htmlFor='notifications'>Enable Notifications</Form.Label>
          <Switch name='notifications' />
          <Form.Error name='notifications' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const switchInput = screen.getByRole('switch')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Toggle the switch
    await user.click(switchInput)
    expect(switchInput).toBeChecked()

    // Submit the form
    await user.click(submitButton)

    // Check for the error message
    expect(await screen.findByText(/this is a forced error/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('applies custom colors for on and off states', () => {
    render(
      <Form
        schema={z.object({
          darkMode: z.boolean(),
        })}
        onSubmit={vi.fn()}
      >
        <Form.Field name='darkMode'>
          <Form.Label htmlFor='darkMode'>Enable Dark Mode</Form.Label>
          <Switch
            name='darkMode'
            onColor='bg-green-500'
            offColor='bg-red-500'
          />
          <Form.Error name='darkMode' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const switchContainer = screen.getByRole('switch')
    expect(switchContainer).toHaveClass('bg-red-500')

    // Simulate toggling the switch
    fireEvent.click(switchContainer!)
    expect(switchContainer).toHaveClass('bg-green-500')
  })
})

describe('Form.FileInput Component', () => {
  const schema = z.object({
    files: z
      .custom<File>()
      .array()
      .min(1, 'Please select at least one file')
      .max(3, 'Maximum 3 files allowed')
      .refine((files) => files.every((file) => file.size <= 1024 * 1024), {
        message: 'Some files exceed the 1MB limit',
        path: ['files'],
      })
      .superRefine((files, ctx) => {
        files.forEach((file, index) => {
          if (file.size > 1024 * 1024) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${file.name} exceeds 1MB`,
              path: [index],
            })
          }
        })
      }),
  })
  it('renders the FileInput and allows file selection', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='files'>
          <Form.Label htmlFor='files'>Upload Files</Form.Label>
          <Form.FileInput
            name='files'
            accept='.png,.jpg'
            multiple
          />
          <Form.Error name='files' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const file = new File(['file content'], 'example.png', { type: 'image/png' })
    const input = screen.getByLabelText(/upload files/i) as HTMLInputElement

    await user.upload(input, [file])

    fireEvent.change(input, {
      target: { files: [file] },
    })

    await user.click(screen.getByText(/submit/i))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit.mock.calls[0][0].files[0].name).toBe('example.png')
    })
  })

  it('displays an error when too many files are selected', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='files'>
          <Form.Label htmlFor='files'>Upload Files</Form.Label>
          <Form.FileInput
            name='files'
            accept='.png,.jpg'
            multiple
          />
          <Form.Error name='files' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const fileInput = screen.getByLabelText(/upload files/i)
    const files = [
      new File(['file1'], 'file1.png', { type: 'image/png' }),
      new File(['file2'], 'file2.png', { type: 'image/png' }),
      new File(['file3'], 'file3.png', { type: 'image/png' }),
      new File(['file4'], 'file4.png', { type: 'image/png' }),
    ]

    await user.upload(fileInput, files)

    expect(await screen.findByText(/maximum 3 files allowed/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('displays an error when a file exceeds the size limit', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='files'>
          <Form.Label htmlFor='files'>Upload Files</Form.Label>
          <Form.FileInput
            name='files'
            accept='.png,.jpg'
            multiple
          />
          <Form.Error name='files' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const fileInput = screen.getByLabelText(/upload files/i)
    const largeFile = new File([new Array(1024 * 1024 + 1).fill('a').join('')], 'large.png', {
      type: 'image/png',
    })

    await user.upload(fileInput, largeFile)

    expect(await screen.findByText(/some files exceed the 1mb limit/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears selected files when the clear button is clicked', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='files'>
          <Form.Label htmlFor='files'>Upload Files</Form.Label>
          <Form.FileInput
            name='files'
            accept='.png,.jpg'
            multiple
          />
          <Form.Error name='files' />
        </Form.Field>

        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const fileInput = screen.getByLabelText(/upload files/i) as HTMLInputElement
    const file = new File(['file content'], 'example.png', { type: 'image/png' })

    await user.upload(fileInput, file)

    const clearButton = screen.getByRole('button', { name: /clear all/i })
    await user.click(clearButton)

    expect(fileInput.files).toHaveLength(0)
  })
})

describe('Form.DatePicker Component', () => {
  // Use string for date to match input type="date" value
  const schema = z.object({
    date: z
      .date({ required_error: 'Date is required', invalid_type_error: 'Invalid date' })
      .refine((date) => date >= new Date('2020-01-01'), {
        message: 'Date must be after Jan 1, 2020',
      })
      .refine((date) => date <= new Date('2030-12-31'), {
        message: 'Date must be before Dec 31, 2030',
      }),
  })

  it('renders the DatePicker and allows date selection', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(async (data: { date?: Date }) => {
      console.log('[MOCK] Form submitted with:', data)
      return { success: true }
    })
    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='date'>
          <Form.Label htmlFor='date'>Select Date</Form.Label>
          <Form.DatePicker name='date' />
          <Form.Error name='date' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )
    const dateInput = screen.getByLabelText(/select date/i)
    const submitButton = screen.getByText(/submit/i)
    await user.clear(dateInput) // Clear existing value if any
    await user.type(dateInput, '05/15/2025')
    await user.tab()
    await user.click(submitButton)
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
    const toUTCMidnight = (date?: Date): Date | undefined => {
      if (!date) return undefined
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    }
    const submittedData = onSubmit.mock.calls[0]?.[0]
    const normalizedDate = toUTCMidnight(submittedData?.date)

    expect(normalizedDate).toBeDefined()
    expect(normalizedDate!).toEqual(new Date('2025-05-15T00:00:00Z'))
  })

  it('shows an invalid error if no date is selected', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='date'>
          <Form.Label htmlFor='date'>Select Date</Form.Label>
          <Form.DatePicker name='date' />
          <Form.Error name='date' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )
    const dateInput = screen.getByLabelText(/select date/i)
    await user.type(dateInput, '5/10/2005')
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    expect(await screen.findByText(/invalid date/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows a min date error if date is too early', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='date'>
          <Form.Label htmlFor='date'>Select Date</Form.Label>
          <Form.DatePicker name='date' />
          <Form.Error name='date' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const dateInput = screen.getByLabelText(/select date/i)
    await user.type(dateInput, '5/10/2005')
    await user.type(dateInput, '{enter}')
    expect(await screen.findByText(/Date must be after Jan 1, 2020/i)).toBeInTheDocument()
  })

  it('shows a max date error if date is too late', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form
        schema={schema}
        onSubmit={onSubmit}
      >
        <Form.Field name='date'>
          <Form.Label htmlFor='date'>Select Date</Form.Label>
          <Form.DatePicker name='date' />
          <Form.Error name='date' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )

    const dateInput = screen.getByLabelText(/select date/i)
    await user.type(dateInput, '5/10/2031')
    await user.type(dateInput, '{enter}')
    expect(await screen.findByText(/Date must be before Dec 31, 2030/i)).toBeInTheDocument()
  })

  it('renders a disabled DatePicker', () => {
    render(
      <Form
        schema={schema}
        onSubmit={vi.fn()}
      >
        <Form.Field name='date'>
          <Form.Label htmlFor='date'>Select Date</Form.Label>
          <Form.DatePicker
            name='date'
            disabled
          />
          <Form.Error name='date' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )
    const dateInput = screen.getByLabelText(/select date/i)
    expect(dateInput).toBeDisabled()
  })

  it('renders with a defaultValue', () => {
    render(
      <Form
        schema={schema}
        onSubmit={vi.fn()}
      >
        <Form.Field name='date'>
          <Form.Label htmlFor='date'>Select Date</Form.Label>
          <Form.DatePicker
            name='date'
            defaultValue={new Date('2022-02-02')}
          />
          <Form.Error name='date' />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    )
    const dateInput = screen.getByLabelText(/select date/i)
    expect(dateInput).toHaveValue('02/01/2022')
  })
})
