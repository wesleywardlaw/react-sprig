import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { z } from 'zod'
import { Form } from './index'

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
