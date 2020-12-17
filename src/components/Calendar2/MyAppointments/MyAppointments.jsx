import React from 'react'
import {Appointments} from '@devexpress/dx-react-scheduler-material-ui'
import AppointmentBase from './AppointmentBase'

export default function MyAppointments() 
{

    return (
        <Appointments 
            appointmentComponent={AppointmentBase}
        >
        </Appointments>
    )
}
