import React from 'react'

import {IconButton} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

export default function FormModel({closeForm, children, title, subtitle, resetError}) 
{
    return (
        <form onChange={resetError} className="outline-none my-4 max-w-screen min-w-2/3-screen w-full z-10 flex flex-col justify-center items-center bg-white rounded shadow pb-8 h-full overflow-hidden">
            <div className="flex justify-between items-center w-full py-4 px-8 bg-blue-500">
                <div className="font-medium">
                    <h1 className="text-2xl text-gray-900">{title}</h1>
                    <h2 className="text-lg text-gray-800">{subtitle}</h2>  
                </div>
                
                <span className="w-8"></span>
                <IconButton
                    onClick={closeForm}
                >
                    <CloseIcon />
                </IconButton>
            </div>

            <div className="px-4 w-full flex flex-col justify-center items-center">
               {children} 
            </div>
        </form>
    )
}
