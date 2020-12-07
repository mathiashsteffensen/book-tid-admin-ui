import React, {useState, useEffect} from 'react'
import Appointment from './Appointment'

import dayjs from 'dayjs';

export default function Day({date, viewMonth, getAsyncData}) 
{
    const [appointments, setAppointments] = useState([])
    const [seeMore, setSeeMore] = useState(false)

    useEffect(() =>
    {
        getAsyncData(date)
        .then((res) =>
        {
            if (res.length > 2)
            {
                setAppointments(res.slice(0, 2))
                setSeeMore(true)
            } else 
            {
                setAppointments(res)
                setSeeMore(false)
            }
            
        })
        .catch(err => console.log(err))
    }, [date])

    return (
        <div className="grid grid-cols-5 grid-rows-4 col-span-1 row-span-1 p-micro">
            <div className="col-start-1 col-span-1 text-center row-start-1 row-span-1 overflow-visible">
                    <div className="text-2xs">
                        {date.date()}/{date.month()+1}
                    </div>
            </div>
            {appointments.map((appointment) => <div key={appointment.startTime} className="col-start-1 col-span-5">
                <Appointment 
                    title={appointment.service} 
                    startTime={dayjs(appointment.startTime)} 
                    endTime={dayjs(appointment.endTime)} 
                />
            </div>)}
           {seeMore && <div className="col-start-1 col-span-2 row-start-4 text-2xs hover:bg-gray-100 cursor-pointer flex justify-center items-center">
                Se flere ...
           </div>}
        </div>
    )
}
