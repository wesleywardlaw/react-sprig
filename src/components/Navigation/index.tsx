import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

interface NavItem {
  label: string
  href?: string
  onClick?: () => void
  children?: NavItem[]
}

interface NavigationProps {
  items: NavItem[]
  brand?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

interface DropdownProps {
  item: NavItem
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  isMobile?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({
  item,
  isOpen,
  onToggle,
  onClose,
  isMobile = false,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen || isMobile) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 10)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose, isMobile])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
      buttonRef.current?.focus()
    }
  }

  const handleItemClick = (childItem: NavItem) => {
    if (childItem.onClick) {
      childItem.onClick()
    }
    onClose()
  }

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onToggle()
  }

  if (!item.children) return null

  return (
    <div
      className='relative'
      ref={dropdownRef}
    >
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isMobile ? 'w-full justify-between text-left' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup='true'
        aria-label={`${item.label} menu`}
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden='true'
        />
      </button>

      {isOpen && (
        <div
          className={`${
            isMobile
              ? 'mt-2 ml-4 space-y-1'
              : 'absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50'
          }`}
          role='menu'
          aria-orientation='vertical'
          onKeyDown={handleKeyDown}
        >
          {item.children.map((child, index) => (
            <div
              key={index}
              role='none'
            >
              {child.href ? (
                <a
                  href={child.href}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isMobile ? 'rounded-md' : 'first:rounded-t-md last:rounded-b-md'
                  }`}
                  role='menuitem'
                  onClick={() => handleItemClick(child)}
                >
                  {child.label}
                </a>
              ) : (
                <button
                  onClick={() => handleItemClick(child)}
                  className={`w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isMobile ? 'rounded-md' : 'first:rounded-t-md last:rounded-b-md'
                  }`}
                  role='menuitem'
                >
                  {child.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const Navigation: React.FC<NavigationProps> = ({ items, brand, className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set())

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      setOpenDropdowns(new Set())
    }
  }

  const toggleDropdown = (index: number) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set<number>()
      if (prev.has(index)) {
        return newSet
      }
      newSet.add(index)
      return newSet
    })
  }

  const closeDropdown = (index: number) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const closeAllDropdowns = () => {
    setOpenDropdowns(new Set())
  }

  const handleItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick()
    }
    setIsMobileMenuOpen(false)
    closeAllDropdowns()
  }

  return (
    <nav
      className={`bg-white border-b border-gray-200 ${className}`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {brand && (
            <div className='flex-shrink-0'>
              {brand.href ? (
                <a
                  href={brand.href}
                  className='text-xl font-bold text-gray-900 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 py-1'
                  onClick={brand.onClick}
                >
                  {brand.label}
                </a>
              ) : (
                <button
                  onClick={brand.onClick}
                  className='text-xl font-bold text-gray-900 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 py-1'
                >
                  {brand.label}
                </button>
              )}
            </div>
          )}

          <div className='hidden md:flex ml-10 items-center flex-grow justify-evenly'>
            {items.map((item, index) => (
              <div
                key={index}
                className='flex-1 text-center'
              >
                {item.children ? (
                  <Dropdown
                    item={item}
                    isOpen={openDropdowns.has(index)}
                    onToggle={() => toggleDropdown(index)}
                    onClose={() => closeDropdown(index)}
                  />
                ) : item.href ? (
                  <a
                    href={item.href}
                    className='px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                    onClick={() => handleItemClick(item)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={() => handleItemClick(item)}
                    className='px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className='md:hidden ml-auto'>
            <button
              onClick={toggleMobileMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              aria-expanded={isMobileMenuOpen}
              aria-label='Toggle navigation menu'
            >
              {isMobileMenuOpen ? (
                <X
                  className='w-6 h-6'
                  aria-hidden='true'
                />
              ) : (
                <Menu
                  className='w-6 h-6'
                  aria-hidden='true'
                />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 mt-4'>
              {items.map((item, index) => (
                <div key={index}>
                  {item.children ? (
                    <Dropdown
                      item={item}
                      isOpen={openDropdowns.has(index)}
                      onToggle={() => toggleDropdown(index)}
                      onClose={() => closeDropdown(index)}
                      isMobile={true}
                    />
                  ) : item.href ? (
                    <a
                      href={item.href}
                      className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                      onClick={() => handleItemClick(item)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleItemClick(item)}
                      className='w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
