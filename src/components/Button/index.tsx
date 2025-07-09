import React, { ReactNode, ButtonHTMLAttributes, useRef } from 'react'
import { FaSpinner } from 'react-icons/fa'

type ButtonSize = 'small' | 'medium' | 'large' | string
type ButtonColor = 'primary' | 'danger' | 'success' | 'secondary' | 'outline-solid' | string
type IconPosition = 'before' | 'after'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: ButtonSize
  color?: ButtonColor
  loading?: boolean
  className?: string
  icon?: ReactNode
  iconPosition?: IconPosition
  ariaLabel?: string
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'medium',
  type = 'button',
  color = 'primary',
  loading = false,
  onClick,
  className = '',
  disabled = false,
  icon = null,
  iconPosition = 'before',
  ariaLabel,
  fullWidth = false,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const sizeClasses: Record<string, string> = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  const colorClasses: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-300',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-300',
    success: 'bg-green-600 text-white hover:bg-green-500 focus:ring-green-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-300',
    outline: 'border border-gray-500 text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  }

  const loadingSpinner = <FaSpinner className='animate-spin h-5 w-5 mr-2' />

  const buttonClasses = `
    relative inline-flex items-center justify-center font-semibold rounded-md transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizeClasses[size] || ''} ${colorClasses[color] || ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const iconContent =
    icon && !loading ? (
      iconPosition === 'before' ? (
        <span
          data-testid='icon'
          className='mr-2'
        >
          {icon}
        </span>
      ) : (
        <span
          data-testid='icon'
          className='ml-2'
        >
          {icon}
        </span>
      )
    ) : null

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      onClick={(e) => {
        if (onClick) onClick(e)
      }}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && loadingSpinner}
      {iconPosition === 'before' && iconContent}
      {children}
      {iconPosition === 'after' && iconContent}
    </button>
  )
}
