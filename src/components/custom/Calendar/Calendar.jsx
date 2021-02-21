import React, { useState, useEffect } from 'react';

import useSWR from 'swr';

import getter from '../../../getter';

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

export default function Calendar({
    calendars,
    handleAddAppointmentForm,
    apiKey,
}) {
    // Calendar state --------------------------------------------------------------
    const [date, setDate] = useState(dayjs.utc().format('YYYY-MM-DD'));
    const [viewType, setViewType] = useState('Month');
    const [showTooltip, setShowTooltip] = useState(false);
    const [openingHours, setOpeningHours] = useState({
        opening: 8,
        closing: 17,
    });
    const [resources, setResources] = useState([
        {
            fieldName: 'calendarID',
            title: 'Medarbejder',
            instances: calendars
                .map((calendar) => {
                    return {
                        id: calendar.calendarID,
                        text: calendar.name + ' - Standard Booking',
                        color: calendar.standardColor,
                    };
                })
                .concat(
                    calendars.map((calendar) => {
                        return {
                            id: calendar.calendarID + 'online',
                            text: calendar.name + ' - Online Booking',
                            color: calendar.onlineColor,
                        };
                    })
                ),
        },
    ]);
    const [selectedCalendars, setSelectedCalendars] = useState(calendars);

    const [selectedCalendarIds, setSelectedCalendarIds] = useState(calendars.map(calendar => calendar.calendarID))

    const handleCheckedCalendarChange = (newSelectedCalendars) => {
        setSelectedCalendarIds(newSelectedCalendars.map(calendar => calendar.calendarID))
        setSelectedCalendars(newSelectedCalendars)
    }

    // Fetch appointments
    const { data: appointments, error, isValidating, mutate } = useSWR(
        [viewType, date, apiKey, calendars, selectedCalendarIds],
        getter.appointment
    );

    // Set opening hours
    useEffect(() => {
        if (calendars.length > 0) {
            if (viewType === 'Week')
                setOpeningHours(getWeeklyOpeningHoursByDate(calendars, date));
            else if (viewType === 'Day')
                setOpeningHours(getDailyOpeningHoursByDate(calendars, date));
        }
    }, [calendars, viewType]);

    const WeekViewTableCell = ({ onDoubleClick, startDate, ...restProps }) => {
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

    const MonthViewTableCell = ({ onDoubleClick, startDate, ...restProps }) => {
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

    return (
        <Scheduler className="m-2" data={appointments} locale="da" height={720}>
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
