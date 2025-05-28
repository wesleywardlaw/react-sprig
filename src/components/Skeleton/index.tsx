import React from 'react'

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rectangular' | 'circular'
  lines?: number
  className?: string
  'aria-label'?: string
  loading?: boolean
  children?: React.ReactNode
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  lines = 1,
  className = '',
  'aria-label': ariaLabel,
  loading = true,
  children,
}) => {
  if (!loading && children) {
    return <>{children}</>
  }

  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#e2e8f0',
      borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? '0.25rem' : '0.5rem',
      width: width || (variant === 'text' ? '100%' : variant === 'circular' ? '40px' : '200px'),
      height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '40px' : '120px'),
    }

    return baseStyles
  }

  const renderSkeleton = (key?: number) => (
    <div
      key={key}
      className={`animate-pulse ${className}`}
      style={getVariantStyles()}
      role='status'
      aria-label={ariaLabel || 'Loading content'}
      aria-live='polite'
    >
      <span className='sr-only'>Loading...</span>
    </div>
  )

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: lines }, (_, index) => {
          const isLastLine = index === lines - 1
          const lineWidth = isLastLine && !width ? '75%' : width

          return (
            <div
              key={index}
              className={`animate-pulse ${className}`}
              style={{ ...getVariantStyles(), width: lineWidth }}
              role='status'
              aria-label={ariaLabel || `Loading line ${index + 1} of ${lines}`}
              aria-live='polite'
            >
              <span className='sr-only'>Loading...</span>
            </div>
          )
        })}
      </div>
    )
  }

  return renderSkeleton()
}
