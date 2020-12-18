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
    ViewSwitcher,
    Resources,
    Appointments
} from '@devexpress/dx-react-scheduler-material-ui';

import MyAppointmentTooltip from './MyAppointmentTooltip/MyAppointmentTooltip'
import MyToolbar from './MyToolbar/MyToolbar'


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
    const [resources, setResources] = useState([
        {
            fieldName: 'calendarID',
            title: 'Medarbejder',
            instances: calendars.map((calendar) => 
            {
                return {
                    id: calendar.calendarID,
                    text: calendar.name + ' - Standard Booking',
                    color: calendar.standardColor
                }
            }).concat(calendars.map((calendar) =>
            {
                return {
                    id: calendar.calendarID + 'online',
                    text: calendar.name + ' - Online Booking',
                    color: calendar.onlineColor
                }
            }))
        }
    ])
    const [selectedCalendars, setSelectedCalendars] = useState(calendars.map(calendar => calendar.calendarID))

    const handleCheckedCalendarChange = (calendarID) =>
    {
        if (selectedCalendars.indexOf(calendarID) !== -1) setSelectedCalendars(selectedCalendars.filter(id => calendarID !== id))
        else setSelectedCalendars(selectedCalendars.concat([calendarID]))
    }

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

                    setAppointments(flattened.filter((appointment) => selectedCalendars.indexOf(appointment.calendarID) !== -1).map((appointment) => {
                        const ownerCalendar = calendars.filter((calendar) => calendar.calendarID === appointment.calendarID)[0]

                        return {
                            startDate: dayjs(appointment.startTime).subtract(1, 'hour').toJSON(),
                            endDate: dayjs(appointment.endTime).subtract(1, 'hour').toJSON(),
                            title: appointment.service,
                            id: appointment._id,
                            calendarID: appointment.bookedOnline ? ownerCalendar.calendarID + 'online' : ownerCalendar.calendarID,
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
                    setAppointments(res.filter((appointment) => selectedCalendars.indexOf(appointment.calendarID) !== -1).map((appointment) => {
                        const ownerCalendar = calendars.filter((calendar) => calendar.calendarID === appointment.calendarID)[0]

                        return {
                            startDate: dayjs(appointment.startTime).subtract(1, 'hour').toJSON(),
                            endDate: dayjs(appointment.endTime).subtract(1, 'hour').toJSON(),
                            title: appointment.service,
                            id: appointment._id,
                            calendarID: appointment.bookedOnline ? ownerCalendar.calendarID + 'online' : ownerCalendar.calendarID,
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
                    setAppointments(res.filter((appointment) => selectedCalendars.indexOf(appointment.calendarID) !== -1).map((appointment) => {
                        const ownerCalendar = calendars.filter((calendar) => calendar.calendarID === appointment.calendarID)[0]

                        return {
                            startDate: dayjs(appointment.startTime).subtract(1, 'hour').toJSON(),
                            endDate: dayjs(appointment.endTime).subtract(1, 'hour').toJSON(),
                            title: appointment.service,
                            id: appointment._id,
                            calendarID: appointment.bookedOnline ? ownerCalendar.calendarID + 'online' : ownerCalendar.calendarID,
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
    }, [date, viewType, calendars, selectedCalendars])

    // Set opening hours
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
                <Appointments />
                <MyAppointmentTooltip
                    visible={showTooltip}
                    onVisibilityChange={() => setShowTooltip(!showTooltip)}
                    handleAddAppointmentForm={handleAddAppointmentForm}
                    setDate={setDate}
                    selectedDate={date}
                    setShowTooltip={setShowTooltip}
                />
                <Resources 
                    data={resources}
                    mainResourceName='calendarID'
                />
                <MyToolbar
                    calendars={calendars}
                    checkedCalendars={selectedCalendars}
                    handleChange={handleCheckedCalendarChange}
                />
                <DateNavigator />
                <ViewSwitcher />
            </Scheduler>
    )
}
