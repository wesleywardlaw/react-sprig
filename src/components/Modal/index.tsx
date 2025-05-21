import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  closeButton?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  overlayType?: 'none' | 'light' | 'medium' | 'dark'
  trigger?: React.ReactNode
}

export const Modal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeButton = true,
  maxWidth = 'md',
  overlayType = 'medium',
  trigger,
}: ModalProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  }

  const overlayClasses = {
    none: 'invisible',
    light: 'bg-black bg-opacity-25',
    medium: 'bg-black bg-opacity-50 backdrop-blur-sm',
    dark: 'bg-black bg-opacity-75 backdrop-blur-md',
  }

  const isControlled = isOpen !== undefined && onOpenChange !== undefined

  const modalContent = (
    <>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${overlayClasses[overlayType]}`}
        />

        <Dialog.Content
          className={`fixed left-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg ${maxWidthClasses[maxWidth]}`}
        >
          {(title || description) && (
            <div className='flex flex-col space-y-1.5'>
              {title && (
                <Dialog.Title className='text-lg font-semibold text-gray-900'>{title}</Dialog.Title>
              )}
              {description && (
                <Dialog.Description className='text-sm text-gray-500'>
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          <div className='flex-1'>{children}</div>

          {footer && <div className='flex items-center justify-end space-x-2 pt-4'>{footer}</div>}

          {closeButton && (
            <Dialog.Close className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </>
  )

  if (isControlled) {
    return (
      <Dialog.Root
        open={isOpen}
        onOpenChange={onOpenChange}
      >
        {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
        {modalContent}
      </Dialog.Root>
    )
  }

  return (
    <Dialog.Root>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      {modalContent}
    </Dialog.Root>
  )
}

export const ModalClose = Dialog.Close
