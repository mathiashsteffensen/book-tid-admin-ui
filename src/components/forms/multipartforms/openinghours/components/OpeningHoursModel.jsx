import React from 'react'

export default function OpeningHoursModel({children, hidden, title}) 
{
    return (
        <div
            hidden={hidden}
            className={hidden ? 'hidden' : "w-full flex flex-col justify-center items-center my-4 rounded overflow-hidden"}
        >
            <div className="w-full bg-gray-300 px-4 py-2">
                {title}
            </div>

            {children}

        </div>
    )
}
