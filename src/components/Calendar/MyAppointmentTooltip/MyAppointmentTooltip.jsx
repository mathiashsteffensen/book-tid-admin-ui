import React from 'react'
import {AppointmentTooltip} from '@devexpress/dx-react-scheduler-material-ui'
import TooltipHeader from './TooltipHeader'

export default function MyAppointmentTooltip({handleAddAppointmentForm, setDate, selectedDate, setShowTooltip, visible, onVisibilityChange}) 
{
    const Header = (props) => <TooltipHeader {...props} selectedDate={selectedDate} setDate={setDate} setShowTooltip={setShowTooltip} handleAddAppointmentForm={handleAddAppointmentForm} />
    return (
        <AppointmentTooltip
            visible={visible}
            onVisibilityChange={onVisibilityChange}
            headerComponent={Header}
        >
            
        </AppointmentTooltip>
    )
}
