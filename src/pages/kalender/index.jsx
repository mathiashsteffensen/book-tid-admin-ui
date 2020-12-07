import React, {useState, useEffect} from 'react'
import dayjs from 'dayjs'

import Main from '../../components/Main'
import Calendar from '../../components/Calendar/Calendar'
import Form from '../../components/forms/Form'
import {getAppointmentsByDay, getAllCalendars} from '../../requests'

import { Button } from '@material-ui/core'
import axios from 'axios'

export default function Kalender() 
{
    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType] = useState('')
    const [formProps, setFormProps] = useState({})
    const [calendars, setCalendars] = useState([])

    const [renderCalendar, setRenderCalendar] = useState(false)
    const updateCalendar = () => renderCalendar === false ? setRenderCalendar(true) : (setRenderCalendar(false) && setRenderCalendar(true))

    const fetchData = async (dayjsObject) =>
    {
        const abortController = axios.CancelToken.source()
        return await getAppointmentsByDay(localStorage.getItem('apiKey'), dayjsObject.toJSON().slice(0, 10), abortController)
    }

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
        updateCalendar()
    }

    useEffect(() =>
    {
        const abortController = axios.CancelToken.source()
        getAllCalendars(localStorage.getItem('apiKey'), abortController)
        .then((res) =>
        {
            console.log(res)
            setCalendars(res)
        })
        .catch((err) =>
        {
            console.log(err)
        })
        
        return () => abortController.cancel()
    }, [])

    return (
        <Main
            title="Kalender"
            CTAs={
                <div>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleAddAppointmentForm}
                    >
                        Ny booking
                    </Button>
                </div>
            }
        >
            <Calendar
                getAsyncData={fetchData}
            />

            <Form 
                isOpen={showForm}
                formProps={formProps}
                formType={formType}
                handleClose={handleCloseForm}
            />
        </Main>
    )
}