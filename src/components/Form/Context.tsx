import { createContext, useContext } from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

type FormContextValue<TFieldValues extends FieldValues> = {
  formId: string
  form: UseFormReturn<TFieldValues>
  isSubmitting: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = createContext<FormContextValue<any> | null>(null)

export const useFormContext = <
  TFieldValues extends FieldValues,
>(): FormContextValue<TFieldValues> => {
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
