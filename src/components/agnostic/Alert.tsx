import MUIAlert, { AlertProps as MUIAlertProps } from "@mui/material/Alert"
import { FC } from "react"

export type AlertProps = MUIAlertProps

export const Alert: FC<AlertProps> = ({ children, ...props }) => {
    return <MUIAlert {...props}>{children}</MUIAlert>
}
