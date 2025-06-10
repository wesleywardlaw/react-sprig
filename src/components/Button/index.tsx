import React, { ReactNode, ButtonHTMLAttributes, useRef } from 'react'
import { FaSpinner } from 'react-icons/fa'
import './Button.css'

type ButtonSize = 'small' | 'medium' | 'large' | string
type ButtonColor = 'primary' | 'danger' | 'success' | 'secondary' | 'outline' | string
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
    small: 'btn-small',
    medium: 'btn-medium',
    large: 'btn-large',
  }

  const colorClasses: Record<string, string> = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    success: 'btn-success',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  }

  const loadingSpinner = <FaSpinner className='animate-spin h-5 w-5 mr-2' />

  const buttonClasses = `
    relative inline-flex items-center justify-center font-semibold rounded-md transition-all
    ${sizeClasses[size] || ''} ${colorClasses[color] || ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

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
