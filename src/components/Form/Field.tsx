import { ReactNode } from 'react'

export interface FieldProps {
  children: ReactNode
  name: string
  className?: string
}

export const Field = ({ children, name, className = '' }: FieldProps) => (
  <div
    className={`space-y-1 mb-2 ${className}`}
    data-field-name={name}
  >
    {children}
  </div>
)
