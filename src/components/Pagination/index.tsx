import { useState } from 'react'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [goToPage, setGoToPage] = useState('')

  const handleGoToPage = () => {
    const page = parseInt(goToPage) - 1
    if (page >= 0 && page < totalPages) {
      onPageChange(page)
      setGoToPage('')
    }
  }

  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems)

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200'>
      <div className='text-sm text-gray-700'>
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <label
            htmlFor='pageSize'
            className='text-sm text-gray-700'
          >
            Show:
          </label>
          <select
            id='pageSize'
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500'
          >
            {pageSizeOptions.map((size) => (
              <option
                key={size}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-1'>
          <button
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus-visbile:ring-2 focus-visible:ring-blue-500 rounded'
            aria-label='Go to first page'
          >
            <ChevronsLeft className='w-4 h-4' />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
            aria-label='Go to previous page'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>

          <span className='px-3 py-1 text-sm text-gray-700'>
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
            aria-label='Go to next page'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
            aria-label='Go to last page'
          >
            <ChevronsRight className='w-4 h-4' />
          </button>
        </div>

        <div className='flex items-center gap-2'>
          <label
            htmlFor='goToPage'
            className='text-sm text-gray-700'
          >
            Go to:
          </label>
          <input
            id='goToPage'
            type='number'
            min='1'
            max={totalPages}
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGoToPage()
              }
            }}
            className='w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500'
            placeholder='Page'
          />
          <button
            onClick={handleGoToPage}
            className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500'
          >
            Go
          </button>
        </div>
      </div>
    </div>
  )
}
