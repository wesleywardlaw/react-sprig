'use client'

import React, { useId, ReactNode } from 'react'
import { useForm, SubmitHandler, FieldValues, FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormContext } from './Context'
import { Submit } from './Submit'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'
import { FieldErrorComponent } from './FieldErrorComponent'
import { Select } from './Select'
import { Input } from './Input'
import { Label } from './Label'
import { Field } from './Field'

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

Form.Field = Field

Form.Label = Label

Form.Input = Input

Form.Select = Select

Form.Checkbox = Checkbox

Form.CheckboxGroup = CheckboxGroup

Form.Error = FieldErrorComponent

Form.Submit = Submit
