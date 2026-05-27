import { FC, ReactNode } from "react"

import { Paper, PaperProps } from "src/components/agnostic"

export interface ModalContentProps extends Pick<PaperProps, "elevation"> {
    children: ReactNode
}

export const ModalContent: FC<ModalContentProps> = ({ children, ...props }) => (
    <Paper {...props}>{children}</Paper>
)
