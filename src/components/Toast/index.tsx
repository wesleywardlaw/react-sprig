import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface Toast {
  id: string
  message: string
  type?: ToastType
  duration?: number
  action?: ToastAction
  position?: ToastPosition
}

interface ToastState {
  toasts: Toast[]
  position: ToastPosition
}

type ToastReducerAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_POSITION'; payload: ToastPosition }

const ToastContext = createContext<{
  state: ToastState
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  setPosition: (position: ToastPosition) => void
} | null>(null)

const toastReducer = (state: ToastState, action: ToastReducerAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      }
    case 'SET_POSITION':
      return {
        ...state,
        position: action.payload,
      }
    default:
      return state
  }
}

export const ToastProvider: React.FC<{
  children: React.ReactNode
  defaultPosition?: ToastPosition
}> = ({ children, defaultPosition = 'top-right' }) => {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    position: defaultPosition,
  })

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 4000,
    }

    dispatch({ type: 'ADD_TOAST', payload: newToast })
  }, [])

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id })
  }, [])

  const setPosition = useCallback((position: ToastPosition) => {
    dispatch({ type: 'SET_POSITION', payload: position })
  }, [])

  return (
    <ToastContext.Provider value={{ state, addToast, removeToast, setPosition }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [toast.id, toast.duration, removeToast, toast.message])

  const handleClose = () => {
    removeToast(toast.id)
  }

  const getToastStyles = () => {
    const baseStyles =
      'flex items-center justify-between p-4 rounded-lg shadow-lg border max-w-sm w-full transform transition-all duration-300 ease-in-out'

    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`
      default:
        return `${baseStyles} bg-white border-gray-200 text-gray-800`
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg
            className='w-5 h-5 text-green-500 flex-shrink-0'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
        )
      case 'error':
        return (
          <svg
            className='w-5 h-5 text-red-500 flex-shrink-0'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
            />
          </svg>
        )
      case 'warning':
        return (
          <svg
            className='w-5 h-5 text-yellow-500 flex-shrink-0'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        )
      case 'info':
        return (
          <svg
            className='w-5 h-5 text-blue-500 flex-shrink-0'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
              clipRule='evenodd'
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={getToastStyles()}
      role='alert'
      aria-live='polite'
      aria-atomic='true'
    >
      <div className='flex items-center space-x-3 flex-1'>
        {getIcon()}
        <p className='text-sm font-medium flex-1'>{toast.message}</p>
      </div>

      <div className='flex items-center space-x-2 ml-4'>
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className='text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded'
          >
            {toast.action.label}
          </button>
        )}

        <button
          onClick={handleClose}
          className='text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded p-1'
          aria-label='Close notification'
        >
          <svg
            className='w-4 h-4'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

const ToastContainer: React.FC = () => {
  const { state } = useToast()

  const getPositionStyles = (position: ToastPosition): string => {
    const baseStyles = 'fixed z-50 flex flex-col space-y-2'

    switch (position) {
      case 'top-left':
        return `${baseStyles} top-4 left-4`
      case 'top-center':
        return `${baseStyles} top-4 left-1/2 transform -translate-x-1/2`
      case 'top-right':
        return `${baseStyles} top-4 right-4`
      case 'bottom-left':
        return `${baseStyles} bottom-4 left-4`
      case 'bottom-center':
        return `${baseStyles} bottom-4 left-1/2 transform -translate-x-1/2`
      case 'bottom-right':
        return `${baseStyles} bottom-4 right-4`
      default:
        return `${baseStyles} top-4 right-4`
    }
  }

  if (state.toasts.length === 0) return null

  return (
    <div className={getPositionStyles(state.position)}>
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className='pointer-events-auto'
        >
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}
