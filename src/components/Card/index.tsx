import React from 'react'

interface CardProps {
  children: React.ReactNode
  padding?: string
  rounded?: string
  shadow?: string
  border?: string
  bgColor?: string
  width?: string
  hover?: string
  transition?: string
  className?: string
}

interface CardSectionProps {
  children: React.ReactNode
  className?: string
}

interface CardImageProps {
  src: string
  alt: string
  className?: string
}

export const Card = ({
  children,
  padding = 'p-6',
  rounded = 'rounded-lg',
  shadow = 'shadow-md',
  border = 'border border-gray-200',
  bgColor = 'bg-white',
  width = 'max-w-md w-full mx-auto',
  hover = 'hover:shadow-lg',
  transition = 'transition-all duration-300',
  className = '',
}: CardProps) => {
  return (
    <div
      className={`${padding} ${rounded} ${shadow} ${border} ${bgColor} ${width} ${hover} ${transition} ${className}`}
    >
      {children}
    </div>
  )
}

Card.Title = ({ children, className = '' }: CardSectionProps) => (
  <h3 className={`text-xl font-bold mb-2 ${className}`}>{children}</h3>
)

Card.Content = ({ children, className = '' }: CardSectionProps) => (
  <div className={`${className}`}>{children}</div>
)

Card.Footer = ({ children, className = '' }: CardSectionProps) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>{children}</div>
)

Card.Actions = ({ children, className = '' }: CardSectionProps) => (
  <div className={`flex items-center gap-2 mt-4 ${className}`}>{children}</div>
)

Card.Image = ({ src, alt, className = '' }: CardImageProps) => (
  <div className={`-mx-6 -mt-6`}>
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto ${className}`}
    />
  </div>
)
