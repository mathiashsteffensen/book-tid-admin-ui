import React, {useState, useEffect} from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/da'
dayjs.locale('da')
dayjs.extend(utc)

import Main from '../../components/Main'
import Form from '../../components/forms/Form'
import {
    getAppointmentsByMonth,
    getAllCalendars,
    deleteAppointment
} from '../../requests'
import {
    getWeeklyOpeningHoursByDate
} from '../../utils'

import Button from 'react-bootstrap/Button'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    DayView,
    WeekView,
    MonthView,
    Appointments,
    AppointmentTooltip,
    DateNavigator,
    Toolbar,
    ViewSwitcher
} from '@devexpress/dx-react-scheduler-material-ui';
import axios from 'axios'

export default function Kalender() 
{
    // Forms ---------------------------------------------------------------------
    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType] = useState('')
    const [formProps, setFormProps] = useState({})
    const [calendars, setCalendars] = useState([])

    const handleAddAppointmentForm = () =>
    {
        setFormType('create-booking')
        setFormProps({
            onlyOneCalendar: calendars.length === 1,
            calendars: calendars,
        })
        setShowForm(true)
    }

    const handleCloseForm = () =>
    {
        setShowForm(false)
        setFormType('')
        setFormProps({})
    }

    // Fetching Admins registered calendars --------------------------------------
    // TODO: Move this api call to server side rendering
    useEffect(() =>
    {
        const abortController = axios.CancelToken.source()
        getAllCalendars(localStorage.getItem('apiKey'), abortController)
        .then((res) =>
        {
            setCalendars(res)
        })
        .catch((err) =>
        {
            console.log(err)
        })
        
        return () => abortController.cancel()
    }, [])

    // Calendar state --------------------------------------------------------------
    const [date, setDate] = useState(dayjs.utc().format('YYYY-MM-DD'))
    const [appointments, setAppointments] = useState([])
    const [showTooltip, setShowTooltip] = useState(false)
    const [openingHours, setOpeningHours] = useState({
        opening: 8, 
        closing: 17
    })

    useEffect(() => {
        const abortController = axios.CancelToken.source()
        getAppointmentsByMonth(localStorage.getItem('apiKey'), date, abortController)
        .then((res) =>
        {
            setAppointments(res.map((appointment) => {
                return {
                    ...{
                        startDate: appointment.startTime,
                        endDate: appointment.endTime,
                        title: appointment.service,
                        id: appointment._id
                    }
                }
            }))
        })
        .catch((err) =>
        {
            console.log(err)
        })
        // TODO: Change viewtype to controlled to only do these computations in daily and week view
        if (calendars.length > 0)
        {
            setOpeningHours(getWeeklyOpeningHoursByDate(calendars, dayjs(date).format('MM-DD-YYYY')))
        } 
        

        return () => abortController.cancel()
    }, [date, calendars])

    // Defining subcomponents that need to open forms -------------------------------
    const TooltipHeader = ({children, appointmentData, ...restProps}) =>
    {
        return (
            <AppointmentTooltip.Header
                {...restProps}
                appointmentData={appointmentData}
                showOpenButton
                onOpenButtonClick={handleAddAppointmentForm}
                showDeleteButton
                onDeleteButtonClick={() => deleteAppointment(localStorage.getItem('apiKey'), appointmentData.id).then(() => 
                {
                    setShowTooltip(false)
                    const selectedDate = date
                    setDate(dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD'))
                    setDate(dayjs(selectedDate).format('YYYY-MM-DD'))
                }).catch(err => console.log(err))}
                showCloseButton
            >
                {children}
            </AppointmentTooltip.Header>
        )
    }

    return (
        <Main
            title="Kalender"
            CTAs={
                <div>
                    <Button
                        variant="primary"
                        onClick={handleAddAppointmentForm}
                    >
                        NY BOOKING
                    </Button>
                </div>
            }
        >

            <Scheduler
                data={appointments}
                locale="da"
                height={660}
            >
                <ViewState 
                    currentDate={date}
                    onCurrentDateChange={(currentDate) => setDate(currentDate)}
                />
                <MonthView displayName="Måned" />
                <WeekView 
                    displayName="Uge"
                    startDayHour={openingHours.opening}
                    endDayHour={openingHours.closing} 
                />
                <DayView 
                    displayName="Dag"
                    startDayHour={openingHours.opening}
                    endDayHour={openingHours.closing} 
                />
                <Appointments />
                <AppointmentTooltip
                    visible={showTooltip}
                    onVisibilityChange={() => setShowTooltip(!showTooltip)}
                    headerComponent={TooltipHeader}
                />
                <Toolbar />
                <DateNavigator />
                <ViewSwitcher />
            </Scheduler>

            

            <Form 
                isOpen={showForm}
                formProps={formProps}
                formType={formType}
                handleClose={handleCloseForm}
            />
        </Main>
    )
}