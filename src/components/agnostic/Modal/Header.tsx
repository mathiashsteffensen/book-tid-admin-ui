import { FC, ReactNode } from "react"

import { Spacer, Stack } from "src/components/agnostic"

export interface ModalHeaderProps {
    children: ReactNode
}

export const ModalHeader: FC<ModalHeaderProps> = ({ children }) => (
    <Spacer bottom={4}>
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            {children}
        </Stack>
    </Spacer>
)
