import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Pagination } from './index';

const defaultProps = {
  currentPage: 0,
  totalPages: 5,
  pageSize: 10,
  pageSizeOptions: [5, 10, 20],
  totalItems: 42,
  onPageChange: () => {},
  onPageSizeChange: () => {},
};

describe('Pagination', () => {
  it('renders page info and controls', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/showing 1 to 10 of 42 results/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to:')).toBeInTheDocument();
  });

  it('calls onPageChange when navigation buttons are clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} currentPage={1} />);
    fireEvent.click(screen.getByLabelText('Go to first page'));
    expect(onPageChange).toHaveBeenCalledWith(0);
    fireEvent.click(screen.getByLabelText('Go to previous page'));
    expect(onPageChange).toHaveBeenCalledWith(0);
    fireEvent.click(screen.getByLabelText('Go to next page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByLabelText('Go to last page'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageSizeChange when page size is changed', () => {
    const onPageSizeChange = vi.fn();
    render(<Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />);
    fireEvent.change(screen.getByLabelText('Show:'), { target: { value: '20' } });
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('calls onPageChange when go to page is used', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    const input = screen.getByPlaceholderText('Page');
    fireEvent.change(input, { target: { value: '3' } });
    fireEvent.click(screen.getByText('Go'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables prev/first on first page and next/last on last page', () => {
    const { rerender } = render(<Pagination {...defaultProps} currentPage={0} />);
    expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    rerender(<Pagination {...defaultProps} currentPage={4} />);
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).toBeDisabled();
  });
});
