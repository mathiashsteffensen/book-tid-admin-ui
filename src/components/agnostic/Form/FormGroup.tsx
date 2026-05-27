import {
    SearchSelect,
    SearchSelectProps,
    Stack,
    Text,
} from "src/components/agnostic"
import { DateHelper, DateType } from "src/helpers"
import { UseFormValues } from "src/hooks"

import { DateTimePicker, DateTimePickerProps } from "./DateTimePicker"
import { NumberField, NumberFieldProps } from "./NumberField"
import { TextFieldProps, TextField } from "./TextField"

type inputElementProps<T> = Omit<T, "onChange" | "value" | "name" | "label">

interface FormGroupTextFieldProps extends inputElementProps<TextFieldProps> {
    type: "text" | "password" | "email" | "phonenumber"
}

interface FormGroupDateTimePickerProps
    extends inputElementProps<DateTimePickerProps> {
    type: "date-time-picker"
}

interface FormGroupSearchSelectProps
    extends inputElementProps<SearchSelectProps> {
    type: "search-select"
}

interface FormGroupNumberFieldProps
    extends inputElementProps<NumberFieldProps> {
    type: "number"
}

export interface FormGroupProps<
    T extends Record<string, unknown>,
    TKey extends keyof T
> {
    name: TKey
    form: UseFormValues<T>
    label: string
    input: T[TKey] extends DateType
        ? FormGroupDateTimePickerProps
        : T[TKey] extends number
        ? FormGroupNumberFieldProps
        : T[TKey] extends string
        ? FormGroupTextFieldProps | FormGroupSearchSelectProps
        :
              | FormGroupDateTimePickerProps
              | FormGroupNumberFieldProps
              | FormGroupTextFieldProps
              | FormGroupSearchSelectProps
}

export const FormGroup = <
    T extends Record<string, unknown>,
    TKey extends keyof T
>({
    name,
    label,
    input,
    form,
}: FormGroupProps<T, TKey>) => (
    <Stack direction="column" spacing={1}>
        {input.type === "date-time-picker" ? (
            <DateTimePicker
                {...input}
                name={name as string}
                value={(form.values[name] as DateType) || DateHelper.now()}
                onChange={form.onChange}
                label={label}
            />
        ) : input.type === "search-select" ? (
            <SearchSelect
                {...input}
                name={name as string}
                value={(form.values[name] as string) || ""}
                onChange={form.onChange}
                label={label}
            />
        ) : input.type === "number" ? (
            <NumberField
                {...input}
                value={(form.values[name] as number) || 0}
                onChange={form.onChange}
                label={label}
                name={name as string}
            />
        ) : (
            <TextField
                {...input}
                name={name as string}
                value={(form.values[name] as string) || ""}
                onChange={form.onChange}
                label={label}
            />
        )}
        {form.errors[name] && (
            <Text size={8} color="error">
                {form.errors[name]}
            </Text>
        )}
    </Stack>
)
