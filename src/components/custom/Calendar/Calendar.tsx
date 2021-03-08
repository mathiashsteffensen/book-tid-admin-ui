import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import useSWR from 'swr';

import getter from '../../../getter';

import { getAllCalendars } from '../../../requests'

import {
    getWeeklyOpeningHoursByDate,
    getDailyOpeningHoursByDate,
} from '../../../utils';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/da';
dayjs.locale('da');
dayjs.extend(utc);

import { ViewState } from '@devexpress/dx-react-scheduler';

import {
    Scheduler,
    DayView,
    WeekView,
    MonthView,
    DateNavigator,
    ViewSwitcher,
    Resources,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

import MyAppointmentTooltip from './MyAppointmentTooltip/MyAppointmentTooltip';
import MyToolbar from './MyToolbar/MyToolbar';

import { Alert } from '../../agnostic/Alert'
import { Spinner } from '../../agnostic/Spinner'

import { State } from '../../../redux/store'

export interface MonthTableCellProps {
    [x: string]: any,
    onDoubleClick?: (e: any) => void,
    startDate: Date
}

export interface WeekTableCellProps {
    [x: string]: any,
    onDoubleClick?: (e: any) => void,
    startDate?: Date
}

export default function Calendar({
    handleAddAppointmentForm,
    apiKey,
}) {
    // Calendar state --------------------------------------------------------------
    const [date, setDate]: [string | Date, any] = useState(dayjs.utc().format('YYYY-MM-DD'));
    const [viewType, setViewType] = useState('Month');
    const [showTooltip, setShowTooltip] = useState(false);
    const [openingHours, setOpeningHours] = useState({
        opening: 8,
        closing: 17,
    });
    const [resources, setResources]:[[{
        fieldName: string,
        title: string,
        instances: Array<any>
    }], any] = useState([
        {
            fieldName: 'calendarID',
            title: 'Medarbejder',
            instances: []
        },
    ]);

    const [calendars, setCalendars]: [false | Array<any>, any] = useState(false)

    const [selectedCalendars, setSelectedCalendars]: [Array<any>, any] = useState([]);

    const [selectedCalendarIds, setSelectedCalendarIds]: [Array<any>, any] = useState([])

    useEffect(() => {
        const abortController = axios.CancelToken.source();
        getAllCalendars(apiKey, abortController)
            .then((res: Array<any>) => {
                setCalendars(res)
                setResources([{
                    fieldName: 'calendarID',
                    title: 'Medarbejder',
                    instances: res
                        .map((calendar) => {
                            return {
                                id: calendar.calendarID,
                                text: calendar.name + ' - Standard Booking',
                                color: calendar.standardColor,
                            };
                        })
                        .concat(
                            res.map((calendar) => {
                                return {
                                    id: calendar.calendarID + 'online',
                                    text: calendar.name + ' - Online Booking',
                                    color: calendar.onlineColor,
                                };
                            })
                        ),
                }])
                setSelectedCalendars(res)
                setSelectedCalendarIds(res.map(calendar => calendar.calendarID))
            })
            .catch((err) => {
                    console.log(err);
            });
        return () => {
            abortController.cancel()
        }
    }, [])

    const handleCheckedCalendarChange = (newSelectedCalendars) => {
        setSelectedCalendarIds(newSelectedCalendars.map(calendar => calendar.calendarID))
        setSelectedCalendars(newSelectedCalendars)
    }

    // Fetch appointments
    const { data: appointments, error, isValidating, mutate } = useSWR(
        [viewType, date, apiKey, calendars, selectedCalendarIds],
        getter.appointment,
    );

    // Form state -----------------------------------------------------------
    const formState: State["form"] = useSelector((state: State) => state.form)

    useEffect(() => {
        mutate()
    }, [formState.isOpen])

    // Set opening hours
    useEffect(() => {
        if (!calendars) return
        // @ts-ignore
        if (calendars.length > 0) {
            if (viewType === 'Week')
                setOpeningHours(getWeeklyOpeningHoursByDate(calendars, date));
            else if (viewType === 'Day')
                setOpeningHours(getDailyOpeningHoursByDate(calendars, date));
        }
    }, [calendars, viewType]);

    const WeekViewTableCell = ({ onDoubleClick, startDate, ...restProps }: WeekTableCellProps) => {
        return (
            <WeekView.TimeTableCell
                {...restProps}
                startDate={startDate}
                onDoubleClick={() => {
                    setDate(dayjs(startDate).format('YYYY-MM-DD'));
                    setViewType('Day');
                }}
            ></WeekView.TimeTableCell>
        );
    };

    const MonthViewTableCell = ({ onDoubleClick, startDate, ...restProps }: MonthTableCellProps) => {
        const isInCurrentMonth = dayjs(startDate).month() === dayjs(date).month()

        const isToday = (dayjs(startDate).month() === dayjs().month() && dayjs(startDate).date() === dayjs().date())

        let style

        if (isToday) style = {
            color: 'white'
        }
        else if (isInCurrentMonth) style = {
            color: 'black'
        }
        else style = {
            color: 'rgba(0,0,0,0.9)'
        }

        return (
            <MonthView.TimeTableCell
                {...restProps}
                startDate={startDate}
                onDoubleClick={() => {
                    setDate(dayjs(startDate).format('YYYY-MM-DD'));
                    setViewType('Day');
                }}
                style={style}
                className="month-view-table-cell"
            ></MonthView.TimeTableCell>
        );
    };

    if ((!error && !appointments) || !calendars ) return (
        <Alert className="flex justify-between items-center" variant="info">
            <p className="mr-2">Vent venligst mens vi indlæser din kalender</p>

            <Spinner />
        </Alert>
    )
        console.log(appointments)
    return (
        <Scheduler data={appointments} locale="da" height={720}>
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
                mutate={mutate}
            />
            <Resources data={resources} mainResourceName="calendarID" />
            <MyToolbar
                calendars={calendars}
                checkedCalendars={selectedCalendars}
                handleChange={handleCheckedCalendarChange}
                syncing={!error && (!appointments || isValidating)}
                appointmentError={error}
            />
            <DateNavigator />
            <ViewSwitcher />
        </Scheduler>
    );
}
