import { Property } from "csstype"
import { FC, ReactNode } from "react"

import { Box } from "./Box"

export type ResponsiveDisplayProps = {
    [key in "xs" | "sm" | "md" | "lg" | "xl"]?: Property.Display
} & {
    children: ReactNode
}

export const ResponsiveDisplay: FC<ResponsiveDisplayProps> = ({
    children,
    ...display
}) => <Box sx={{ display }}>{children}</Box>
