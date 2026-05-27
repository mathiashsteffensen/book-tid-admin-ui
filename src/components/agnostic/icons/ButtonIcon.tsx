import { FC } from "react"

import { Spacer } from "src/components/agnostic/Spacer"

import { Icon, IconProps } from "./Icon"

export type ButtonIconProps = IconProps

export const ButtonIcon: FC<ButtonIconProps> = (props) => (
    <Spacer right={2} bottom={1}>
        <Icon {...props} />
    </Spacer>
)
