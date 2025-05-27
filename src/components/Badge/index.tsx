import React from 'react'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  ariaLabel?: string
  role?: 'status' | 'img' | 'presentation'
  removable?: boolean
  onRemove?: () => void
  disabled?: boolean
  id?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-purple-100 text-purple-800 border-purple-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ariaLabel,
  role = 'status',
  removable = false,
  onRemove,
  disabled = false,
  id,
}) => {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

  const badgeClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabledStyles}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && onRemove) {
      onRemove()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (removable && !disabled && onRemove && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault()
      onRemove()
    }
  }

  return (
    <span
      id={id}
      className={badgeClasses}
      role={role}
      aria-label={ariaLabel}
      tabIndex={removable && !disabled ? 0 : undefined}
      onKeyDown={removable ? handleKeyDown : undefined}
    >
      <span className='truncate'>{children}</span>
      {removable && (
        <button
          type='button'
          className={`ml-1 inline-flex items-center justify-center w-4 h-4 text-current hover:bg-black hover:bg-opacity-10 rounded-full focus:outline-none focus:bg-black focus:bg-opacity-10 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={handleRemove}
          disabled={disabled}
          aria-label={`Remove ${typeof children === 'string' ? children : 'badge'}`}
          tabIndex={disabled ? -1 : 0}
        >
          <svg
            className='w-3 h-3'
            fill='currentColor'
            viewBox='0 0 20 20'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      )}
    </span>
  )
}
