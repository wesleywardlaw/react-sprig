import { useState } from 'react'
import { Table } from './index'
import { TableColumn } from './index'
import type { SortingState } from '@tanstack/react-table'

export default {
  title: 'Components/Table',
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

export const Default = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  return (
    <Table
      data={sampleData}
      columns={columns}
      pageSize={1}
      currentPage={1}
      sorting={sorting}
      setSorting={setSorting}
    />
  )
}
