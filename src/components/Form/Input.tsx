import { FieldPath, FieldValues } from 'react-hook-form'
import { useEffect } from 'react'

import { useFormContext } from './Context'

export interface InputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  type?: string
  placeholder?: string
  className?: string
  id?: string
  disabled?: boolean
}

export const Input = <TFieldValues extends FieldValues>({
  name,
  type = 'text',
  placeholder,
  className = '',
  id,
  disabled = false,
}: InputProps<TFieldValues>) => {
  const { formId, form } = useFormContext<TFieldValues>()
  const inputId = id || `${formId}-${name}`

  useEffect(() => {
    if (disabled) {
      form.unregister(name)
      console.log(`Unregistered input: ${name}`)
    } else {
      form.register(name)
      console.log(`Registered input: ${name}`)
    }
    // Only run when disabled or name changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, name])

  return (
    <>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        {...form.register(name)}
        disabled={disabled}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed ${className}`}
      />
    </>
  )
}
