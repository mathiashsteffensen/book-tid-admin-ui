import React, {useState, useEffect} from 'react'
import {
    getAppointmentsByCalendarMonth,
    getAppointmentsByWeek,
    getAppointmentsByDay
} from '../../requests'
import {
    getWeeklyOpeningHoursByDate,
    getDailyOpeningHoursByDate
} from '../../utils'

import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/da'
dayjs.locale('da')
dayjs.extend(utc)

import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    DayView,
    WeekView,
    MonthView,
    DateNavigator,
    Toolbar,
    ViewSwitcher
} from '@devexpress/dx-react-scheduler-material-ui';

import MyAppointments from './MyAppointments/MyAppointments'
import MyAppointmentTooltip from './MyAppointmentTooltip/MyAppointmentTooltip'


export default function Calendar({calendars, handleAddAppointmentForm}) 
{
    // Calendar state --------------------------------------------------------------
    const [date, setDate] = useState(dayjs.utc().format('YYYY-MM-DD'))
    const [viewType, setViewType] = useState('Month')
    const [appointments, setAppointments] = useState([])
    const [showTooltip, setShowTooltip] = useState(false)
    const [openingHours, setOpeningHours] = useState({
        opening: 8, 
        closing: 17
    })

    // Fetch appointments
    useEffect(() => 
    {
        const abortController = axios.CancelToken.source()
        const apiKey = localStorage.getItem('apiKey')
        switch (viewType) 
        {
            case 'Month':
                getAppointmentsByCalendarMonth(apiKey, dayjs(date).add(1, 'hour').format('YYYY-MM-DD'), abortController)
                .then((res) =>
                {
                    let flattened = res.flat()

                    setAppointments(flattened.map((appointment) => {
                        const ownerCalendar = calendars.filter((calendar) => calendar.calendarID === appointment.calendarID)[0]

                        return {
                            startDate: dayjs(appointment.startTime).subtract(1, 'hour').toJSON(),
                            endDate: dayjs(appointment.endTime).subtract(1, 'hour').toJSON(),
                            title: appointment.service,
                            id: appointment._id,
                            calendarName: ownerCalendar.name,
                            color: appointment.bookedOnline ? ownerCalendar.onlineColor : ownerCalendar.standardColor,
                            bookedOnline: appointment.bookedOnline
                        }
                    }))
                })
                .catch((err) =>
                {
                    console.log(err)
                }) 
                break;
            
            case 'Week':
                getAppointmentsByWeek(apiKey, dayjs(date).add(1, 'hour').format('YYYY-MM-DD'), abortController)
                .then((res) =>
                {
                    setAppointments(res.map((appointment) => {
                        const ownerCalendar = calendars.filter((calendar) => calendar.calendarID === appointment.calendarID)[0]

                        return {
                            startDate: dayjs(appointment.startTime).subtract(1, 'hour').toJSON(),
                            endDate: dayjs(appointment.endTime).subtract(1, 'hour').toJSON(),
                            title: appointment.service,
                            id: appointment._id,
                            calendarName: ownerCalendar.name,
                            color: appointment.bookedOnline ? ownerCalendar.onlineColor : ownerCalendar.standardColor,
                            bookedOnline: appointment.bookedOnline
                        }
                    }))
                })
                .catch((err) =>
                {
                    console.log(err)
                }) 
                break;

            case 'Day':
                getAppointmentsByDay(apiKey, dayjs(date).add(1, 'hour').format('YYYY-MM-DD'), abortController)
                .then((res) =>
                {
                    console.log(res)
                    setAppointments(res.map((appointment) => {
                        const ownerCalendar = calendars.filter((calendar) => calendar.calendarID === appointment.calendarID)[0]

                        return {
                            startDate: dayjs(appointment.startTime).subtract(1, 'hour').toJSON(),
                            endDate: dayjs(appointment.endTime).subtract(1, 'hour').toJSON(),
                            title: appointment.service,
                            id: appointment._id,
                            calendarName: ownerCalendar.name,
                            color: appointment.bookedOnline ? ownerCalendar.onlineColor : ownerCalendar.standardColor,
                            bookedOnline: appointment.bookedOnline
                        }
                    }))
                })
                .catch((err) =>
                {
                    console.log(err)
                })

            default:
                break;
        }
        return () => abortController.cancel()
    }, [date, viewType, calendars])

    // Set opening hours
    // TODO: Add a function to get openinghours on a specific day and not just weekly, then make conditional calls based on viewtype
    useEffect(() => {
        if (calendars.length > 0)
        {
            if (viewType === 'Week') setOpeningHours(getWeeklyOpeningHoursByDate(calendars, date))
            else if (viewType === 'Day') setOpeningHours(getDailyOpeningHoursByDate(calendars, date))
            
        }
    }, [calendars, viewType])

    const WeekViewTableCell = ({onDoubleClick, startDate, ...restProps}) =>
    {
        return (
            <WeekView.TimeTableCell
                {...restProps}
                startDate={startDate}
                onDoubleClick={() => 
                    {
                        setDate(dayjs(startDate).format('YYYY-MM-DD'))
                        setViewType('Day')
                    }
                }
            >

            </WeekView.TimeTableCell>
        )
    }

    const MonthViewTableCell = ({onDoubleClick, startDate, ...restProps}) =>
    {
        return (
            <MonthView.TimeTableCell
                {...restProps}
                startDate={startDate}
                onDoubleClick={() => 
                    {
                        setDate(dayjs(startDate).format('YYYY-MM-DD'))
                        setViewType('Day')
                    }
                }
            >

            </MonthView.TimeTableCell>
        )
    }

    return (
        <Scheduler
                data={appointments}
                locale="da"
                height={700}
            >
                <ViewState 
                    currentDate={date}
                    onCurrentDateChange={(currentDate) => setDate(currentDate)}
                    currentViewName={viewType}
                    onCurrentViewNameChange={(newView) => setViewType(newView)}
                />
                <MonthView 
                    displayName="Måned"
                    timeTableCellComponent={MonthViewTableCell} 
                />
                <WeekView 
                    displayName="Uge"
                    startDayHour={openingHours.opening}
                    endDayHour={openingHours.closing}
                    timeTableCellComponent={WeekViewTableCell}
                />
                <DayView 
                    displayName="Dag"
                    startDayHour={openingHours.opening}
                    endDayHour={openingHours.closing} 
                />
                <MyAppointments />
                <MyAppointmentTooltip
                    visible={showTooltip}
                    onVisibilityChange={() => setShowTooltip(!showTooltip)}
                    handleAddAppointmentForm={handleAddAppointmentForm}
                    setDate={setDate}
                    setShowTooltip={setShowTooltip}
                />
                <Toolbar />
                <DateNavigator />
                <ViewSwitcher />
            </Scheduler>
    )
}
