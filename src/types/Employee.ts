import { Model } from "src/types"

export type TimeOfDay = {
    hour: number
    minute: number
}

export type ScheduleInterval = {
    start: TimeOfDay
    end: TimeOfDay
}

export type DailySchedule = {
    open: boolean
    work: ScheduleInterval
    break: ScheduleInterval
}

export type WeeklySchedule = [
    DailySchedule,
    DailySchedule,
    DailySchedule,
    DailySchedule,
    DailySchedule,
    DailySchedule,
    DailySchedule
]

export type BiWeeklySchedule = {
    even: WeeklySchedule
    odd: WeeklySchedule
}

export type SpecialWeekSchedule = {
    year: number
    week: number
    schedule: WeeklySchedule
}

export enum ScheduleType {
    Weekly = "weekly",
    BiWeekly = "bi-weekly",
}

export type Schedule = {
    scheduleType: ScheduleType
    weekly: WeeklySchedule
    biWeekly: BiWeeklySchedule
    specialWeeks: Array<SpecialWeekSchedule>
    holidaysOff: boolean
}

export type Employee = Model & {
    id: string
    schedule: Schedule
}
