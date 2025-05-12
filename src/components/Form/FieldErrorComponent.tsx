import { FieldPath, FieldValues } from 'react-hook-form'
import { useFormContext } from './Context'

interface ErrorProps<TFieldValues extends FieldValues> {
  name?: FieldPath<TFieldValues> | string
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderErrorMessage(error: any): string[] {
  if (!error) return []
  if (typeof error === 'string') return [error]
  if (error.message) return [error.message]
  if (typeof error === 'object') {
    return Object.values(error).flatMap(renderErrorMessage)
  }
  return []
}

export const FieldErrorComponent = <TFieldValues extends FieldValues>({
  name,
  className = '',
}: ErrorProps<TFieldValues>) => {
  const { form } = useFormContext<TFieldValues>()
  const fieldError = name ? form.formState.errors[name] : form.formState.errors
  const messages = renderErrorMessage(fieldError)

  if (messages.length === 0) return null

  return (
    <div className={`text-sm text-red-500 mt-1 space-y-1 ${className}`}>
      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  )
}
