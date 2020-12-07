import React from 'react'
import dayjs from 'dayjs'

export default function Footer() 
{
    return (
        <footer className="w-screen flex justify-center items-center sticky bottom-0 py-4">
            <div>
                <h5 className="text-sm font-semibold text-blue-900">BOOKTID.NET © {dayjs().year()}</h5>
            </div>
        </footer>
    )
}
