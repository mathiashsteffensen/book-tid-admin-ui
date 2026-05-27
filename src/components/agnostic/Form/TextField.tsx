import { styled, useTheme } from "@mui/material"
import MUITextField, {
    TextFieldProps as MUITextFieldProps,
} from "@mui/material/TextField"
import { ChangeEventHandler, FC, useState } from "react"

import { Text } from "src/components/agnostic"

export interface TextFieldProps
    extends Pick<
        MUITextFieldProps,
        "name" | "value" | "multiline" | "type" | "required" | "autoComplete"
    > {
    children?: never
    label?: string
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

const StyledMUITextField = styled(MUITextField)(() => ({
    backgroundColor: "transparent",
    boxShadow: "none",
}))

export const TextField: FC<TextFieldProps> = ({ label, ...props }) => {
    const [focused, setFocused] = useState(false)

    const theme = useTheme()

    return (
        <StyledMUITextField
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            label={
                <Text color={focused ? "primary" : "white"} inline size={8}>
                    {label}
                </Text>
            }
            inputProps={{
                sx: {
                    "&:-webkit-autofill, &:-internal-autofill-selected": {
                        boxShadow: `0 0 0 100px ${theme.palette.grey["700"]} inset`,
                    },
                },
            }}
            {...props}
        />
    )
}
