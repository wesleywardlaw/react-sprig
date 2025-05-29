import React, { useState, useRef, useLayoutEffect } from 'react'
import { twMerge } from 'tailwind-merge'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  children: React.ReactNode
  content: string
  position?: TooltipPosition
  delay?: number
  className?: string
  id?: string
  color?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
  id,
  color,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipId = id || `tooltip-${Math.random().toString(36).substr(2, 9)}`
  const [tooltipStyles, setTooltipStyles] = useState<React.CSSProperties>({})

  const showTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId)
    const timeout = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(timeout)
  }

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsVisible(false)
  }

  useLayoutEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const styles: React.CSSProperties = {}

      switch (position) {
        case 'top':
          styles.top = `${triggerRect.top - tooltipRect.height - 8}px`
          styles.left = `${triggerRect.left + (triggerRect.width - tooltipRect.width) / 2}px`
          break
        case 'bottom':
          styles.top = `${triggerRect.bottom + 8}px`
          styles.left = `${triggerRect.left + (triggerRect.width - tooltipRect.width) / 2}px`
          break
        case 'left':
          styles.top = `${triggerRect.top + (triggerRect.height - tooltipRect.height) / 2}px`
          styles.left = `${triggerRect.left - tooltipRect.width - 16}px`
          break
        case 'right':
          styles.top = `${triggerRect.top + (triggerRect.height - tooltipRect.height) / 2}px`
          styles.left = `${triggerRect.right + 16}px`
          break
      }

      setTooltipStyles(styles)
    }
  }, [isVisible, position])

  const tooltipBg = color || 'bg-gray-800'
  const arrowColor = color || '#1f2937'

  return (
    <div className='relative inline-block'>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-describedby={isVisible ? tooltipId : undefined}
        className='cursor-help'
      >
        {children}
      </div>

      {isVisible && (
        <div
          id={tooltipId}
          role='tooltip'
          ref={tooltipRef}
          className={twMerge(`
            absolute z-50 px-3 py-2 text-sm font-medium text-white
            rounded-lg shadow-lg whitespace-nowrap max-w-xs
            ${typeof color === 'string' && color.startsWith('#') ? '' : tooltipBg}
            ${className}
          `)}
          style={{
            ...tooltipStyles,
            animation: 'fadeIn 0.15s ease-out',
            position: 'fixed',
            background: typeof color === 'string' && color.startsWith('#') ? color : undefined,
          }}
        >
          {content}
          <span
            className={twMerge('tooltip-arrow', `tooltip-arrow-${position}`)}
            aria-hidden='true'
            style={{ borderColor: `${arrowColor} transparent transparent transparent` }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .tooltip-arrow {
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
        }
        .tooltip-arrow-top {
          left: 50%;
          bottom: -8px;
          transform: translateX(-50%);
          border-width: 8px 8px 0 8px;
        }
        .tooltip-arrow-bottom {
          left: 50%;
          top: -8px;
          transform: translateX(-50%) rotate(180deg);
          border-width: 8px 8px 0 8px;
        }
        .tooltip-arrow-left {
          top: 50%;
          right: -12px;
          transform: translateY(-50%) rotate(-90deg);
          border-width: 8px 8px 0 8px;
        }
        .tooltip-arrow-right {
          top: 50%;
          left: -12px;
          transform: translateY(-50%) rotate(90deg);
          border-width: 8px 8px 0 8px;
        }
      `}</style>
    </div>
  )
}
