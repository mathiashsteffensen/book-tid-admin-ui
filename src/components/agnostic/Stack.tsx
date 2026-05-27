import MUIStack, { StackProps as MUIStackProps } from "@mui/material/Stack"
import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react"

export interface StackProps
    extends Pick<
        MUIStackProps,
        | "justifyContent"
        | "alignItems"
        | "direction"
        | "spacing"
        | "onClick"
        | "sx"
    > {
    grow?: boolean
    fullHeight?: boolean
    children: ReactNode
}

const _Stack: ForwardRefRenderFunction<HTMLDivElement, StackProps> = (
    { children, grow, fullHeight, ...props },
    ref
) => {
    return (
        <MUIStack
            ref={ref}
            component="div"
            useFlexGap
            sx={{
                height: fullHeight ? "100%" : undefined,
            }}
            flexGrow={grow ? 1 : 0}
            {...props}
        >
            {children}
        </MUIStack>
    )
}

export const Stack = forwardRef(_Stack)
