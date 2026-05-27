import { FC } from "react"

import { Stack } from "./Stack"
import { Button, ButtonProps } from "./buttons/Button"
import { Icon } from "./icons/Icon"

export type PaginationProps = {
    next: () => void
    previous: () => void
    disableNext?: boolean
    disablePrevious?: boolean
} & Omit<ButtonProps, "disabled" | "onClick" | "children" | "size" | "variant">

export const Pagination: FC<PaginationProps> = ({
    next,
    previous,
    disableNext,
    disablePrevious,
    ...buttonProps
}) => {
    return (
        <Stack direction="row" spacing={2}>
            <Button
                {...buttonProps}
                disabled={disablePrevious}
                onClick={previous}
                size="small"
                variant="text"
            >
                <Icon name="arrowBackward" />
            </Button>

            <Button
                {...buttonProps}
                disabled={disableNext}
                onClick={next}
                size="small"
                variant="text"
            >
                <Icon name="arrowForward" />
            </Button>
        </Stack>
    )
}
