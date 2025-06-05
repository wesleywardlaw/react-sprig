import { useState } from 'react'
import { Pagination } from './index'

export default {
  title: 'Components/Pagination',
  component: Pagination,
}

export const Default = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const totalItems = 42
  const pageSizeOptions = [5, 10, 20, 50]
  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      totalItems={totalItems}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  )
}
