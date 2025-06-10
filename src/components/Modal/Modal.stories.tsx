import React from 'react'
import { Meta, StoryObj } from '@storybook/react-vite'
import { Modal, ModalClose } from './index'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    isOpen: { control: 'boolean' },
    onOpenChange: { action: 'onOpenChange' },
    overlayType: {
      control: 'select',
      options: ['none', 'light', 'medium', 'dark'],
    },
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Modal>

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    return (
      <div style={{ padding: 40 }}>
        <Modal
          {...args}
          isOpen={open}
          onOpenChange={setOpen}
          title='Controlled Modal'
          description='This modal is controlled via React state.'
          footer={
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setOpen(false)}
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                }}
                style={{ padding: '8px 16px', background: '#2563eb', color: 'white' }}
              >
                Confirm
              </button>
            </div>
          }
        >
          <p>This modal is opened using a button that sets state to true.</p>
        </Modal>
        <button
          onClick={() => setOpen(true)}
          style={{ marginTop: 16, padding: '8px 16px', background: '#2563eb', color: 'white' }}
        >
          Open Controlled Modal
        </button>
      </div>
    )
  },
}

export const WithTriggerProp: Story = {
  args: {
    title: 'Modal with Trigger',
    description: 'This modal uses the trigger prop for simplicity.',
    overlayType: 'dark',
    trigger: (
      <button style={{ padding: '8px 16px', background: '#a21caf', color: 'white' }}>
        Open Modal with Trigger
      </button>
    ),
    footer: (
      <ModalClose asChild>
        <button style={{ padding: '8px 16px', background: '#a21caf', color: 'white' }}>
          Close Modal
        </button>
      </ModalClose>
    ),
    children: (
      <div>
        <p>With the trigger prop, you can pass any element to open the modal.</p>
      </div>
    ),
  },
}

export const CustomTrigger: Story = {
  args: {
    title: 'Custom Trigger Example',
    description: 'This modal is opened using a custom element as trigger',
    overlayType: 'light',
    maxWidth: 'lg',
    trigger: (
      <div
        style={{
          background: '#bbf7d0',
          border: '2px solid #4ade80',
          padding: 16,
          borderRadius: 8,
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#166534', fontWeight: 500 }}>
          Click this entire box to open the modal
        </span>
      </div>
    ),
    footer: (
      <ModalClose asChild>
        <button style={{ padding: '8px 16px', background: '#22c55e', color: 'white' }}>
          I understand
        </button>
      </ModalClose>
    ),
    children: (
      <div>
        <p>
          The trigger prop accepts any React element, letting you use custom components to open the
          modal.
        </p>
      </div>
    ),
  },
}

export const OverlayTypes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 40 }}>
      <Modal
        {...args}
        title='No Overlay Modal'
        description='This modal has no background overlay'
        overlayType='none'
        trigger={
          <button style={{ padding: '8px 16px', background: '#6b7280', color: 'white' }}>
            No Overlay
          </button>
        }
        footer={
          <ModalClose asChild>
            <button style={{ padding: '8px 16px', background: '#6b7280', color: 'white' }}>
              Close
            </button>
          </ModalClose>
        }
      >
        <p>This modal has no overlay (overlayType="none"). The background is fully visible.</p>
      </Modal>
      <Modal
        {...args}
        title='Light Overlay Modal'
        description='This modal uses a light overlay'
        overlayType='light'
        trigger={
          <button style={{ padding: '8px 16px', background: '#f59e42', color: 'white' }}>
            Light Overlay
          </button>
        }
        footer={
          <ModalClose asChild>
            <button style={{ padding: '8px 16px', background: '#f59e42', color: 'white' }}>
              Close
            </button>
          </ModalClose>
        }
      >
        <p>
          This modal has a light overlay (overlayType="light"). The background is slightly dimmed.
        </p>
      </Modal>
      <Modal
        {...args}
        title='Medium Overlay Modal'
        description='This modal uses a medium overlay (default)'
        overlayType='medium'
        trigger={
          <button style={{ padding: '8px 16px', background: '#2563eb', color: 'white' }}>
            Medium Overlay
          </button>
        }
        footer={
          <ModalClose asChild>
            <button style={{ padding: '8px 16px', background: '#2563eb', color: 'white' }}>
              Close
            </button>
          </ModalClose>
        }
      >
        <p>This modal has a medium overlay (overlayType="medium"). This is the default setting.</p>
      </Modal>
      <Modal
        {...args}
        title='Dark Overlay Modal'
        description='This modal uses a dark overlay that heavily shadows the background'
        overlayType='dark'
        trigger={
          <button style={{ padding: '8px 16px', background: '#a21caf', color: 'white' }}>
            Dark Overlay
          </button>
        }
        footer={
          <ModalClose asChild>
            <button style={{ padding: '8px 16px', background: '#a21caf', color: 'white' }}>
              Close
            </button>
          </ModalClose>
        }
      >
        <p>This modal has a dark overlay (overlayType="dark"). The background is heavily dimmed.</p>
      </Modal>
    </div>
  ),
}
