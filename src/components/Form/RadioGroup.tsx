'use client'

import React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'

import { RadioGroupContext, useFormContext } from './Context'

export interface RadioGroupProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export const RadioGroup = <TFieldValues extends FieldValues>({
  name,
  children,
  className = '',
  disabled = false,
}: RadioGroupProps<TFieldValues>) => {
  const { formId } = useFormContext<TFieldValues>()
  const groupId = `${formId}-${name}-group`

  const contextValue = {
    name,
    disabled,
  }

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        id={groupId}
        className={`flex flex-col gap-2 ${className}`}
        role='radiogroup'
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}
