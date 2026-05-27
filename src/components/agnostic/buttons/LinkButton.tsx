import Link from "next/link"
import { FC, forwardRef } from "react"

import {
    Button,
    ButtonProps,
    ButtonRef,
} from "src/components/agnostic/buttons/Button"

export type LinkButtonProps = Omit<ButtonProps, "component">

// eslint-disable-next-line react/display-name
export const LinkButton: FC<LinkButtonProps> = forwardRef<
    ButtonRef,
    LinkButtonProps
>(({ children, ...props }, ref) => (
    <Button ref={ref} {...props} component={Link}>
        {children}
    </Button>
))
