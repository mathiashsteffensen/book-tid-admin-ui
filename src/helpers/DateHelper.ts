import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import weekOfYear from "dayjs/plugin/weekOfYear"
import "dayjs/locale/da"
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.locale("da")

export type DateType = dayjs.Dayjs

export class DateHelper {
    static new(date: Date | string | number | DateType): DateType {
        return dayjs.utc(date)
    }

    static now(): DateType {
        return dayjs.utc()
    }

    static add(
        date: DateType,
        amount: number,
        unit: dayjs.OpUnitType
    ): DateType {
        return date.add(amount, unit)
    }

    static subtract(
        date: DateType,
        amount: number,
        unit: dayjs.OpUnitType
    ): DateType {
        return date.subtract(amount, unit)
    }
}
