import React, { ReactNode, ButtonHTMLAttributes, useState, useRef } from 'react'
import { FaSpinner } from 'react-icons/fa'

// Define button size options
type ButtonSize = 'small' | 'medium' | 'large' | string

// Define button color options
type ButtonColor = 'primary' | 'danger' | 'success' | 'secondary' | 'outline' | string

// Define icon position options
type IconPosition = 'before' | 'after'

// Define props interface extending button HTML attributes
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
  showRipple?: boolean
}

interface Ripple {
  x: number
  y: number
  size: number
  id: number
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
  showRipple = true,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]) // State to store the ripple elements
  const buttonRef = useRef<HTMLButtonElement | null>(null) // Reference to button

  // Size Classes
  const sizeClasses: Record<string, string> = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  // Color Classes with focus styles
  const colorClasses: Record<string, string> = {
    primary:
      'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:outline-none text-white',
    danger:
      'bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:outline-none text-white',
    success:
      'bg-green-500 hover:bg-green-600 focus:bg-green-600 focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:outline-none text-white',
    secondary:
      'bg-gray-500 hover:bg-gray-600 focus:bg-gray-600 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none text-white',
    outline:
      'border border-gray-500 text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none', // Outline style
  }

  // Loading spinner if required
  const loadingSpinner = <FaSpinner className='animate-spin h-5 w-5 mr-2' />

  // Function to handle the ripple effect on button click
  const handleRipple = (event: React.MouseEvent) => {
    if (!showRipple || buttonRef.current === null) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(button.offsetWidth, button.offsetHeight)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    setRipples((prev) => [
      ...prev,
      {
        x,
        y,
        size,
        id: Date.now(),
      },
    ])
  }

  // Combine all styles
  const buttonClasses = `
    inline-flex items-center justify-center font-semibold rounded-md transition-all
    ${sizeClasses[size] || size} ${colorClasses[color] || ''} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:ring focus-visible:ring'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  // Conditionally render icon based on position
  const iconContent =
    icon && !loading ? (
      iconPosition === 'before' ? (
        <span className='mr-2'>{icon}</span> // Icon first
      ) : (
        <span className='ml-2'>{icon}</span> // Icon last
      )
    ) : null

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      onClick={(e) => {
        handleRipple(e)
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

      {/* Ripple elements */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            transform: 'scale(0)',
            opacity: 0.6,
            animation: 'ripple 0.6s linear',
          }}
          className='absolute'
          aria-hidden='true'
        />
      ))}

      {/* Ripple animation */}
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}
