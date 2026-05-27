import { MenuItem, Select } from "@mui/material"

import {
    CalendarViewType,
    Pagination,
    Spacer,
    Stack,
    Text,
} from "src/components/agnostic"
import { DateType } from "src/helpers"

import { useCalendarContext } from "./Calendar"

const renderDateRangeHeader = (
    viewType: CalendarViewType,
    startAt: DateType,
    endAt: DateType
) => {
    switch (viewType) {
        case "month":
            return <Text titleize>{startAt.format("MMMM YYYY")}</Text>
        case "week":
            return (
                <Stack direction="column" spacing={1} alignItems="center">
                    <Text align="center">Week {startAt.format("W, YYYY")}</Text>

                    <Stack direction="row" alignItems="center">
                        <Text
                            align="center"
                            size={9}
                            color="textDisabled"
                        >{`${startAt.format("MMM D")} - ${endAt.format(
                            "MMM D"
                        )}`}</Text>
                    </Stack>
                </Stack>
            )
        default:
            return null
    }
}

export const CalendarTopBar = () => {
    const {
        goForwards,
        goBackwards,
        startAt,
        endAt,
        supportedViewTypes,
        setEnabledViewType,
        enabledViewType,
    } = useCalendarContext()

    return (
        <Spacer bottom={2}>
            <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
            >
                <Select
                    value={enabledViewType}
                    onChange={(e) =>
                        setEnabledViewType(e.target.value as CalendarViewType)
                    }
                    variant="outlined"
                >
                    {Array.from(supportedViewTypes).map((viewType) => (
                        <MenuItem key={viewType} value={viewType}>
                            {viewType}
                        </MenuItem>
                    ))}
                </Select>

                <Stack direction="column">
                    {renderDateRangeHeader(enabledViewType, startAt, endAt)}
                </Stack>

                <Pagination next={goForwards} previous={goBackwards} />
            </Stack>
        </Spacer>
    )
}
