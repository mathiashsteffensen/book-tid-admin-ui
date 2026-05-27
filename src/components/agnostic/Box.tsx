import MUIBox, { BoxProps as MUIBoxProps } from "@mui/material/Box"
import { ElementType, ReactNode } from "react"

export type BoxProps = Pick<MUIBoxProps, "color" | "sx"> & {
    children: ReactNode
    component?: ElementType
}

export const Box = ({ children, color, sx, ...props }: BoxProps) => (
    <MUIBox sx={{ bgcolor: color, ...sx }} {...props}>
        {children}
    </MUIBox>
)
