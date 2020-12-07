import React from 'react'

export default function Appointment({title, startTime, endTime}) 
{
    return (
        <div className="w-full border-blue-300 border-2 rounded-sm shadow-xs flex justify-between items-center">
            <div className="text-2xs">
                {title}
            </div>

            <div className="text-2xs">
                {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
            </div>
        </div>
    )
}
