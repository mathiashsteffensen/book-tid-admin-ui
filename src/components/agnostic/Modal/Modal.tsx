import MUIModal, { ModalProps as MUIModalProps } from "@mui/material/Modal"
import _ from "lodash"
import { FC, ReactNode } from "react"

import { Container, ContainerProps, Stack } from "src/components/agnostic"

import { ModalContent } from "./Content"
import { ModalHeader } from "./Header"

export interface ModalProps extends Pick<MUIModalProps, "open" | "onClose"> {
    children: ReactNode
    size: ContainerProps["size"]
}

const _Modal: FC<ModalProps> = ({ children, size, ...props }) => (
    <MUIModal {...props}>
        <Stack
            onClick={(e) => props.onClose?.(e, "backdropClick")}
            justifyContent="center"
            alignItems="center"
            fullHeight
        >
            <Container
                onClick={(e) => {
                    e.stopPropagation()
                }}
                size={size}
            >
                {children}
            </Container>
        </Stack>
    </MUIModal>
)

export const Modal = _.merge(_Modal, {
    Header: ModalHeader,
    Content: ModalContent,
})
