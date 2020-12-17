import React, {useRef} from 'react'
import {Appointments} from '@devexpress/dx-react-scheduler-material-ui'

export default function AppointmentBase({children, data, style, onClick, ...restProps}) 
{
    return (
        <Appointments.Appointment
            style={{
                ...style,
                backgroundColor: data.color
            }}
            data={data}
            {...restProps}
            onClick={onClick}
        >
            {children}
        </Appointments.Appointment>
    )
}
