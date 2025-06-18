'use client'

import React, { useState } from 'react'
import { format, parse } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { useFormContext } from './Context' // Using your custom FormContext hook

export interface DatePickerProps {
  name: string
  required?: boolean
  defaultValue?: Date
  disabled?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  required,
  defaultValue,
  disabled = false,
}) => {
  const { form } = useFormContext()
  const { setValue, trigger } = form

  const [inputValue, setInputValue] = useState(
    defaultValue ? format(defaultValue, 'MM/dd/yyyy') : ''
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultValue)
  const [showCalendar, setShowCalendar] = useState(false)

  // Register/unregister field based on disabled
  React.useEffect(() => {
    if (disabled) {
      form.unregister(name)
    } else {
      form.register(name)
    }
    // Only run when disabled or name changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, name])

  const { formId } = useFormContext()
  const inputId = `${formId || 'form'}-${name}`

  // Format user input dynamically
  const formatDateInput = (value: string): string => {
    const digits = value.replace(/\D/g, '')

    if (digits.length >= 8) {
      const month = digits.slice(0, 2)
      const day = digits.slice(2, 4)
      const year = digits.slice(4, 8)
      return `${month}/${day}/${year}`
    }

    return value
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formattedValue = formatDateInput(rawValue)

    setInputValue(formattedValue)

    const parsedDate = parse(formattedValue, 'MM/dd/yyyy', new Date())

    if (formattedValue.trim() === '') {
      setSelectedDate(undefined)
      setValue(name, '', { shouldValidate: true }) // Pass empty string for empty input
      trigger(name)
    } else if (!isNaN(parsedDate.getTime())) {
      setSelectedDate(parsedDate)
      setValue(name, parsedDate, { shouldValidate: true }) // Store as Date object
      trigger(name)
    } else {
      setSelectedDate(undefined)
      setValue(name, formattedValue, { shouldValidate: true }) // Pass raw string for invalid/partial input
      trigger(name)
    }
  }

  // Handle date selection from `react-day-picker`
  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      const formatted = format(date, 'MM/dd/yyyy')
      setInputValue(formatted)
      setValue(name, date, { shouldValidate: true }) // Store as Date object
      trigger(name) // Validate field
      setShowCalendar(false) // ✅ Hide calendar after selection
    }
  }

  return (
    <div
      className='relative'
      tabIndex={-1}
      onBlur={(e) => {
        // Hide calendar if focus leaves both input and calendar
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowCalendar(false)
        }
      }}
    >
      <input
        id={inputId}
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => !disabled && setShowCalendar(true)}
        placeholder='MM/DD/YYYY'
        className='border rounded px-2 py-1 w-full'
        required={required}
        disabled={disabled}
      />

      {showCalendar && !disabled && (
        <div
          className={`absolute mt-2 bg-white shadow-lg p-2 rounded z-50${!selectedDate ? ' opacity-100' : ''}`}
          tabIndex={-1}
          style={{ opacity: 1, pointerEvents: 'auto' }} // Ensure always visible and interactive
        >
          <DayPicker
            mode='single'
            selected={selectedDate}
            onSelect={handleDaySelect}
          />
        </div>
      )}
    </div>
  )
}
