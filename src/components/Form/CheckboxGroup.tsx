import { ReactNode } from 'react'
import { FieldValues, FieldPath } from 'react-hook-form'

import { useFormContext } from './Context'

interface CheckboxOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

interface CheckboxGroupProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  options: CheckboxOption[]
  className?: string
  legend?: ReactNode
  orientation?: 'vertical' | 'horizontal'
  showError?: boolean
}

export const CheckboxGroup = <TFieldValues extends FieldValues>({
  name,
  options,
  className = '',
  legend,
  orientation = 'vertical',
}: CheckboxGroupProps<TFieldValues>) => {
  const { formId, form } = useFormContext<TFieldValues>()
  const error = form.formState.errors[name]
  const errorMessage = typeof error?.message === 'string' ? error.message : undefined
  const errorId = errorMessage ? `${formId}-${name}-error` : undefined

  return (
    <fieldset className={className}>
      {legend && <legend className='block text-sm font-medium text-gray-700 mb-2'>{legend}</legend>}

      <div
        className={`space-y-3 ${orientation === 'horizontal' ? 'sm:flex sm:space-x-4 sm:space-y-0' : ''}`}
        role='group'
        aria-invalid={!!errorMessage}
        aria-describedby={errorId}
      >
        {options.map((option) => {
          const checkboxId = `${formId}-${name}-${option.value}`

          return (
            <div
              key={option.value}
              className='flex items-start'
            >
              <div className='flex items-center h-5'>
                <input
                  id={checkboxId}
                  type='checkbox'
                  value={option.value}
                  disabled={option.disabled}
                  {...form.register(name)}
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded
                      ${errorMessage ? 'border-red-500' : ''}
                      ${option.disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className='ml-3 text-sm'>
                <label
                  htmlFor={checkboxId}
                  className={`font-medium text-gray-700 ${option.disabled ? 'text-gray-400' : ''}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
