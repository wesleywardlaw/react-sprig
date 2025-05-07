import { createContext, useContext } from 'react'
import { FieldValues, UseFormReturn, FieldPath } from 'react-hook-form'

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

interface RadioGroupContextType<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  disabled: boolean
}

export const RadioGroupContext = createContext<RadioGroupContextType<FieldValues> | null>(null)

// Hook to use the RadioGroup context
export function useRadioGroupContext<TFieldValues extends FieldValues>() {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('Radio component must be used within a RadioGroup')
  }
  return context as RadioGroupContextType<TFieldValues>
}
