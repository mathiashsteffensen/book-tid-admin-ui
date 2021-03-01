import React from 'react';
import { useDispatch } from 'react-redux'

import Main from '../../components/custom/Main.tsx';
import Calendar from '../../components/custom/Calendar/Calendar';
import { verifyApiKey } from '../../requests';

import { Button } from '../../components/agnostic/Button';

import { showForm } from '../../redux/slices/actions'

export default function Kalender({ user, apiKey }) {
    const dispatch = useDispatch()

    const handleAddAppointmentForm = () => {
        dispatch(showForm({
            type: 'appointment',
            props: {}
        }))
    };

    return (
        <Main
            title="Kalender"
            CTAs={
                <div className="z-10 mt-2">
                    <Button
                        variant="primary"
                        onClick={handleAddAppointmentForm}
                    >
                        Ny Booking
                    </Button>
                </div>
            }
            subscriptionType={
                user.subscriptionType === 'free'
                    ? user.subscriptionType
                    : user.subscriptionTypeName
            }
            apiKey={apiKey}
        >
            <Calendar
                apiKey={apiKey}
                handleAddAppointmentForm={handleAddAppointmentForm}
            />
        </Main>
    );
}

export async function getServerSideProps({ req }) {
    let apiKey = req.cookies.apiKey;

    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (isValid) {
        return {
            props: {
                valid: Boolean(isValid),
                user: isValid,
                apiKey,
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
