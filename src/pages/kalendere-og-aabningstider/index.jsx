import React, {useEffect, useState} from 'react'

import axios from 'axios'

import Main from '../../components/Main'
import CalendarSettings from '../../components/CalendarSettings'

import {Button, Snackbar, IconButton} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import {getMaxCalendars, getAllCalendars, updateCalendar, createCalendar} from '../../requests'

export default function CalendarSettingsPage()
{
    // Used for updating state and rerunning network requests
    const [shouldUpdate, setShouldUpdate] = useState(false)

    const [calendars, setCalendars] = useState([])
    const [maxAllowed, setMaxAllowed] = useState(1)

    // Displaying errors
    const [error, setError] = useState('')

    // Displaying success message
    const [openSucces, setOpenSuccess] = useState(false)

    const abortController = axios.CancelToken.source()

    

    useEffect(() =>
    {
        const apiKey = localStorage.getItem('apiKey')
        getMaxCalendars(apiKey, abortController).then((res) => setMaxAllowed(res)).catch((err) => console.log(err))
        getAllCalendars(apiKey, abortController).then((res) => setCalendars(res)).catch((err) => console.log(err))
        return () => {
            abortController.cancel()
        }
    }, [shouldUpdate])

    const update = () =>
    {
        setShouldUpdate(false)
        setShouldUpdate(true)
    }

    const saveAll = () =>
    {
        const apiKey = localStorage.getItem('apiKey')
        calendars.forEach(async (calendar) =>
        {
            var updates = {
                name: calendar.name,
                email: calendar.email
            }

            await updateCalendar(apiKey, calendar.calendarID, updates).catch((err) => setError(err))
        })
        error === '' ? setOpenSuccess(true) : null
    }

    const handleNameChange = (value, calendarID) =>
    {
        setCalendars(calendars.map((calendar) =>
        {
            if (calendar._id === calendarID) calendar.name = value
            return calendar
        }))
    }

    const handleEmailChange = (value, calendarID) =>
    {
        setCalendars(calendars.map((calendar) =>
        {
            if (calendar._id === calendarID) calendar.email = value
            return calendar
        }))
    }

    return (
        <Main
            title="Kalendere og åbningstider"
            subtitle="Rediger i dine indstillinger for kalendere og åbningstider"
            CTAs={maxAllowed > calendars.length ?
                <Button
                    color="primary"
                    onClick={() => createCalendar(localStorage.getItem('apiKey')).then(update)}
                >
                    Ny Kalender
                </Button>
            : null}
        >
            {calendars.map((calendar, i) => <CalendarSettings update={update} key={i} handleEmailChange={handleEmailChange} handleNameChange={handleNameChange} calendar={calendar} />)}
            
            <div className="mt-4 w-10/12">
                <Button
                    variant="contained"
                    color="primary"
                    className="float-right mr-8"
                    onClick={saveAll}
                >
                    Gem
                </Button>
            </div>
            <Snackbar 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openSucces}
                autoHideDuration={3000}
                onClose={() => setOpenSuccess(false)}
                message="Ændringer gemt"
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSuccess(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </Main>
    )
}


// TODO: Add API key authentication to all serverside pages instead of doing it client side, not secure enough you doofus