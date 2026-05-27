import { AlertColor, AlertPropsColorOverrides } from "@mui/material/Alert/Alert"
import MUISnackbar, {
    SnackbarProps as MUISnackbarProps,
} from "@mui/material/Snackbar"
import { OverridableStringUnion } from "@mui/types"
import { FC } from "react"

import { Alert } from "./Alert"

export type AlertSnackbarProps = {
    severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>
    onClose?: () => void
}

export type RegularSnackbarProps = {
    severity?: never
    onClose?: MUISnackbarProps["onClose"]
}

export type ToastProps = Omit<MUISnackbarProps, "onClose"> &
    (AlertSnackbarProps | RegularSnackbarProps)

export const Toast: FC<ToastProps> = ({ children, ...props }) => {
    return (
        <MUISnackbar message={!props.severity && children} {...props}>
            <div>
                {props.severity ? (
                    <Alert
                        onClose={props.onClose}
                        variant="filled"
                        sx={{ width: "100%" }}
                        severity={props.severity}
                    >
                        {children}
                    </Alert>
                ) : (
                    children
                )}
            </div>
        </MUISnackbar>
    )
}
