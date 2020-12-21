import React, {useState} from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/da'
dayjs.locale('da')
dayjs.extend(utc)

import Main from '../../components/Main'
import Form from '../../components/forms/Form'
import Calendar from '../../components/Calendar/Calendar'
import {
    getAllCalendars, verifyApiKey,
} from '../../requests'

import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function Kalender({calendars}) 
{
    // Forms ---------------------------------------------------------------------
    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType] = useState('')
    const [formProps, setFormProps] = useState({})

    const handleAddAppointmentForm = () =>
    {
        setFormType('create-booking')
        setFormProps({
            onlyOneCalendar: calendars.length === 1,
            calendars: calendars,
        })
        setShowForm(true)
    }

    // Force a rerender of the calendar on form close
    const [cloneCalendars, setCloneCalendars] = useState(calendars)
    const update = () => {setCloneCalendars([]); setCloneCalendars(calendars);}

    const handleCloseForm = () =>
    {
        setShowForm(false)
        setFormType('')
        setFormProps({})
        update()
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

            <Calendar calendars={cloneCalendars} handleAddAppointmentForm={handleAddAppointmentForm} />
            <Form 
                isOpen={showForm}
                formProps={formProps}
                formType={formType}
                handleClose={handleCloseForm}
            />
        </Main>
    )
}

export async function getServerSideProps({req})
{
    let apiKey = req.cookies.apiKey

    const isValid = await verifyApiKey(apiKey).catch(err => console.log(err))

    if (isValid)
    {
        const abortController = axios.CancelToken.source()
        const calendars = await getAllCalendars(apiKey, abortController)
        .catch((err) =>
        {
            console.log(err)
        })

        return {
            props: {
                valid: Boolean(isValid),
                calendars
            }
        }
    } else return {
        redirect: {
            permanent: false,
            destination: '/login'
        }
    }
}