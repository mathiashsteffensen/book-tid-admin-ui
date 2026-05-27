import AppBar from "@mui/material/AppBar"
import Link from "next/link"
import { FC } from "react"

import { Icon, Spacer, Text, Stack } from "src/components/agnostic"
import { PathHelper } from "src/helpers"

export interface AltHeaderProps {
    showBackLink?: boolean
}

export const AltHeader: FC<AltHeaderProps> = ({ showBackLink = false }) => (
    <AppBar position="static">
        <Spacer vertical={3} horizontal={8}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                {showBackLink && (
                    <Link
                        href={PathHelper.calendarPath}
                        className="flex justify-center items-center"
                    >
                        <Icon name="arrowBackward" />
                        <Text size={4}>Tilbage til min kalender</Text>
                    </Link>
                )}

                <Stack direction="column">
                    <Link href="/">
                        <Text size={1}>BOOKTID.NET</Text>
                    </Link>

                    <Text size={6} color="textDisabled">
                        ONLINE BOOKINGSYSTEM
                    </Text>
                </Stack>

                <Icon size="large" color="primary" name="calendar" />
            </Stack>
        </Spacer>
    </AppBar>
)
