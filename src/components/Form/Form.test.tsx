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
})
