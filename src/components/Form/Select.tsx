import React from 'react'

import { FieldPath, FieldValues } from 'react-hook-form'

import { useFormContext } from './Context'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  options: SelectOption[]
  className?: string
  id?: string
  defaultValue?: string
  disabled?: boolean
}

export const Select = <TFieldValues extends FieldValues>({
  name,
  options,
  className = '',
  id,
  defaultValue,
  disabled = false,
}: SelectProps<TFieldValues> & { label?: string; labelId?: string }) => {
  const { formId, form } = useFormContext<TFieldValues>()
  const selectId = id || `${formId}-${name}`
  const error = form.formState.errors[name]
  const errorMessage = typeof error?.message === 'string' ? error.message : undefined
  const errorId = errorMessage ? `${selectId}-error` : undefined

  // Ensure default value is set correctly when provided
  React.useEffect(() => {
    if (defaultValue !== undefined) {
      form.setValue(name, defaultValue as NonNullable<TFieldValues[typeof name]>)
    }
  }, [defaultValue, form, name]) // Updates if defaultValue changes dynamically

  return (
    <div className='relative'>
      <select
        id={selectId}
        {...form.register(name)}
        disabled={disabled}
        aria-invalid={!!errorMessage}
        aria-describedby={errorId}
        aria-live='polite'
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
          errorMessage ? 'border-red-500' : ''
        } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} ${className}`}
      >
        <option value=''>{'Select an option'}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {errorMessage && (
        <p
          id={errorId}
          className='absolute text-sm text-red-500 mt-1'
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}
