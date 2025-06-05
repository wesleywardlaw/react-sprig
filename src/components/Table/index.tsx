import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export interface TableColumn<T> {
  accessorKey: keyof T
  header: string
  sortable?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell?: (value: any) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  pageSize: number
  currentPage: number
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export function Table<T>({
  data,
  columns,
  pageSize,
  currentPage,
  sorting,
  setSorting,
}: TableProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableColumns = useMemo<ColumnDef<T, any>[]>(() => {
    return columns.map((col) => ({
      accessorKey: col.accessorKey as string,
      header: ({ column }) => {
        if (col.sortable === false) {
          return <span className='font-semibold text-gray-900'>{col.header}</span>
        }

        return (
          <button
            className='flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600 focus:outline-none focus:text-blue-600'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            aria-label={`Sort by ${col.header} ${
              column.getIsSorted() === 'asc'
                ? 'descending'
                : column.getIsSorted() === 'desc'
                  ? 'clear sorting'
                  : 'ascending'
            }`}
          >
            {col.header}
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp
                className='w-4 h-4'
                data-testid='chevron-up'
              />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown
                className='w-4 h-4'
                data-testid='chevron-down'
              />
            ) : (
              <ChevronsUpDown className='w-4 h-4 opacity-50' />
            )}
          </button>
        )
      },
      cell: ({ getValue }) => {
        const value = getValue()
        return col.cell ? col.cell(value) : value
      },
    }))
  }, [columns])

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data.length / pageSize),
  })

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg'>
        <thead className='bg-gray-50'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getRowModel().rows.length === 0 && (
        <div className='text-center py-8 text-gray-500'>No data available</div>
      )}
    </div>
  )
}
