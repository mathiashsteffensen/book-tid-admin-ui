import { FormEvent, useState } from "react"

import { SearchSelectProps, TextFieldProps } from "src/components/agnostic"
import { DateTimePickerProps } from "src/components/agnostic/Form/DateTimePicker"
import { NumberFieldProps } from "src/components/agnostic/Form/NumberField"

export type UseFormValuesOnChangeHelpers<
    T extends Record<string, unknown>
> = Pick<UseFormValues<T>, "change" | "values">

export interface UseFormValuesParams<T extends Record<string, unknown>> {
    initialValues: T
    onSubmit: (values: T) => void
    onChange?: <TKey extends keyof T>(
        name: TKey,
        value: T[TKey],
        helpers: UseFormValuesOnChangeHelpers<T>
    ) => void
    requiredFields?: Array<keyof T>
}

export type UseFormValuesErrors<T extends Record<string, unknown>> = Partial<
    Record<keyof T, string>
>

export interface UseFormValues<T extends Record<string, unknown>> {
    values: T
    errors: UseFormValuesErrors<T>
    change: <TKey extends keyof T>(key: TKey, value: T[TKey]) => void
    onChange: TextFieldProps["onChange"] &
        DateTimePickerProps["onChange"] &
        SearchSelectProps["onChange"] &
        NumberFieldProps["onChange"]
    validate: () => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    submitting: boolean
    submitError?: string
}

export const useFormValues = <T extends Record<string, unknown>>({
    initialValues,
    onSubmit,
    onChange: onChangeCallback,
    requiredFields,
}: UseFormValuesParams<T>): UseFormValues<T> => {
    const [values, setValues] = useState<T>(initialValues)
    const [errors, setErrors] = useState<UseFormValuesErrors<T>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()

    const change = <TKey extends keyof T>(key: TKey, value: T[TKey]) => {
        setValues({
            ...values,
            [key]: value,
        })
    }

    const onChange: UseFormValues<T>["onChange"] = (
        ...args:
            | Parameters<TextFieldProps["onChange"]>
            | Parameters<DateTimePickerProps["onChange"]>
            | Parameters<SearchSelectProps["onChange"]>
            | Parameters<NumberFieldProps["onChange"]>
    ) => {
        let value: T[keyof T]
        let name: keyof T

        switch (args.length) {
            case 2: {
                // DateTimePickerProps["onChange"] | NumberFieldProps["onChange"] | SearchSelectProps["onChange"]
                value = args[0] as T[keyof T]
                name = args[1]
                break
            }
            case 1: {
                // TextFieldProps["onChange"]
                const event = args[0]
                name = event.target.name
                value = event.target.value as T[keyof T]
                break
            }
        }

        change(name, value)
        onChangeCallback?.(name, value, { change, values })
    }

    const validate = () => {
        if (!requiredFields) {
            return true
        }

        let hasError = false
        const errorsIntermediary: typeof errors = {}

        for (const requiredField of requiredFields) {
            if (!values[requiredField] && values[requiredField] !== 0) {
                errorsIntermediary[requiredField] = "Required field"
                hasError = true
            }
        }

        if (hasError) {
            setErrors(errorsIntermediary)
        }

        return !hasError
    }

    const onSubmitWithValidate: UseFormValues<T>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault()

        if (!validate()) {
            return
        }

        setSubmitting(true)

        try {
            await onSubmit(values)
        } catch (error) {
            // @ts-expect-error wdjoawjdo wnaiond oiwan doinwaoi
            setSubmitError(error.toString())
        } finally {
            setSubmitting(false)
        }
    }

    return {
        values,
        errors,
        onChange,
        change,
        validate,
        onSubmit: onSubmitWithValidate,
        submitting,
        submitError,
    }
}
