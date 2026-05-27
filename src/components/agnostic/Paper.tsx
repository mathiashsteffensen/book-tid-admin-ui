import MUIPaper, { PaperProps as MUIPaperProps } from "@mui/material/Paper"
import { FC, ReactNode } from "react"

import { Spacer } from "src/components/agnostic/Spacer"

export interface PaperProps
    extends Pick<
        MUIPaperProps,
        "variant" | "square" | "elevation" | "onClick"
    > {
    children: ReactNode
}

export const Paper: FC<PaperProps> = ({ children, onClick, ...props }) => {
    return (
        <MUIPaper
            onClick={onClick}
            style={onClick ? { cursor: "pointer" } : {}}
            role={onClick ? "button" : undefined}
            {...props}
        >
            <Spacer all={5}>{children}</Spacer>
        </MUIPaper>
    )
}
