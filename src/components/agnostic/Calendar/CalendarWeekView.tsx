import { useTheme } from "@mui/material"
import { useGridApiRef } from "@mui/x-data-grid"
import { useEffect, useMemo } from "react"

import { CalendarGrid } from "src/components/agnostic/Calendar/CalendarGrid"
import { GridColDef } from "src/components/agnostic/DataGrid"
import { Spacer } from "src/components/agnostic/Spacer"
import { Text } from "src/components/agnostic/Text"
import { DateType } from "src/helpers"

import { CalendarItem, useCalendarContext } from "./Calendar"
import styles from "./CalendarWeekView.module.scss"
import {
    getDayOrder,
    getDayStringFromDayIndex,
    renderDayCell,
    useInitialScrollToHour,
} from "./helpers"

export const CalendarWeekView = () => {
    const {
        supportViewType,
        enabledViewType,
        startAt,
        onItemClick,
        items,
        onHourClick,
    } = useCalendarContext()

    useEffect(() => {
        supportViewType("week")
    }, [])

    const gridApi = useGridApiRef()
    useInitialScrollToHour(gridApi, 7, startAt)

    const theme = useTheme()

    const columnDefinitions: Array<
        GridColDef<
            { id: number },
            {
                items: Array<CalendarItem>
                date: DateType
            }
        >
    > = useMemo(
        () =>
            getDayOrder().map((dayIndex) => ({
                type: "custom",
                field: getDayStringFromDayIndex(dayIndex),
                flex: 1,
                headerClassName: styles.dayHeaderCell,
                headerAlign: "center",
                renderHeader: () => (
                    <>
                        <Text size={9}>
                            {getDayStringFromDayIndex(dayIndex)}
                        </Text>
                        <div className={styles.topRight}>
                            <Spacer top={1} right={1}>
                                <Text size={10} color="primary">
                                    {startAt
                                        .startOf(enabledViewType)
                                        .isoWeekday(dayIndex)
                                        .format("DD/MM")}
                                </Text>
                            </Spacer>
                        </div>
                    </>
                ),
                valueGetter: () => {
                    const cellDate = startAt.set("day", dayIndex)

                    return {
                        items: items.filter((item) =>
                            item.startAt.isSame(cellDate, "day")
                        ),
                        date: cellDate,
                    }
                },
                cellClassName: styles.cell,
                renderCell: (params) =>
                    params.value
                        ? renderDayCell({
                              ...params.value,
                              theme,
                              onItemClick,
                              onHourClick,
                          })
                        : null,
            })),
        [enabledViewType, startAt, items]
    )

    if (enabledViewType !== "week") {
        return null
    }

    return (
        <CalendarGrid
            apiRef={gridApi}
            columns={columnDefinitions}
            rowHeight={600}
            rows={[{ id: 1 }]}
            getRowClassName={() => styles.row}
            className={styles.grid}
        />
    )
}
