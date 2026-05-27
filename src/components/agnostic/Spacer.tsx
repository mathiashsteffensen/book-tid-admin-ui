import className from "classnames"
import { ReactNode, FC } from "react"

export type SpacerSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface ResponsiveSpacerSize {
    xs: SpacerSize
    sm: SpacerSize
    md: SpacerSize
    lg: SpacerSize
    xl: SpacerSize
}

export interface SpacerProps {
    children?: ReactNode

    top?: SpacerSize | ResponsiveSpacerSize
    bottom?: SpacerSize | ResponsiveSpacerSize
    left?: SpacerSize | ResponsiveSpacerSize
    right?: SpacerSize | ResponsiveSpacerSize
    vertical?: SpacerSize | ResponsiveSpacerSize
    horizontal?: SpacerSize | ResponsiveSpacerSize
    all?: SpacerSize | ResponsiveSpacerSize
}

const ClassDirectionPrefixes: Record<
    keyof Omit<SpacerProps, "children">,
    string
> = {
    top: "t",
    bottom: "b",
    left: "l",
    right: "r",
    horizontal: "x",
    vertical: "y",
    all: "",
}

export const Spacer: FC<SpacerProps> = ({ children, ...props }) => {
    const classes = className(
        ...Object.entries(props).map(
            ([key, spacerSize]) =>
                `p${ClassDirectionPrefixes[key]}-${spacerSize}`
        )
    )

    return <div className={classes}>{children}</div>
}
