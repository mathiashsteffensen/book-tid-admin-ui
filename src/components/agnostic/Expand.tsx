import classNames from "classnames"
import { FC, ReactNode } from "react"

export type DimensionValue = "full" | number | `${number}/${number}`

export interface ExpandProps {
    children: ReactNode
    width?: DimensionValue
    height?: DimensionValue
}

export const Expand: FC<ExpandProps> = ({ children, width, height }) => (
    <div
        className={classNames({
            [`w-${width}`]: width,
            [`h-${height}`]: height,
        })}
    >
        {children}
    </div>
)
