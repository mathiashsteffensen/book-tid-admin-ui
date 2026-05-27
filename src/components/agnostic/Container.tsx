import MUIContainer, {
    ContainerProps as MUIContainerProps,
} from "@mui/material/Container"
import { ReactNode, FC } from "react"

export interface ContainerProps extends Pick<MUIContainerProps, "onClick"> {
    children: ReactNode
    size?: MUIContainerProps["maxWidth"]
}

export const Container: FC<ContainerProps> = ({ children, size, ...props }) => (
    <MUIContainer maxWidth={size} {...props}>
        {children}
    </MUIContainer>
)
