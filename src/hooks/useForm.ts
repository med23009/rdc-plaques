"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { FormErrors, FormTouched, ValidationRules } from "../types"

interface UseFormReturn<T> {
  values: T
  errors: FormErrors
  touched: FormTouched
  isSubmitting: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: React.FormEvent) => Promise<void>
  reset: () => void
  setValues: React.Dispatch<React.SetStateAction<T>>
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules = {},
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setValues((prev: T) => ({
        ...prev,
        [name]: value,
      }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }))
      }
    },
    [errors],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target
      setTouched((prev: FormTouched) => ({
        ...prev,
        [name]: true,
      }))

      // Validate field on blur
      if (validationRules[name]) {
        const error = validationRules[name](values[name])
        if (error) {
          setErrors((prev) => ({
            ...prev,
            [name]: error,
          }))
        }
      }
    },
    [values, validationRules],
  )

  const validate = useCallback(() => {
    const newErrors: FormErrors = {}
    Object.keys(validationRules).forEach((field) => {
      const error = validationRules[field](values[field])
      if (error) {
        newErrors[field] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validationRules])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) => {
      return async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (validate()) {
          try {
            await onSubmit(values)
          } catch (error) {
            console.error("Form submission error:", error)
          }
        }

        setIsSubmitting(false)
      }
    },
    [values, validate],
  )

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  }
}
