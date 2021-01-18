import React from 'react'
import dayjs from 'dayjs'

export default function Footer() 
{
    return (
        <footer className="w-screen mt-4 fixed bottom-0 flex justify-center items-center py-4 bg-gray-100 shadow">
            <div>
                <h5 className="text-sm font-semibold text-blue-900">BOOKTID.NET © {dayjs().year()}</h5>
            </div>
        </footer>
    )
}
