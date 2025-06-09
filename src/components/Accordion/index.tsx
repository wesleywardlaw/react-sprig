import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface AccordionItemProps {
  title: string
  children: ReactNode
  isOpen?: boolean
  onToggle?: () => void
  id: string
  disabled?: boolean
  className?: string
  headingLevel?: HeadingLevel
  buttonClassName?: string
  iconClassName?: string
}

export interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[]
  allowMultiple?: boolean
  defaultOpenItems?: string[]
  className?: string
  headingLevel?: HeadingLevel
  buttonClassName?: string
  iconClassName?: string
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  onToggle,
  id,
  disabled = false,
  className = '',
  headingLevel = 3,
  buttonClassName = '',
  iconClassName = '',
}) => {
  const contentId = `accordion-content-${id}`
  const headerId = `accordion-header-${id}`

  const HeadingTag: React.ElementType = `h${headingLevel}`

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <HeadingTag>
        <button
          id={headerId}
          className={twMerge(
            `
            flex justify-between items-center w-full px-4 py-3 text-left
            bg-gray-50 hover:bg-gray-100 focus:bg-gray-100
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset
            transition-all duration-200 rounded-lg
            ${disabled ? 'opacity-50 cursor-not-allowed focus-visible:ring-gray-400' : 'cursor-pointer'}
            ${isOpen ? 'rounded-b-none' : ''}
          `,
            buttonClassName
          )}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
          disabled={disabled}
          type='button'
        >
          <span className='font-medium text-gray-900'>{title}</span>
          <ChevronDown
            className={twMerge(
              `
              w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out
              ${isOpen ? 'rotate-180' : 'rotate-0'}
            `,
              iconClassName
            )}
            aria-hidden='true'
          />
        </button>
      </HeadingTag>

      <div
        data-testid={contentId}
        id={contentId}
        role='region'
        aria-labelledby={headerId}
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className='px-4 py-3 border-t border-gray-200 bg-white'>{children}</div>
      </div>
    </div>
  )
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  className = '',
  headingLevel = 3,
  buttonClassName = '',
  iconClassName = '',
}) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpenItems))

  const toggleItem = (itemId: string): void => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)

      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(itemId)
      }

      return newSet
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {children.map((child, index) => {
        const itemId = child.props.id || `item-${index}`
        return (
          <AccordionItem
            key={itemId}
            {...child.props}
            id={itemId}
            isOpen={openItems.has(itemId)}
            onToggle={() => toggleItem(itemId)}
            headingLevel={headingLevel}
            buttonClassName={child.props.buttonClassName || buttonClassName}
            iconClassName={child.props.iconClassName || iconClassName}
          />
        )
      })}
    </div>
  )
}
