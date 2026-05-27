import { merge } from "lodash"
import {
    createContext,
    forwardRef,
    ForwardRefRenderFunction,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from "react"

import {
    Container,
    Paper,
    Spacer,
    Spinner,
    Stack,
} from "src/components/agnostic"
import { CalendarWeekView } from "src/components/agnostic/Calendar/CalendarWeekView"
import { DateHelper, DateType } from "src/helpers"
import { dateTransform, useAsyncLazy, useQueryState } from "src/hooks"

import { CalendarMonthView } from "./CalendarMonthView"
import { CalendarTopBar } from "./CalendarTopBar"

export type CalendarViewType = "day" | "week" | "month"

export const isCalendarViewType = (value: unknown): value is CalendarViewType =>
    ["day", "week", "month"].includes(value as string)

export interface CalendarContextType<TItem extends CalendarItem> {
    startAt: DateType
    endAt: DateType
    goForwards: () => void
    goBackwards: () => void
    items: Array<TItem>
    onItemClick?: (item: TItem) => void
    onHourClick?: (date: DateType) => void
    error?: unknown
    loading?: boolean
    supportedViewTypes: Set<CalendarViewType>
    supportViewType: (viewType: CalendarViewType) => void
    enabledViewType: CalendarViewType
    setEnabledViewType: (viewType: CalendarViewType) => void
}

const CalendarContext = createContext<CalendarContextType<CalendarItem>>({
    startAt: DateHelper.now(),
    endAt: DateHelper.now(),
    goForwards: () => {},
    goBackwards: () => {},
    items: [],
    supportedViewTypes: new Set(),
    supportViewType: () => {},
    enabledViewType: "month",
    setEnabledViewType: () => {},
})

export const useCalendarContext = () => useContext(CalendarContext)

export interface CalendarItem {
    id: string
    startAt: DateType
    endAt: DateType
    title: string
    color: string | { r: number; g: number; b: number }
}

export interface CalendarProps {
    ready?: boolean
    fetchItems: (
        startAt: DateType,
        endAt: DateType
    ) => Promise<Array<CalendarItem>>
    children: ReactNode
    defaultViewType?: CalendarViewType
    supportedViewTypes?: Array<CalendarViewType>
    onItemClick?: (item: CalendarItem) => void
    onHourClick?: (date: DateType) => void
}

export interface CalendarRef {
    refreshItems: () => void
}

export const CalendarComponent: ForwardRefRenderFunction<
    CalendarRef,
    CalendarProps
> = (
    {
        ready = true,
        fetchItems,
        children,
        onItemClick,
        onHourClick,
        defaultViewType = "month",
        supportedViewTypes: defaultSupportedViewTypes = [],
    },
    ref
) => {
    const [
        enabledViewType,
        setEnabledViewType,
    ] = useQueryState<CalendarViewType>("view_type", defaultViewType, {
        toUrl: (value) => value,
        fromUrl: (value) =>
            isCalendarViewType(value) ? value : defaultViewType,
    })
    const [supportedViewTypes, setSupportedViewTypes] = useState<
        Set<CalendarViewType>
    >(new Set(defaultSupportedViewTypes))

    const [dateRangeStartAt, setDateRangeStartAt] = useQueryState(
        "date",
        DateHelper.now().startOf(enabledViewType),
        dateTransform
    )
    const dateRange = useMemo(() => {
        const startAt = dateRangeStartAt.startOf(enabledViewType)

        return {
            startAt,
            endAt: startAt.add(1, enabledViewType),
        }
    }, [dateRangeStartAt, enabledViewType])
    const {
        data: items,
        error,
        loading,
        execute: fetchItemsAsync,
    } = useAsyncLazy(fetchItems)

    const refreshItems = () =>
        fetchItemsAsync(dateRange.startAt, dateRange.endAt)

    useEffect(() => {
        if (ready) {
            refreshItems()
        }
    }, [dateRange.startAt, dateRange.endAt, ready])

    const goForwards = useCallback(() => {
        setDateRangeStartAt(
            DateHelper.add(dateRange.startAt, 1, enabledViewType)
        )
    }, [dateRange.startAt, enabledViewType])

    const goBackwards = useCallback(() => {
        setDateRangeStartAt(
            DateHelper.subtract(dateRange.startAt, 1, enabledViewType)
        )
    }, [dateRange.startAt, enabledViewType])

    const supportViewType = useCallback(
        (viewType: CalendarViewType) => {
            if (!enabledViewType) {
                setEnabledViewType(viewType)
            }
            setSupportedViewTypes(supportedViewTypes.add(viewType))
        },
        [enabledViewType, supportedViewTypes]
    )

    useImperativeHandle(
        ref,
        () => ({
            refreshItems,
        }),
        [dateRange.startAt, dateRange.endAt]
    )

    return (
        <CalendarContext.Provider
            value={{
                ...dateRange,
                goForwards,
                goBackwards,
                items: items || [],
                onItemClick,
                onHourClick,
                error,
                loading,
                supportedViewTypes,
                supportViewType,
                enabledViewType,
                setEnabledViewType,
            }}
        >
            <Container>
                <Paper>
                    {children}

                    {loading && (
                        <Stack justifyContent="center" alignItems="center">
                            <Spacer all={12}>
                                <Spinner />
                            </Spacer>
                        </Stack>
                    )}
                </Paper>
            </Container>
        </CalendarContext.Provider>
    )
}

export const Calendar = merge(forwardRef(CalendarComponent), {
    TopBar: CalendarTopBar,
    MonthView: CalendarMonthView,
    WeekView: CalendarWeekView,
})
