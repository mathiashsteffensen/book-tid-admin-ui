import MUIButton, { ButtonProps as MUIButtonProps } from "@mui/material/Button"
import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react"

import { Spacer } from "src/components/agnostic/Spacer"
import { Spinner } from "src/components/agnostic/Spinner"

import { ButtonIcon } from "../icons/ButtonIcon"
import { IconProps } from "../icons/Icon"

export interface ButtonProps
    extends Pick<
        MUIButtonProps,
        | "size"
        | "variant"
        | "color"
        | "type"
        | "onClick"
        | "disabled"
        | "component"
        | "href"
    > {
    icon?: IconProps["name"]
    grow?: boolean
    loading?: boolean
    children: ReactNode
}

export type ButtonRef = HTMLButtonElement

const ButtonComponent: ForwardRefRenderFunction<ButtonRef, ButtonProps> = (
    {
        children,
        icon,
        grow,
        color = "inherit",
        variant = "outlined",
        loading,
        ...props
    },
    ref
) => (
    <MUIButton
        {...props}
        sx={
            grow
                ? {
                      flexGrow: 1,
                      width: "100%",
                  }
                : {}
        }
        variant={variant}
        color={color}
        ref={ref}
    >
        {loading ? (
            <Spacer right={2}>
                <Spinner />
            </Spacer>
        ) : (
            icon && <ButtonIcon name={icon} />
        )}
        {children}
    </MUIButton>
)

export const Button = forwardRef(ButtonComponent)
