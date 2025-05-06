import { ReactNode } from 'react'

import { useFormContext } from './Context'

interface LabelProps {
  children: ReactNode
  htmlFor?: string
  className?: string
}

export const Label = ({ children, htmlFor, className = '' }: LabelProps) => {
  const { formId } = useFormContext()
  const defaultHtmlFor = formId ? `${formId}-${htmlFor}` : htmlFor

  return (
    <label
      htmlFor={defaultHtmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  )
}
