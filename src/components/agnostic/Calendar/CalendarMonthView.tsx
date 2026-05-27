import { SxProps } from "@mui/material"
import { range } from "lodash"
import { useEffect, useMemo } from "react"

import {
    useCalendarContext,
    GridColDef,
    Text,
    CalendarItem,
    Stack,
    Box,
    Spacer,
    CalendarContextType,
} from "src/components/agnostic"
import { CalendarGrid } from "src/components/agnostic/Calendar/CalendarGrid"
import {
    getDayOrder,
    getDayStringFromDayIndex,
} from "src/components/agnostic/Calendar/helpers"
import { DateType } from "src/helpers"

import styles from "./CalendarMonthView.module.css"

const getWeekNumbersToDisplay = (
    startAt: DateType,
    endAt: DateType
): Array<number> => {
    const startWeek = startAt.isoWeek()
    const endWeek = endAt.isoWeek()
    return range(startWeek, endWeek + 1)
}

const rowValueGetter = (
    dayIndex: number,
    startAt: DateType,
    items: Array<CalendarItem>
) => (_: unknown, row: { id: number }) => {
    const cellDate = startAt.isoWeek(row.id).set("day", dayIndex)

    if (cellDate.month() !== startAt.month()) {
        return {
            items: [],
            inMonth: false,
            date: cellDate,
        }
    }

    return {
        items: items.filter(
            (item) =>
                item.startAt.isoWeekday() === dayIndex &&
                item.startAt.isoWeek() === row.id
        ),
        inMonth: true,
        date: cellDate,
    }
}

const Cell = ({
    items,
    date,
    onItemClick,
    onHourClick,
}: { items: Array<CalendarItem>; date: DateType } & Pick<
    CalendarContextType<CalendarItem>,
    "onItemClick" | "onHourClick"
>) => {
    const heightHack: SxProps = {
        minHeight: "25px !important",
    }

    const nextAppointmentStartAt =
        items.length > 0
            ? items.reduce((acc, item) =>
                  acc.startAt.isAfter(item.startAt) ? acc : item
              ).startAt
            : date.set("hour", 8)

    return (
        <Stack
            direction="column"
            sx={{
                minHeight: "100px !important",
            }}
            onClick={() => onHourClick?.(nextAppointmentStartAt)}
        >
            <div
                style={{
                    position: "fixed",
                    marginTop: "4px",
                }}
            >
                <Spacer bottom={1}>
                    <Text size={10}>{date.format("DD")}</Text>
                </Spacer>
            </div>

            <div style={{ marginTop: "18px" }}>
                {items.map((item) => (
                    <Box
                        key={item.id}
                        color={
                            typeof item.color === "string"
                                ? item.color
                                : `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})`
                        }
                        sx={{
                            ...heightHack,
                            margin: "2px 0",
                            padding: "0 8px",
                            borderRadius: "4px",
                        }}
                    >
                        <Stack
                            sx={{
                                ...heightHack,
                                overflow: "hidden",
                                ...(onItemClick ? { cursor: "pointer" } : {}),
                            }}
                            direction="row"
                            alignItems="center"
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                onItemClick?.(item)
                            }}
                        >
                            <Text size={9} align="center" sx={heightHack}>
                                {item.title}
                            </Text>
                        </Stack>
                    </Box>
                ))}
            </div>
        </Stack>
    )
}

export const CalendarMonthView = () => {
    const {
        supportViewType,
        enabledViewType,
        items,
        onItemClick,
        startAt,
        endAt,
        onHourClick,
    } = useCalendarContext()

    useEffect(() => {
        supportViewType("month")
    }, [])

    const weekNumbers = useMemo(() => getWeekNumbersToDisplay(startAt, endAt), [
        startAt,
        endAt,
    ])

    const getDayColumnDefinition = (
        dayIndex: number
    ): GridColDef<
        { id: number },
        {
            items: Array<CalendarItem>
            inMonth: boolean
            date: DateType
        }
    > => ({
        field: getDayStringFromDayIndex(dayIndex),
        headerAlign: "center",
        renderHeader: () => (
            <Text size={9}>{getDayStringFromDayIndex(dayIndex)}</Text>
        ),
        flex: 1,
        valueGetter: rowValueGetter(dayIndex, startAt, items),
        cellClassName: (params) =>
            !params.value!.inMonth ? styles.outMonthCell : styles.inMonthCell,
        renderCell: (params) => (
            <Cell
                {...params.value!}
                onItemClick={onItemClick}
                onHourClick={onHourClick}
            />
        ),
    })

    const columnDefinitions: Array<GridColDef> = useMemo(
        () => [
            {
                field: "weekHeader",
                headerName: "",
                valueGetter: () => "Week",
                headerClassName: styles.weekHeaderCell,
                cellClassName: styles.weekHeaderCell,
                minWidth: 30,
                width: 30,
                renderCell: () => (
                    <Text size={9} align="center">
                        Week
                    </Text>
                ),
            },
            {
                field: "weekNumber",
                headerName: "",
                valueGetter: () => ({
                    items: [],
                    inMonth: true,
                    date: startAt,
                }),
                headerClassName: styles.weekNumberCell,
                cellClassName: styles.weekNumberCell,
                minWidth: 30,
                width: 30,
                renderCell: (params) => (
                    <Stack direction="column" justifyContent="center" grow>
                        <Text size={9} align="center">
                            {params.row.id}
                        </Text>
                    </Stack>
                ),
            },
            ...getDayOrder().map(getDayColumnDefinition),
        ],
        [items]
    )

    if (enabledViewType !== "month") {
        return null
    }

    return (
        <CalendarGrid
            columns={columnDefinitions}
            rows={weekNumbers.map((weekNumber) => ({
                id: weekNumber,
            }))}
            rowHeight={100}
        />
    )
}
