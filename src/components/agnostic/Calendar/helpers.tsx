import { Divider, Theme } from "@mui/material"
import { useGridApiRef } from "@mui/x-data-grid"
import { range } from "lodash"
import { Fragment, useEffect } from "react"

import { Box } from "src/components/agnostic/Box"
import {
    CalendarContextType,
    CalendarItem,
} from "src/components/agnostic/Calendar/Calendar"
import { Spacer } from "src/components/agnostic/Spacer"
import { Stack } from "src/components/agnostic/Stack"
import { Text } from "src/components/agnostic/Text"
import { DateType } from "src/helpers"

const DEFAULT_DAY_ORDER = [1, 2, 3, 4, 5, 6, 7]

export const getDayOrder = () => DEFAULT_DAY_ORDER

export const getDayStringFromDayIndex = (dayIndex: number): string => {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    return days[dayIndex]
}

const hourSpacing = 11.25
const hourHeight = 40
const pxPerHour = hourSpacing + hourHeight

export const useInitialScrollToHour = (
    gridApi: ReturnType<typeof useGridApiRef>,
    hour: number,
    startAt: DateType
) => {
    useEffect(() => {
        const id = setTimeout(
            () =>
                gridApi.current?.scroll?.({
                    top: hour * pxPerHour - hourSpacing / 2,
                }),
            100
        )

        return () => clearTimeout(id)
    }, [startAt])
}

export const renderDayCell = ({
    items,
    date,
    theme,
    onItemClick,
    onHourClick,
}: {
    theme: Theme
    items: Array<CalendarItem>
    date: DateType
} & Pick<CalendarContextType<CalendarItem>, "onItemClick" | "onHourClick">) => (
    <Stack
        sx={{
            position: "relative",
            paddingTop: `${hourSpacing / 2}px`,
            paddingBottom: `${hourSpacing / 2}px`,
        }}
    >
        {items.map((item) => (
            <div
                key={item.id}
                style={{
                    width: "100%",
                    display: "flex",
                    borderRadius: "2px",
                    overflow: "hidden",
                    position: "absolute",
                    border: `1px solid ${theme.palette.primary.light}`,
                    top:
                        (item.startAt.hour() + item.startAt.minute() / 60) *
                        pxPerHour,
                    height: `${
                        (item.endAt.hour() +
                            item.endAt.minute() / 60 -
                            item.startAt.hour() -
                            item.startAt.minute() / 60) *
                        pxPerHour
                    }px`,
                    ...(onItemClick ? { cursor: "pointer" } : {}),
                }}
                onClick={() => onItemClick?.(item)}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        backgroundColor:
                            typeof item.color === "string"
                                ? item.color
                                : `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, 0.6)`,
                    }}
                >
                    <Spacer all={1}>
                        <Text size={10}>{item.title}</Text>
                    </Spacer>
                </Box>
            </div>
        ))}

        {range(1, 25).map((hour) => (
            <Fragment key={hour}>
                <div
                    style={{
                        height: "40px",
                        ...(onHourClick ? { cursor: "pointer" } : {}),
                    }}
                    onClick={() =>
                        onHourClick?.(
                            date.set("hour", hour - 1).set("minute", 0)
                        )
                    }
                ></div>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        zIndex: 10,
                        ...(onHourClick ? { cursor: "pointer" } : {}),
                    }}
                    onClick={() =>
                        onHourClick?.(date.set("hour", hour).set("minute", 0))
                    }
                >
                    <Spacer horizontal={1}>
                        <Text size={11} color="textDisabled">
                            {hour.toString().padStart(2, "0")}
                            :00
                        </Text>
                    </Spacer>
                    <Stack grow>
                        <Divider flexItem />
                    </Stack>
                </Stack>
            </Fragment>
        ))}
    </Stack>
)
