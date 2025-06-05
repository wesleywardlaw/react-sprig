import { useState } from 'react'
import { Table } from './index'
import { Pagination } from '../Pagination'
import type { TableColumn } from './index'
import type { SortingState } from '@tanstack/react-table'

export default {
  title: 'Components/TableWithPagination',
  component: Table,
}

interface Person {
  id: number
  name: string
  email: string
  age: number
  department: string
  salary: number
}

const sampleData: Person[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    department: 'Engineering',
    salary: 75000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 28,
    department: 'Marketing',
    salary: 65000,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    department: 'Sales',
    salary: 70000,
  },
  {
    id: 4,
    name: 'Alice Wilson',
    email: 'alice@example.com',
    age: 32,
    department: 'Engineering',
    salary: 80000,
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    age: 29,
    department: 'HR',
    salary: 60000,
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana@example.com',
    age: 31,
    department: 'Marketing',
    salary: 68000,
  },
  {
    id: 7,
    name: 'Edward Smith',
    email: 'edward@example.com',
    age: 27,
    department: 'Engineering',
    salary: 72000,
  },
  {
    id: 8,
    name: 'Fiona Davis',
    email: 'fiona@example.com',
    age: 33,
    department: 'Sales',
    salary: 71000,
  },
  {
    id: 9,
    name: 'George Wilson',
    email: 'george@example.com',
    age: 36,
    department: 'HR',
    salary: 62000,
  },
  {
    id: 10,
    name: 'Helen Johnson',
    email: 'helen@example.com',
    age: 30,
    department: 'Marketing',
    salary: 66000,
  },
  {
    id: 11,
    name: 'Ian Brown',
    email: 'ian@example.com',
    age: 34,
    department: 'Engineering',
    salary: 78000,
  },
  {
    id: 12,
    name: 'Julia Davis',
    email: 'julia@example.com',
    age: 26,
    department: 'Sales',
    salary: 69000,
  },
  {
    id: 13,
    name: 'Kevin Miller',
    email: 'kevin@example.com',
    age: 31,
    department: 'HR',
    salary: 63000,
  },
  {
    id: 14,
    name: 'Laura Garcia',
    email: 'laura@example.com',
    age: 29,
    department: 'Marketing',
    salary: 67000,
  },
  {
    id: 15,
    name: 'Mike Taylor',
    email: 'mike@example.com',
    age: 37,
    department: 'Engineering',
    salary: 82000,
  },
]

const columns: TableColumn<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'department', header: 'Department' },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: (value: number) => `$${value.toLocaleString()}`,
  },
]

const pageSizeOptions = [5, 10, 20, 50]

export const TableWithPagination = () => {
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(sampleData.length / pageSize)
  const currentData = sampleData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(0)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  const [sorting, setSorting] = useState<SortingState>([])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: '#f9fafb', padding: 24 }}>
      <Table
        data={currentData}
        columns={columns}
        pageSize={pageSize}
        currentPage={currentPage}
        sorting={sorting}
        setSorting={setSorting}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        totalItems={sampleData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
