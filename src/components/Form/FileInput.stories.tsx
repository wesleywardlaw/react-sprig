import { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'
import { Form } from '.'
import { FileInput } from './FileInput'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/FileInput',
  component: Form,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ minWidth: 200, width: '100%', maxWidth: 400 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Form>

export const BasicFileInput: Story = {
  render: () => (
    <Form
      schema={z.object({
        file: z.array(z.instanceof(File)).optional(),
      })}
      onSubmit={async (data: { file?: File[] }) => {
        console.log('File submitted:', data.file ? Array.from(data.file) : 'No file')
        return { success: true }
      }}
    >
      <Form.Field name='file'>
        <Form.Label htmlFor='file'>Upload File</Form.Label>
        <FileInput name='file' />
        <Form.Error name='file' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const FileInputWithValidation: Story = {
  render: () => (
    <Form
      schema={z.object({
        file: z
          .array(z.instanceof(File))
          .refine((files) => files.every((file) => file.size <= 1024 * 1024), {
            message: 'Each file must not exceed 1MB',
          }),
      })}
      onSubmit={async (data: { file: File[] }) => {
        console.log('File submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='file'>
        <Form.Label htmlFor='file'>Upload File (Max 1MB)</Form.Label>
        <FileInput
          name='file'
          // maxSizeMB={1}
        />
        <Form.Error name='file' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const MultipleFileInput: Story = {
  render: () => (
    <Form
      schema={z.object({
        files: z.array(z.instanceof(File)).min(1, 'At least one file is required'),
      })}
      onSubmit={async (data: { files: File[] }) => {
        console.log('Files submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='files'>
        <Form.Label htmlFor='files'>Upload Multiple Files</Form.Label>
        <FileInput
          name='files'
          multiple
          // maxFiles={5}
        />
        <Form.Error name='files' />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const FileInputWithDescription: Story = {
  render: () => (
    <Form
      schema={z.object({
        file: z.array(z.instanceof(File)).optional(),
      })}
      onSubmit={async (data: { file?: File[] }) => {
        console.log('File submitted:', data)
        return { success: true }
      }}
    >
      <Form.Field name='file'>
        <Form.Label htmlFor='file'>Upload File</Form.Label>
        <FileInput
          name='file'
          description='Accepted formats: PNG, JPG. Max size: 2MB.'
          accept='.png,.jpg'
        />
        <Form.Error name='file' />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}

export const MultipleFileInputWithSizeValidation: Story = {
  render: () => (
    <Form
      schema={z.object({
        files: z
          .custom<File>()
          .array()
          .min(1, 'Please select at least one file')
          .max(3, 'Maximum 3 files allowed')
          .refine((files) => files.every((file) => file.size <= 1024 * 1024), {
            message: 'Some files exceed the 1MB limit',
            path: ['files'],
          })
          .superRefine((files, ctx) => {
            files.forEach((file, index) => {
              if (file.size > 1024 * 1024) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `${file.name} exceeds 1MB`,
                  path: [index],
                })
              }
            })
          }),
      })}
      onSubmit={async (data) => {
        console.log('Submitted files:', data.files)
        return { success: true }
      }}
    >
      <Form.Field name='files'>
        <Form.Label>Upload Files</Form.Label>
        <FileInput
          name='files'
          multiple
        />
        <Form.Error name='files' />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  ),
}
