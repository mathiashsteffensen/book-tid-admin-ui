import React, { useEffect, useState } from 'react';

import axios from 'axios';

import Main from '../../components/Main';
import CalendarSettings from '../../components/CalendarSettings';

import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'

import {
    getMaxCalendars,
    getAllCalendars,
    updateCalendar,
    createCalendar,
    verifyApiKey,
} from '../../requests';

export default function CalendarSettingsPage() {
    // Used for updating state and rerunning network requests
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const [calendars, setCalendars] = useState([]);
    const [maxAllowed, setMaxAllowed] = useState(1);

    // Displaying errors
    const [error, setError] = useState('');

    // Displaying success message
    const [openSucces, setOpenSuccess] = useState(false);

    const abortController = axios.CancelToken.source();

    // TODO: Move to SSR
    useEffect(() => {
        const apiKey = localStorage.getItem('apiKey');
        getMaxCalendars(apiKey, abortController)
            .then((res) => setMaxAllowed(res))
            .catch((err) => console.log(err));
        getAllCalendars(apiKey, abortController)
            .then((res) => setCalendars(res))
            .catch((err) => console.log(err));
        return () => {
            abortController.cancel();
        };
    }, [shouldUpdate]);

    const update = () => {
        setShouldUpdate(false);
        setShouldUpdate(true);
    };

    const saveAll = () => {
        const apiKey = localStorage.getItem('apiKey');
        calendars.forEach(async (calendar) => {
            var updates = {
                name: calendar.name,
                email: calendar.email,
            };

            await updateCalendar(
                apiKey,
                calendar.calendarID,
                updates
            ).catch((err) => setError(err));
        });
        error === '' ? setOpenSuccess(true) : null;
    };

    const handleNameChange = (value, calendarID) => {
        setCalendars(
            calendars.map((calendar) => {
                if (calendar._id === calendarID) calendar.name = value;
                return calendar;
            })
        );
    };

    const handleEmailChange = (value, calendarID) => {
        setCalendars(
            calendars.map((calendar) => {
                if (calendar._id === calendarID) calendar.email = value;
                return calendar;
            })
        );
    };

    return (
        <Main
            title="Kalendere og åbningstider"
            subtitle="Rediger i dine indstillinger for kalendere og åbningstider"
            CTAs={
                maxAllowed > calendars.length ? (
                    <Button
                        className="mt-3"
                        onClick={() =>
                            createCalendar(localStorage.getItem('apiKey')).then(
                                update
                            )
                        }
                    >
                        Ny Kalender
                    </Button>
                ) : null
            }
        >
            {calendars.map((calendar, i) => (
                <CalendarSettings
                    update={update}
                    key={i}
                    handleEmailChange={handleEmailChange}
                    handleNameChange={handleNameChange}
                    calendar={calendar}
                />
            ))}

            <div className="mt-4 w-10/12">
                <Button
                    className="float-right mr-8"
                    onClick={saveAll}
                >
                    Gem
                </Button>
            </div>
            <Toast
                show={openSucces}
                delay={30000}
                onClose={() => setOpenSuccess(false)}
                className="absolute right-0 bottom-0 z-50 w-56 m-3"
            >
                <Toast.Header>Ændringer gemt</Toast.Header>
            </Toast>
        </Main>
    );
}

export async function getServerSideProps({ req }) {
    const apiKey = req.cookies.apiKey;

    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (isValid) {
        return {
            props: {
                valid: Boolean(isValid),
                user: isValid,
            },
        };
    } else
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
}
