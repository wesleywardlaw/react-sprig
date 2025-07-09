import { ReactNode } from 'react'
import { useFormContext } from './Context'
import { FieldValues } from 'react-hook-form'

export interface SubmitProps {
  children: ReactNode
  className?: string
}

export const Submit = ({ children, className = '' }: SubmitProps) => {
  const { form, isSubmitting } = useFormContext<FieldValues>()

  return (
    <button
      type='submit'
      disabled={!form.formState.isValid || isSubmitting}
      className={`disabled:opacity-50 disabled:cursor-not-allowed inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      {isSubmitting ? (
        <svg
          className='animate-spin h-5 w-5 text-white'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}
