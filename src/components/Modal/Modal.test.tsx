import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Modal, ModalClose } from './index'
import { describe, it, expect, vi } from 'vitest'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalWithTrigger = (props: any) => (
  <Modal
    title='Test Modal'
    description='Test description'
    trigger={<button>Open Modal</button>}
    {...props}
  >
    <div>Modal Content</div>
    {props.children}
  </Modal>
)

describe('Modal', () => {
  it('renders trigger and opens modal on click', () => {
    render(<ModalWithTrigger />)
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Open Modal'))
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('renders footer if provided', () => {
    render(<ModalWithTrigger footer={<div>Footer Content</div>} />)
    fireEvent.click(screen.getByText('Open Modal'))
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('renders close button by default and closes modal', () => {
    render(<ModalWithTrigger />)
    fireEvent.click(screen.getByText('Open Modal'))
    const closeBtn = screen.getByText('Close')
    expect(closeBtn).toBeInTheDocument()
    fireEvent.click(closeBtn)
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('does not render close button if closeButton is false', () => {
    render(<ModalWithTrigger closeButton={false} />)
    fireEvent.click(screen.getByText('Open Modal'))
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
  })

  it('calls onOpenChange in controlled mode', () => {
    const onOpenChange = vi.fn()
    const Controlled = () => {
      const [open, setOpen] = React.useState(false)
      return (
        <Modal
          isOpen={open}
          onOpenChange={(val) => {
            setOpen(val)
            onOpenChange(val)
          }}
          title='Controlled Modal'
          trigger={<button>Open Controlled</button>}
        >
          <div>Controlled Content</div>
        </Modal>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByText('Open Controlled'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    fireEvent.click(screen.getByText('Close'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('applies maxWidth and overlayType classes', () => {
    render(
      <ModalWithTrigger
        maxWidth='lg'
        overlayType='dark'
      />
    )
    fireEvent.click(screen.getByText('Open Modal'))
    // Find the overlay by role or fallback to querySelector
    const overlays = Array.from(document.querySelectorAll('[class*="bg-"]'))
    const overlay = overlays.find(
      (el) => el.className.includes('bg-black') && el.className.includes('bg-opacity-75')
    )
    expect(overlay).toBeTruthy()
    const content = screen.getByText('Test Modal').closest('[role="dialog"]')
    expect(content?.className).toMatch(/max-w-lg/)
  })

  it('renders children', () => {
    render(
      <ModalWithTrigger>
        <span>Child Content</span>
      </ModalWithTrigger>
    )
    fireEvent.click(screen.getByText('Open Modal'))
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('ModalClose closes modal when used as footer', () => {
    render(
      <ModalWithTrigger
        footer={
          <ModalClose asChild>
            <button>Custom Close</button>
          </ModalClose>
        }
      />
    )
    fireEvent.click(screen.getByText('Open Modal'))
    fireEvent.click(screen.getByText('Custom Close'))
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })
})
