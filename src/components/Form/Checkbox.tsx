import { ReactNode } from 'react'
import { FieldValues, FieldPath } from 'react-hook-form'
import { useFormContext } from './Context'

export interface CheckboxProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  label: ReactNode
  className?: string
  id?: string
  disabled?: boolean
}

export const Checkbox = <TFieldValues extends FieldValues>({
  name,
  label,
  className = '',
  id,
  disabled = false,
}: CheckboxProps<TFieldValues>) => {
  const { formId, form } = useFormContext<TFieldValues>()
  const checkboxId = formId ? `${formId}-${name}` : id
  const error = form.formState.errors[name]
  const errorMessage = typeof error?.message === 'string' ? error.message : undefined
  const errorId = errorMessage ? `${checkboxId}-error` : undefined

  return (
    <div className='flex items-start'>
      <div className='flex items-center h-5'>
        <input
          id={checkboxId}
          type='checkbox'
          {...form.register(name)}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={errorId}
          className={`h-4 w-4 text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset border-gray-300 rounded ${
            errorMessage ? 'border-red-500' : ''
          } ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''} ${className}`}
        />
      </div>
      <div className='ml-3 text-sm'>
        <label
          htmlFor={checkboxId}
          className={`font-medium text-gray-700 ${disabled ? 'text-gray-400' : ''}`}
        >
          {label}
        </label>
      </div>
    </div>
  )
}
