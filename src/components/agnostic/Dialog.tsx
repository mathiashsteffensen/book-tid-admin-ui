import MUIDialog, { DialogProps as MUIDialogProps } from "@mui/material/Dialog"
import { FC } from "react"

export type DialogProps = MUIDialogProps

export const Dialog: FC<DialogProps> = ({ children, ...props }) => {
    return <MUIDialog {...props}>{children}</MUIDialog>
}
