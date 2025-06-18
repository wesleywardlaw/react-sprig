'use client'

import React, { useState, useEffect } from 'react'
import { useFormContext } from './Context'
import { FieldValues, FieldPath } from 'react-hook-form'

import './Slider.css'

export interface SliderProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  showValue?: boolean
  valuePrefix?: string
  valueSuffix?: string
  disabled?: boolean
  className?: string
  id?: string
}

export const Slider = <TFieldValues extends FieldValues>({
  name,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = min,
  showValue = true,
  valuePrefix = '',
  valueSuffix = '',
  disabled = false,
  className = '',
  id,
}: SliderProps<TFieldValues>) => {
  const { formId, form } = useFormContext<TFieldValues>()
  const { register, setValue, unregister } = form

  const fieldId = formId ? `${formId}-${name}` : (id ?? name)

  // Force numeric default value - align with step
  const initialValue = Math.round((Number(defaultValue) - min) / step) * step + min

  // Controlled component state for the slider value
  const [sliderValue, setSliderValue] = useState<number>(initialValue)

  // Register the field with react-hook-form but handle the value ourselves
  const { ref } = register(name)

  // Set initial value in the form
  useEffect(() => {
    // Convert to number and set the initial value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(name, initialValue as any, { shouldValidate: false })
  }, [initialValue, name, setValue])

  // Calculate percentage for styling
  const percentage = ((sliderValue - min) / (max - min)) * 100

  const updateFormValue = (value: number) => {
    // Force number type when setting value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(name, Number(value) as any, { shouldValidate: true })
  }

  // Handle slider changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Always convert to number
    const newValue = Number(e.target.value)

    // Round to the nearest step increment if needed
    const steppedValue = Math.round(newValue / step) * step

    // Clamp the value to min/max range and ensure step alignment
    const finalValue = Math.max(min, Math.min(max, steppedValue))

    setSliderValue(finalValue)
    updateFormValue(finalValue)
  }

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    let newValue = sliderValue

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue += step
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue -= step
        break
      case 'PageUp':
        newValue += Math.max(step, (max - min) * 0.1)
        break
      case 'PageDown':
        newValue -= Math.max(step, (max - min) * 0.1)
        break
      case 'Home':
        newValue = min
        break
      case 'End':
        newValue = max
        break
      default:
        return
    }

    // Ensure the value stays within min/max bounds
    newValue = Math.max(min, Math.min(max, newValue))

    // Prevent unnecessary state updates
    if (newValue !== sliderValue) {
      setSliderValue(newValue) // Update only once
      updateFormValue(newValue) // React Hook Form update
    }

    e.preventDefault() // Stop the event from propagating further
  }

  useEffect(() => {
    if (disabled) {
      console.log(`Disabling slider: ${name}`)
      unregister(name) // Completely removes the slider field
    } else {
      console.log(`Enabling slider: ${name}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(name, initialValue as any, { shouldValidate: false }) // Restore default when enabled
    }
  }, [disabled, initialValue, name, setValue, unregister])

  return (
    <div className={`w-full ${className} ${disabled ? 'cursor-not-allowed' : ''}`}>
      <div className='relative pt-1 pb-5'>
        {/* Custom track (behind the input) */}
        <div
          className={`absolute top-1/2 left-0 w-full h-2 rounded-full bg-gray-200${
            disabled ? ' cursor-not-allowed' : ''
          }`}
          style={{ transform: 'translateY(-50%)', pointerEvents: disabled ? 'auto' : 'none' }}
        />

        {/* Filled part of the track */}
        <div
          className={`absolute top-1/2 left-0 h-2 rounded-full ${disabled ? 'bg-gray-300' : 'bg-blue-500'}`}
          style={{
            width: `${percentage}%`,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Actual input range, made transparent but functional */}
        <input
          data-testid='slider-input'
          type='range'
          id={fieldId}
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={ref}
          className={`absolute top-1/2 h-6 appearance-none bg-transparent range-input-hidden-thumb z-10 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            background: 'transparent',
            transform: 'translateY(-50%)',
            zIndex: 10,
            pointerEvents: 'auto',
            width: 'calc(100% + 16px)',
            left: '-8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          aria-valuenow={sliderValue}
          aria-valuemin={min}
          aria-valuemax={max}
        />

        {/* Focus ring that appears when using keyboard navigation */}
        <div
          className='slider-focus-ring absolute top-1/2 left-0 w-full h-2 rounded-full opacity-0 transition-opacity duration-200'
          style={{ transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />

        {/* Custom thumb (on top of everything) */}
        <div
          className={`absolute top-1/2 w-4 h-4 rounded-full shadow ${
            disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'
          }`}
          style={{
            left: `calc(${percentage}% - 0.5rem)`,
            transform: 'translateY(-50%)',
            pointerEvents: disabled ? 'auto' : 'none',
          }}
        />
      </div>

      {showValue && (
        <div className='mt-1 text-right text-sm font-medium text-gray-500'>
          {valuePrefix}
          {sliderValue}
          {valueSuffix}
        </div>
      )}
    </div>
  )
}
