'use client'

import React, { useRef, useState, useEffect } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useFormContext } from './Context'
import { BasePlacement, VariationPlacement } from '@popperjs/core'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProps {
  name: string
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  timeFormat?: string
  minDate?: Date
  maxDate?: Date
  defaultValue?: Date
  showMonthYearPicker?: boolean
  showYearPicker?: boolean
  isClearable?: boolean
  popperPlacement?: BasePlacement | VariationPlacement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popperModifiers?: any[]
  ariaLabelledBy?: string
}

export const DatePicker = ({
  name,
  placeholder = 'Select date...',
  className = '',
  disabled = false,
  required = false,
  dateFormat = 'MM/dd/yyyy',
  showTimeSelect = false,
  timeFormat = 'hh:mm aa',
  minDate,
  maxDate,
  defaultValue,
  showMonthYearPicker = false,
  showYearPicker = false,
  isClearable = true,
  popperPlacement = 'bottom',
  popperModifiers = [],
  ariaLabelledBy,
}: DatePickerProps) => {
  const { form, formId } = useFormContext()
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form
  const inputRef = useRef<HTMLInputElement>(null)
  const datePickerRef = useRef<ReactDatePicker>(null)
  const [startDate, setStartDate] = useState<Date | null>(defaultValue || null)
  console.log(defaultValue)
  const fieldId = `${formId}-${name}`
  const errorMessage = errors[name]?.message as string | undefined
  const hasError = !!errorMessage

  useEffect(() => {
    register(name)
    if (defaultValue && watch(name) === undefined) {
      setValue(name, defaultValue, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, name, defaultValue])

  const watchedValue = watch(name)

  useEffect(() => {
    if (watchedValue && (!startDate || watchedValue.toString() !== startDate.toString())) {
      setStartDate(new Date(watchedValue))
    } else if (!watchedValue && startDate) {
      setStartDate(null)
    }
  }, [watchedValue, startDate])

  const handleChange = (date: Date | null) => {
    setStartDate(date)
    setValue(name, date, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (datePickerRef.current) {
        if (inputRef.current) {
          inputRef.current.click()
        }
      }
    }
  }

  const inputClasses = `
    w-full px-4 py-2 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:outline-none
    ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
    ${className}
  `.trim()

  return (
    <div className='relative w-full'>
      <ReactDatePicker
        ref={datePickerRef}
        selected={startDate}
        onChange={handleChange}
        className={inputClasses}
        placeholderText={placeholder}
        dateFormat={dateFormat}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        id={fieldId}
        name={name}
        autoComplete='off'
        showMonthYearPicker={showMonthYearPicker}
        showYearPicker={showYearPicker}
        isClearable={isClearable}
        popperPlacement={popperPlacement}
        popperModifiers={popperModifiers}
        customInput={
          <input
            ref={inputRef}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${fieldId}-error` : undefined}
            aria-labelledby={ariaLabelledBy}
            aria-required={required}
            onKeyDown={handleKeyDown}
          />
        }
        popperProps={{
          strategy: 'fixed',
        }}
        calendarClassName='shadow-lg border border-gray-200 rounded-lg'
      />
    </div>
  )
}
