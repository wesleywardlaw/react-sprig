'use client'

import React, { useRef, useState, useEffect } from 'react'
import {
  FieldValues,
  FieldPath,
  Path,
  PathValue,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form'
import { useFormContext } from './Context'

export interface FileInputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  accept?: string
  multiple?: boolean
  className?: string
  description?: string
  onChange?: (files: FileList | null) => void
  id?: string
}

export const FileInput = <TFieldValues extends FieldValues>({
  name,
  accept,
  multiple = false,
  className = '',
  description,
  onChange,
  id: externalId,
}: FileInputProps<TFieldValues>) => {
  const { form, formId } = useFormContext<TFieldValues>()
  const inputId = formId ? `${formId}-${name}` : externalId
  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = form
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileNames, setFileNames] = useState<string[]>([])

  const fieldError = errors[name] as
    | FieldError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined

  const hasError = !!fieldError

  // Type-safe function to get individual file errors
  const getFileErrors = (): Record<string, string> => {
    const nestedErrors: Record<string, string> = {}

    if (!fieldError) return nestedErrors

    // If it's a regular error with just a message (no nested errors)
    if ('message' in fieldError && !('type' in fieldError && fieldError.type === 'array')) {
      return nestedErrors
    }

    // Try to get array indices as errors
    try {
      const currentFiles = form.getValues(name) as File[] | undefined
      if (!currentFiles || !Array.isArray(currentFiles)) return nestedErrors

      // Check if fieldError is an array-like object with numeric keys
      if (fieldError && typeof fieldError === 'object') {
        // Look for array indices in the errors object
        Object.keys(fieldError).forEach((key) => {
          // Try to convert the key to a number (array index)
          const index = parseInt(key, 10)
          if (!isNaN(index)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const indexError = (fieldError as any)[index]
            if (indexError && typeof indexError === 'object' && 'message' in indexError) {
              if (currentFiles[index]) {
                nestedErrors[currentFiles[index].name] = indexError.message
              }
            }
          }
        })
      }
    } catch (e) {
      console.error('Error parsing file errors:', e)
    }

    return nestedErrors
  }

  const fileErrors = getFileErrors()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref, onChange: ignoredOnChange, ...rest } = register(name)

  useEffect(() => {
    const subscription = form.watch((_value, { name: fieldName }) => {
      if (fieldName === name || !fieldName) {
        const currentFiles = form.getValues(name) as File[] | undefined
        if (currentFiles && Array.isArray(currentFiles)) {
          setFileNames(currentFiles.map((file) => file.name))
        } else {
          setFileNames([])
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form, name])

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      setValue(name, [] as unknown as PathValue<TFieldValues, Path<TFieldValues>>, {
        shouldValidate: true,
      })
      setFileNames([])
      return
    }

    // Retrieve the existing files
    const currentFiles = (form.getValues(name) as File[]) || []

    // Convert FileList to an array and merge it with existing files
    const newFiles = [...currentFiles, ...Array.from(fileList)]

    // Ensure uniqueness in case the same file is selected again
    const uniqueFiles = Array.from(new Map(newFiles.map((file) => [file.name, file])).values())

    setValue(name, uniqueFiles as unknown as PathValue<TFieldValues, Path<TFieldValues>>, {
      shouldValidate: true,
    })

    setFileNames(uniqueFiles.map((file) => file.name))

    trigger(name)

    if (onChange) {
      onChange(fileList)
    }
  }

  const handleRemoveFile = (fileName: string, event: React.MouseEvent) => {
    event.stopPropagation()

    const currentFiles = (form.getValues(name) as File[]) || []
    const updatedFiles = currentFiles.filter((file) => file.name !== fileName)

    setValue(name, updatedFiles as unknown as PathValue<TFieldValues, Path<TFieldValues>>, {
      shouldValidate: true,
    })

    setFileNames(updatedFiles.map((file) => file.name))

    // Trigger validation after updating the value
    trigger(name)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (inputRef.current) inputRef.current.value = ''

    setValue(name, [] as unknown as PathValue<TFieldValues, Path<TFieldValues>>, {
      shouldValidate: true,
    })

    setFileNames([])

    // Trigger validation after clearing
    trigger(name)

    if (onChange) {
      onChange(null)
    }
  }

  useEffect(() => {
    console.log('Form errors:', form.formState.errors.files)
  }, [form.formState.errors])

  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        type='file'
        accept={accept}
        multiple={multiple}
        className='sr-only'
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
        onChange={(e) => handleFileChange(e.target.files)}
        {...rest}
      />

      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <div className='text-center cursor-pointer'>
          {fileNames.length > 0 ? (
            <div className='flex flex-col space-y-3'>
              <div className='flex justify-end'>
                <button
                  type='button'
                  className='text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded'
                  onClick={handleClear}
                >
                  Clear All
                </button>
              </div>

              <div className='text-sm font-medium text-gray-700'>Selected files:</div>
              <ul className='text-sm text-gray-600 flex flex-col items-start space-y-2'>
                {fileNames.map((name) => {
                  const hasFileError = !!fileErrors[name]

                  return (
                    <li
                      key={name}
                      className={`flex flex-col w-full ${hasFileError ? 'bg-red-50 rounded p-2' : ''}`}
                    >
                      <div className='flex items-center justify-between w-full'>
                        <span
                          className={`truncate max-w-full ${hasFileError ? 'text-red-600' : ''}`}
                        >
                          {name}
                        </span>
                        <button
                          type='button'
                          className='ml-3 px-2 py-1 text-xs text-red-600 bg-red-100 hover:bg-red-200 rounded'
                          onClick={(event) => handleRemoveFile(name, event)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className='py-4'>
              <p className='mt-1 text-sm text-gray-600'>
                <span className='font-medium text-blue-600 hover:text-blue-500'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              {description && <p className='mt-1 text-xs text-gray-500'>{description}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
