export interface App {
    name: string,
    description: string,
    id: string,
    icon: string,
    activated: boolean,
    settings: Array<{
        id: string,
        name: string,
        description: string,
        type: 'select' | 'switch' | string,
        options?: Array<{
            value: string,
            name: string
        }> | 'timeOfDay' | string,
        otherProps: {
            [property: string]: any
        }
    }>
}

export interface DailyScheduleSchema {
    break: {
        type: Boolean,
        default: false
    },
    open: {
        type: Boolean,
        required: true,
    },
    startOfWork: {
        hour: {
            type: Number,
            default: 8
        },
        minute: {
            type: Number,
            default: 0
        }
    },
    endOfWork: {
        hour: {
            type: Number,
            default: 16
        },
        minute: {
            type: Number,
            default: 0
        }
    },
    startOfBreak: {
        hour: {
            type: Number,
            default: 12
        },
        minute: {
            type: Number,
            default: 0
        }
    },
    endOfBreak: {
        hour: {
            type: Number,
            default: 12
        },
        minute: {
            type: Number,
            default: 30
        }
    },
}

export interface Calendar {
    adminEmail: string,
    calendarID: string,
    email: string,
    name: string,
    schedule: {
        scheduleType: string,
        weeklySchedule: [{
            day: 0,
            schedule: DailyScheduleSchema
        },
        {
            day: 1,
            schedule: DailyScheduleSchema
        },
        {
            day: 2,
            schedule: DailyScheduleSchema
        },
        {
            day: 3,
            schedule: DailyScheduleSchema
        },
        {
            day: 4,
            schedule: DailyScheduleSchema
        },
        {
            day: 5,
            schedule: DailyScheduleSchema
        },
        {
            day: 6,
            schedule: DailyScheduleSchema
        }],
        biWeeklySchedule: {
            evenWeek: [{
                day: 0,
                schedule: DailyScheduleSchema
            },
            {
                day: 1,
                schedule: DailyScheduleSchema
            },
            {
                day: 2,
                schedule: DailyScheduleSchema
            },
            {
                day: 3,
                schedule: DailyScheduleSchema
            },
            {
                day: 4,
                schedule: DailyScheduleSchema
            },
            {
                day: 5,
                schedule: DailyScheduleSchema
            },
            {
                day: 6,
                schedule: DailyScheduleSchema
            }],
            unevenWeek: [{
                day: 0,
                schedule: DailyScheduleSchema
            },
            {
                day: 1,
                schedule: DailyScheduleSchema
            },
            {
                day: 2,
                schedule: DailyScheduleSchema
            },
            {
                day: 3,
                schedule: DailyScheduleSchema
            },
            {
                day: 4,
                schedule: DailyScheduleSchema
            },
            {
                day: 5,
                schedule: DailyScheduleSchema
            },
            {
                day: 6,
                schedule: DailyScheduleSchema
            }]
        },
        specialWeek: [{
            year: number,
            week: number,
            schedule: [{
                day: 0,
                schedule: DailyScheduleSchema
            },
            {
                day: 1,
                schedule: DailyScheduleSchema
            },
            {
                day: 2,
                schedule: DailyScheduleSchema
            },
            {
                day: 3,
                schedule: DailyScheduleSchema
            },
            {
                day: 4,
                schedule: DailyScheduleSchema
            },
            {
                day: 5,
                schedule: DailyScheduleSchema
            },
            {
                day: 6,
                schedule: DailyScheduleSchema
            }]
        }],
        holidaysOff: boolean
    },
    pictureURL: string,
    services: [string],
    standardColor: string,
    onlineColor: string
}