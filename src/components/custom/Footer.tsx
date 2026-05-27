import dayjs from "dayjs"

import { Box, Stack, Text, Spacer } from "src/components/agnostic"

export const Footer = () => {
    return (
        <Box component="footer">
            <Spacer all={5}>
                <Stack alignItems="center">
                    <Text size={8}>BOOKTID.NET © {dayjs().year()}</Text>
                </Stack>
            </Spacer>
        </Box>
    )
}
