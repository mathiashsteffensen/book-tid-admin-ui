import React, {useState} from 'react'

import Main from '../../components/Main'
import Form from '../../components/forms/Form'
import Calendar from '../../components/Calendar/Calendar'
import {
    getAllCalendars, verifyApiKey,
} from '../../requests'

import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function Kalender({calendars, user, apiKey}) 
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
                        size="lg"
                        variant="primary"
                        onClick={handleAddAppointmentForm}
                    >
                        Ny Booking
                    </Button>
                </div>
            }
            subscriptionType={user.subscriptionType === 'free' ? user.subscriptionType : user.subscriptionTypeName}
            apiKey={apiKey}
        >

            <Calendar apiKey={apiKey} calendars={cloneCalendars} handleAddAppointmentForm={handleAddAppointmentForm} />
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
                user: isValid,
                calendars,
                apiKey,
            }
        }
    } else return {
        redirect: {
            permanent: false,
            destination: '/login'
        }
    }
}