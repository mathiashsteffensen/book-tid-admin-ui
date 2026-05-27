import { SxProps, Typography, TypographyProps, useTheme } from "@mui/material"
import { FC, ReactNode } from "react"

import { StringHelper } from "src/helpers"

export const SizeMapping = {
    1: "2rem",
    2: "1.875rem",
    3: "1.75rem",
    4: "1.625rem",
    5: "1.5rem",
    6: "1.25rem",
    7: "1rem",
    8: "0.875rem",
    9: "0.75rem",
    10: "0.625rem",
    11: "0.5rem",
}

export interface TextProps
    extends Pick<
        TypographyProps,
        "align" | "color" | "component" | "fontWeight" | "sx"
    > {
    size?: keyof typeof SizeMapping
    inline?: boolean
    titleize?: boolean
    children: ReactNode
}

export const Text: FC<TextProps> = ({
    size = 7,
    align,
    color = "white",
    children,
    inline,
    titleize,
    sx,
    ...props
}) => {
    const theme = useTheme()

    const inlineStyles: SxProps = inline ? { display: "inline-block" } : {}
    const transformStyles: SxProps = titleize
        ? { textTransform: "capitalize" }
        : {}

    if (typeof children === "string") {
        children = StringHelper.toHumanReadable(children)
    }

    return (
        <Typography
            sx={{ ...inlineStyles, ...transformStyles, ...sx }}
            fontSize={SizeMapping[size]}
            align={align}
            color={color === "white" ? theme.palette.common.white : color}
            {...props}
        >
            {children}
        </Typography>
    )
}
