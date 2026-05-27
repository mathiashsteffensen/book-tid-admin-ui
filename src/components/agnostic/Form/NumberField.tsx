import { NumberField as BaseUINumberField } from "@base-ui-components/react/number-field"
import { InputBaseComponentProps, styled } from "@mui/material"
import MUIFormControl from "@mui/material/FormControl"
import MUIInputLabel from "@mui/material/InputLabel"
import MUIOutlinedInput from "@mui/material/OutlinedInput"
import useId from "@mui/utils/useId"
import { FC, forwardRef, useCallback, useEffect, useState } from "react"

import { Stack } from "src/components/agnostic/Stack"
import { Button, ButtonProps } from "src/components/agnostic/buttons/Button"
import { Icon } from "src/components/agnostic/icons/Icon"

const NumberFieldButton = styled(
    Button,
    {}
)<
    ButtonProps & {
        borderBottom?: number
    }
>(({ borderBottom }) => ({
    borderRadius: 0,
    borderTop: 0,
    borderRight: 0,
    borderBottom,
    color: "rgba(255, 255, 255, 0.7)",
    borderColor: "rgba(255, 255, 255, 0.23)",
}))

// eslint-disable-next-line react/display-name
const InputComponent = forwardRef<
    HTMLInputElement,
    InputBaseComponentProps & {
        onIncrement?: () => void
        onDecrement?: () => void
    }
>(({ onIncrement, onDecrement, ...props }, ref) => {
    return (
        <Stack direction="row" alignItems="center">
            <BaseUINumberField.Input ref={ref} {...props} />
            <Stack direction="column">
                <NumberFieldButton
                    onClick={onIncrement}
                    size="small"
                    variant="outlined"
                >
                    <Icon size="small" name="plus" />
                </NumberFieldButton>
                <NumberFieldButton
                    onClick={onDecrement}
                    borderBottom={0}
                    size="small"
                    variant="outlined"
                >
                    <Icon size="small" name="minus" />
                </NumberFieldButton>
            </Stack>
        </Stack>
    )
})

const NumberFieldRoot = styled(BaseUINumberField.Root)<
    Parameters<typeof BaseUINumberField.Root>[0]
>(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
        display: "flex",
        width: "100%",
    },
}))

export interface NumberFieldProps {
    value?: number
    onChange: (value: number | null, name: string) => void
    label: string
    name: string
    incrementBy?: number
    min?: number
    max?: number
}

export const NumberField: FC<NumberFieldProps> = ({
    value,
    onChange,
    label,
    name,
    incrementBy = 1,
    min,
    max,
}) => {
    const inputId = useId()
    const [inputFocused, setInputFocused] = useState(false)

    const emitChange = useCallback(
        (newValue: number | null) => {
            if (min !== undefined && newValue !== null && newValue < min) {
                newValue = min
            } else if (
                max !== undefined &&
                newValue !== null &&
                newValue > max
            ) {
                newValue = max
            }

            onChange(newValue, name)
        },
        [name, onChange, min, max]
    )
    const onIncrement = useCallback(
        () => emitChange((value || 0) + incrementBy),
        [emitChange, value, incrementBy]
    )
    const onDecrement = useCallback(
        () => emitChange((value || 0) - incrementBy),
        [emitChange, value, incrementBy]
    )

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if ((event.target as HTMLInputElement).id === inputId) {
                console.log("onKeyDown", event.key)

                if (event.key === "ArrowUp") {
                    onIncrement()
                } else if (event.key === "ArrowDown") {
                    onDecrement()
                }
            }
        },
        [inputId, onIncrement, onDecrement]
    )

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [onKeyDown])

    return (
        <NumberFieldRoot
            value={value}
            onValueChange={emitChange}
            sx={{
                "& .MuiStack-root": {
                    flexGrow: 1,
                },
            }}
        >
            <Stack direction="row" grow>
                <MUIFormControl sx={{ width: "100%" }}>
                    <MUIInputLabel
                        focused={inputFocused}
                        shrink={inputFocused || value !== null}
                        variant="outlined"
                        htmlFor={name}
                    >
                        {label}
                    </MUIInputLabel>
                    <MUIOutlinedInput
                        label={label}
                        notched={inputFocused || value !== null}
                        inputComponent={InputComponent}
                        inputProps={{
                            id: inputId,
                            onIncrement,
                            onDecrement,
                            onChange: (e) => {
                                const newValue = parseInt(
                                    (e.target as HTMLInputElement).value,
                                    10
                                )
                                emitChange(isNaN(newValue) ? null : newValue)
                            },
                        }}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        value={value}
                    />
                </MUIFormControl>
            </Stack>
        </NumberFieldRoot>
    )
}
