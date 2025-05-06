import { FieldPath, FieldValues } from 'react-hook-form'

import { useFormContext } from './Context'

interface InputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  type?: string
  placeholder?: string
  className?: string
  id?: string
}

export const Input = <TFieldValues extends FieldValues>({
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
