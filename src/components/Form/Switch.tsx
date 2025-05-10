import { FieldPath, FieldValues } from 'react-hook-form'

import { useFormContext } from './Context'

interface SwitchProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  disabled?: boolean
  className?: string
  switchClassName?: string
  thumbClassName?: string
  onColor?: string
  offColor?: string
  id?: string
}

export const Switch = <TFieldValues extends FieldValues>({
  name,
  disabled = false,
  className = '',
  switchClassName = '',
  thumbClassName = '',
  onColor = 'bg-blue-600',
  offColor = 'bg-gray-200',
  id: externalId,
}: SwitchProps<TFieldValues>) => {
  const { form, formId } = useFormContext<TFieldValues>()
  const id = formId ? `${formId}-${name}` : externalId

  const { register, watch, setValue } = form
  const isChecked = Boolean(watch(name))

  return (
    <div className={`relative inline-block ${className}`}>
      <input
        type='checkbox'
        id={id}
        className='sr-only'
        disabled={disabled}
        {...register(name)}
      />
      <div
        className={`
          ${isChecked ? onColor : offColor}
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out 
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${switchClassName}
        `}
        onClick={() => {
          if (!disabled) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setValue(name, !isChecked as any, { shouldValidate: true, shouldDirty: true })
          }
        }}
        role='switch'
        aria-checked={isChecked}
      >
        <span
          className={`
            ${isChecked ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow 
            ring-0 transition duration-200 ease-in-out
            ${thumbClassName}
          `}
        />
      </div>
    </div>
  )
}
