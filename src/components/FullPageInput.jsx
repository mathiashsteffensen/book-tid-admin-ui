import React from 'react'

export default function FullPageInput({title, subtitle, input}) 
{
    return (
        <label className="w-full mt-2 pt-2 grid grid-cols-3 divide-x divide-blue-500">
            <div className="flex flex-col justify-center mr-2">
                <h3 className="text-base">{title}</h3>
                <h4 className="text-sm text-gray-700">{subtitle}</h4>
            </div>
            <div className="col-span-2 flex justify-center items-center">
                {input}
            </div>
        </label>
    )
}
