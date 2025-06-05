import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Table, TableColumn } from './index'
import { SortingState } from '@tanstack/react-table'

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

describe('Table', () => {
  const Parent = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    return (
      <Table<Person>
        data={sampleData}
        columns={columns}
        pageSize={5}
        currentPage={0}
        sorting={sorting}
        setSorting={setSorting}
      />
    )
  }
  it('renders table headers', () => {
    render(<Parent />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
  })

  it('renders table rows', () => {
    render(<Parent />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('shows no data message when data is empty', () => {
    const Parent = () => {
      const [sorting, setSorting] = useState<SortingState>([])
      return (
        <Table<Person>
          data={[]}
          columns={columns}
          pageSize={5}
          currentPage={0}
          sorting={sorting}
          setSorting={setSorting}
        />
      )
    }
    render(<Parent />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('shows chevron-up and chevron-down when sorting (controlled)', () => {
    render(<Parent />)
    const nameHeader = screen.getByRole('button', { name: /sort by name/i })
    fireEvent.click(nameHeader)
    expect(screen.queryByTestId('chevron-up')).not.toBeNull()
    fireEvent.click(nameHeader)
    expect(screen.queryByTestId('chevron-down')).not.toBeNull()
  })
})
