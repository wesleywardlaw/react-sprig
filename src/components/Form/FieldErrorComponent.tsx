import { FieldError, FieldPath, FieldValues } from 'react-hook-form'

import { useFormContext } from './Context'

interface ErrorProps<TFieldValues extends FieldValues> {
  name?: FieldPath<TFieldValues>
  className?: string
}

export const FieldErrorComponent = <TFieldValues extends FieldValues>({
  name,
  className = '',
}: ErrorProps<TFieldValues>) => {
  const { form } = useFormContext<TFieldValues>()
  const error = name ? (form.formState.errors[name] as FieldError | undefined) : undefined

  if (!error) return null

  return <p className={`text-sm text-red-500 mt-1 ${className}`}>{error.message}</p>
}
