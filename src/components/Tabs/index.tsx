import React, { useState, useRef } from 'react'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs?: TabItem[]
  defaultActiveTab?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Tabs({
  tabs = [],
  defaultActiveTab,
  variant = 'default',
  size = 'md',
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const tabCount = tabs.length
    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault()
        for (let i = 1; i < tabCount; i++) {
          const candidate = (index + i) % tabCount
          if (!tabs[candidate].disabled) {
            tabRefs.current[candidate]?.focus()
            setActiveTab(tabs[candidate].id)
            break
          }
        }
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        for (let i = 1; i < tabCount; i++) {
          const candidate = (index - i + tabCount) % tabCount
          if (!tabs[candidate].disabled) {
            tabRefs.current[candidate]?.focus()
            setActiveTab(tabs[candidate].id)
            break
          }
        }
        break
      }
      case 'Home': {
        event.preventDefault()
        const firstIndex = tabs.findIndex((tab) => !tab.disabled)
        if (firstIndex !== -1) {
          tabRefs.current[firstIndex]?.focus()
          setActiveTab(tabs[firstIndex].id)
        }
        break
      }
      case 'End': {
        event.preventDefault()
        const lastIndex = [...tabs]
          .map((tab, i) => ({ tab, i }))
          .reverse()
          .find(({ tab }) => !tab.disabled)?.i
        if (typeof lastIndex === 'number') {
          tabRefs.current[lastIndex]?.focus()
          setActiveTab(tabs[lastIndex].id)
        }
        break
      }
    }
  }

  const getTabStyles = () => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all duration-200 m-1 mb-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeStyles = {
      sm: 'px-10 py-1.5 text-sm',
      md: 'px-10 py-2 text-sm',
      lg: 'px-7 py-3 text-base',
    }

    const variantStyles = {
      default:
        'border  hover:border-gray-300 data-[active=true]:text-black data-[active=true]:border-black rounded-t-lg',
      pills:
        'rounded-full hover:bg-gray-100 data-[active=true]:bg-blue-500 data-[active=true]:text-white',
      underline:
        'border-b-2 border-transparent hover:border-gray-300 data-[active=true]:border-blue-500 data-[active=true]:text-blue-600 rounded-t-lg',
    }

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`
  }

  const getTabListStyles = () => {
    const baseStyles = 'flex'

    const variantStyles = {
      default: 'border-b border-gray-200',
      pills: 'bg-gray-100 rounded-full p-1 gap-1',
      underline: 'border-b border-gray-200 gap-1',
    }

    return `${baseStyles} ${variantStyles[variant]}`
  }

  if (!tabs || tabs.length === 0) {
    return <div className='text-gray-500'>No tabs available</div>
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        role='tablist'
        className={getTabListStyles()}
        aria-label='Content tabs'
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            role='tab'
            tabIndex={activeTab === tab.id ? 0 : -1}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            data-active={activeTab === tab.id}
            disabled={tab.disabled}
            className={getTabStyles()}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='mt-4'>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role='tabpanel'
            tabIndex={0}
            aria-labelledby={`tab-${tab.id}`}
            className={`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg ${
              activeTab === tab.id ? 'block' : 'hidden'
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}
