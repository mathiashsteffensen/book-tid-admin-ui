import {
    DateTimePicker as MUIDateTimePicker,
    DateTimePickerProps as MUIDateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker"
import { FC } from "react"

import { DateType } from "src/helpers"

export interface DateTimePickerProps
    extends Omit<MUIDateTimePickerProps<DateType>, "onChange" | "name"> {
    onChange: (value: DateType | null, name: string) => void
    name: string
}

export const DateTimePicker: FC<DateTimePickerProps> = ({
    onChange,
    ...props
}) => (
    <MUIDateTimePicker
        onChange={(value) => onChange(value, props.name)}
        {...props}
    />
)
