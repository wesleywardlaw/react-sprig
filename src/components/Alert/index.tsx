import React from 'react'
import { AlertTriangle, CheckCircle, Info, AlertCircle, X } from 'lucide-react'

const ALERT_VARIANTS = ['default', 'success', 'warning', 'error', 'info'] as const
export type AlertVariant = (typeof ALERT_VARIANTS)[number]

const alertVariants: Record<AlertVariant, string> = {
  default: 'bg-gray-50 border-gray-200 text-gray-900',
  success: 'bg-success-50 border-success-200 text-success-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-danger-50 border-danger-200 text-danger-900',
  info: 'bg-primary-50 border-primary-200 text-primary-900',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const alertIcons: Record<AlertVariant, React.ComponentType<any>> = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  className?: string
  children: React.ReactNode
  onClose?: () => void
  showIcon?: boolean
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  onClose,
  showIcon = true,
  ...props
}) => {
  if (!ALERT_VARIANTS.includes(variant)) {
    console.warn(`Invalid alert variant: ${variant}. Using 'default' instead.`)
    variant = 'default'
  }

  const Icon = alertIcons[variant]

  return (
    <div
      className={`relative flex items-start gap-4 p-4 border rounded-lg ${alertVariants[variant]} ${className}`}
      role='alert'
      {...props}
    >
      {showIcon && <Icon className='w-5 h-5 mt-0.5 shrink-0' />}
      <div className='flex-1 min-w-0 pt-0.5'>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className='shrink-0 p-1 rounded-md hover:bg-black hover:bg-black/10 transition-colors'
          aria-label='Close alert'
          type='button'
        >
          <X className='w-4 h-4' />
        </button>
      )}
    </div>
  )
}

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children: React.ReactNode
  as?: HeadingLevel
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
  className = '',
  children,
  as: Component = 'h4',
  ...props
}) => {
  if (!children) {
    console.warn('AlertTitle: children prop is required')
    return null
  }

  return (
    <Component
      className={`font-semibold text-sm mb-1 ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className = '',
  children,
  ...props
}) => {
  if (!children) {
    console.warn('AlertDescription: children prop is required')
    return null
  }

  return (
    <div
      className={`text-sm opacity-90 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
