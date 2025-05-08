'use client'

import React from 'react'

import { useFormContext } from './Context'

interface TextAreaProps {
  name: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  maxLength?: number
  className?: string
  description?: string
  autoComplete?: string
  id?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea = ({
  name,
  placeholder,
  defaultValue = '',
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
  description,
  autoComplete,
  onChange,
  id: externalId,
}: TextAreaProps) => {
  const { formId, form } = useFormContext()
  const textAreaId = formId ? `${formId}-${name}` : externalId
  const descriptionId = description ? `${textAreaId}-description` : undefined
  const error = form.formState.errors[name]

  return (
    <textarea
      id={textAreaId}
      {...form.register(name, { onChange })}
      rows={rows}
      className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:outline-none ${
        error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      } disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-y ${className}`}
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={disabled}
      maxLength={maxLength}
      aria-invalid={!!error}
      aria-describedby={descriptionId}
      autoComplete={autoComplete}
      aria-required={required}
    />
  )
}
