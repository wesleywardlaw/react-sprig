import { FieldPath, FieldValues } from 'react-hook-form'
import { useFormContext, useRadioGroupContext } from './Context'

// === RADIO COMPONENT ===
export interface RadioProps<TFieldValues extends FieldValues> {
  value: string
  name?: FieldPath<TFieldValues> // Optional now, as it can come from context
  disabled?: boolean
  className?: string
  id?: string // Explicitly accepting an ID prop
}

export const Radio = <TFieldValues extends FieldValues>({
  name: propName,
  value,
  disabled: propDisabled,
  className = '',
  id: externalId,
}: RadioProps<TFieldValues>) => {
  const { form, formId } = useFormContext<TFieldValues>()

  // Initialize with prop values
  let name: FieldPath<TFieldValues>
  let disabled = propDisabled || false

  try {
    // Try to get context values
    const context = useRadioGroupContext<TFieldValues>()

    // Use prop values if provided, otherwise use context values
    name = propName !== undefined ? propName : context.name
    disabled = propDisabled !== undefined ? propDisabled : context.disabled
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Not within a RadioGroup, must use directly provided props
    if (!propName) {
      throw new Error('Radio component must have a name prop when used outside of RadioGroup')
    }
    name = propName
  }

  // Generate ID from external ID or combine name-value
  const inputId = formId ? `${formId}-${name}-${value}` : externalId
  const { register } = form
  const isError = !!form.formState.errors[name]

  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={inputId}
        type='radio'
        disabled={disabled}
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${
          isError ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(name)}
        value={value}
      />
    </div>
  )
}
