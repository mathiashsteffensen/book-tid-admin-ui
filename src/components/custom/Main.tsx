import { FC, ReactNode } from "react"

import {
    Container,
    ContainerProps,
    ResponsiveDisplay,
    Spacer,
    Stack,
    Text,
} from "src/components/agnostic"

export interface MainProps {
    title?: string
    subtitle?: string
    CTAs?: ReactNode
    children: ReactNode
    size?: ContainerProps["size"]
    sidebar?: true
}

export const Main: FC<MainProps> = ({
    title,
    subtitle,
    CTAs,
    children,
    size = "lg",
    sidebar,
}) => (
    <main className="flex flex-grow-1 justify-center">
        <Container size={size}>
            <Spacer vertical={6}>
                <Stack direction="column">
                    <ResponsiveDisplay
                        xs="block"
                        md={sidebar ? "none" : "block"}
                    >
                        {title && (
                            <Spacer bottom={8}>
                                <Stack
                                    direction={{ xs: "column", md: "row" }}
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack direction="column">
                                        <Text size={1}>{title}</Text>

                                        <Text size={4}>{subtitle}</Text>
                                    </Stack>

                                    <Stack direction="row" spacing={2}>
                                        {CTAs}
                                    </Stack>
                                </Stack>
                            </Spacer>
                        )}
                    </ResponsiveDisplay>

                    {children}
                </Stack>
            </Spacer>
        </Container>
    </main>
)
