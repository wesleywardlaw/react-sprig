'use client'

import React, { createContext, useContext, useId, ReactNode } from 'react'
import {
  useForm,
  SubmitHandler,
  FieldValues,
  UseFormReturn,
  FieldError,
  FieldPath,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// === CONTEXT ===

type FormContextValue<TFieldValues extends FieldValues> = {
  formId: string
  form: UseFormReturn<TFieldValues>
  isSubmitting: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = createContext<FormContextValue<any> | null>(null)

const useFormContext = <TFieldValues extends FieldValues>(): FormContextValue<TFieldValues> => {
  const context = useContext(FormContext)
  if (context === null) {
    const error = new Error('useFormContext must be used within a Form component') as Error & {
      name: string
    }
    error.name = 'FormContextError'
    throw error
  }
  return context as FormContextValue<TFieldValues>
}

// === ROOT COMPONENT ===

interface FormProps<TFieldValues extends FieldValues> {
  children: ReactNode
  schema: z.ZodType<TFieldValues>
  onSubmit: (_data: TFieldValues) => Promise<{
    errors?: Partial<Record<keyof TFieldValues | 'root', string[]>>
    success?: boolean
  }>
  className?: string
  id?: string
}

export const Form = <TFieldValues extends FieldValues>({
  children,
  schema,
  onSubmit,
  className = '',
  id: externalId,
}: FormProps<TFieldValues>) => {
  const internalId = useId()
  const formId = externalId || internalId
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const handleFormSubmit: SubmitHandler<TFieldValues> = async (data) => {
    setIsSubmitting(true)
    try {
      const result = await onSubmit(data)

      if (result?.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          const message = messages?.[0] || 'An unexpected error occurred.'

          // Handle root error separately
          if (field === 'root') {
            form.setError('root', {
              type: 'manual',
              message,
            })
          } else {
            form.setError(field as FieldPath<TFieldValues>, {
              type: 'manual',
              message,
            })
          }
        })
      } else if (result?.success) {
        form.reset()
        setSuccessMessage('Submission successful!')
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <FormContext.Provider value={{ formId, form: form as any, isSubmitting }}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className={className}
      >
        {successMessage && (
          <div className='p-4 mb-4 text-sm text-green-800 bg-green-50 rounded-lg'>
            {successMessage}
          </div>
        )}

        {form.formState.errors.root && (
          <div className='p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg'>
            {form.formState.errors.root.message as string}
          </div>
        )}

        {children}
      </form>
    </FormContext.Provider>
  )
}

// === FIELD COMPONENT ===

interface FieldProps {
  children: ReactNode
  name: string
  className?: string
}

const Field = ({ children, name, className = '' }: FieldProps) => (
  <div
    className={`space-y-1 ${className}`}
    data-field-name={name}
  >
    {children}
  </div>
)

Form.Field = Field

// === LABEL COMPONENT ===

interface LabelProps {
  children: ReactNode
  htmlFor?: string
  className?: string
}

const Label = ({ children, htmlFor, className = '' }: LabelProps) => {
  const { formId } = useFormContext()
  const defaultHtmlFor = formId ? `${formId}-${htmlFor}` : htmlFor

  return (
    <label
      htmlFor={defaultHtmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  )
}

Form.Label = Label

// === INPUT COMPONENT ===

interface InputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  type?: string
  placeholder?: string
  className?: string
  id?: string
}

const Input = <TFieldValues extends FieldValues>({
  name,
  type = 'text',
  placeholder,
  className = '',
  id,
}: InputProps<TFieldValues>) => {
  const { formId, form } = useFormContext<TFieldValues>()
  const inputId = id || `${formId}-${name}`

  return (
    <input
      id={inputId}
      type={type}
      placeholder={placeholder}
      {...form.register(name)}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
    />
  )
}

Form.Input = Input

// === ERROR COMPONENT ===

interface ErrorProps<TFieldValues extends FieldValues> {
  name?: FieldPath<TFieldValues>
  className?: string
}

const FieldErrorComponent = <TFieldValues extends FieldValues>({
  name,
  className = '',
}: ErrorProps<TFieldValues>) => {
  const { form } = useFormContext<TFieldValues>()
  const error = name ? (form.formState.errors[name] as FieldError | undefined) : undefined

  if (!error) return null

  return <p className={`text-sm text-red-500 mt-1 ${className}`}>{error.message}</p>
}

Form.Error = FieldErrorComponent

// === SUBMIT BUTTON COMPONENT ===

interface SubmitProps {
  children: ReactNode
  className?: string
}

const Submit = ({ children, className = '' }: SubmitProps) => {
  const { form, isSubmitting } = useFormContext<FieldValues>()

  return (
    <button
      type='submit'
      disabled={!form.formState.isValid || isSubmitting}
      className={`disabled:opacity-50 disabled:cursor-not-allowed inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      {isSubmitting ? (
        <svg
          className='animate-spin h-5 w-5 text-white'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}

Form.Submit = Submit
