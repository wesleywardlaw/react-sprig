import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ToastProvider, useToast } from '.'

const TestComponent = () => {
  const { addToast } = useToast()

  return (
    <button
      onClick={() =>
        addToast({
          message: 'Test toast',
          type: 'info',
          duration: 1000,
        })
      }
    >
      Show Toast
    </button>
  )
}

describe('ToastProvider', () => {
  it('adds and auto-removes a toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    await userEvent.click(screen.getByText('Show Toast'))

    expect(await screen.findByText('Test toast')).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.queryByText('Test toast')).not.toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('displays a persistent toast (duration = 0)', async () => {
    const PersistentTest = () => {
      const { addToast } = useToast()
      return (
        <button
          onClick={() =>
            addToast({
              message: 'Persistent toast',
              type: 'warning',
              duration: 0,
            })
          }
        >
          Show Persistent Toast
        </button>
      )
    }

    render(
      <ToastProvider>
        <PersistentTest />
      </ToastProvider>
    )

    await userEvent.click(screen.getByText('Show Persistent Toast'))

    expect(await screen.findByText('Persistent toast')).toBeInTheDocument()

    // Should still be in the document after waiting
    await new Promise((res) => setTimeout(res, 1500))
    expect(screen.getByText('Persistent toast')).toBeInTheDocument()
  })

  it('allows manual closing of toast', async () => {
    const ClickToClose = () => {
      const { addToast } = useToast()
      return (
        <button
          onClick={() =>
            addToast({
              message: 'Close me',
              type: 'info',
              duration: 0,
            })
          }
        >
          Show Closeable Toast
        </button>
      )
    }

    render(
      <ToastProvider>
        <ClickToClose />
      </ToastProvider>
    )

    await userEvent.click(screen.getByText('Show Closeable Toast'))
    const closeBtn = await screen.findByLabelText('Close notification')
    await userEvent.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText('Close me')).not.toBeInTheDocument()
    })
  })
})
