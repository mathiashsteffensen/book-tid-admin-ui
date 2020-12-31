import React from 'react'

export default function Main({title, subtitle, CTAs, children}) 
{
    return (
        <main className="w-full mt-4 md:mt-22 mb-2 flex justify-center items-center">
            <div className="w-full mx-2 md:w-11/12 rounded-lg md:px-4 pb-4 border-opacity-50 border-primary border-solid border-2 flex items-center justify-center flex-col">
                <div className="w-full px-4 py-2 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">{title}</h1>
                        <h2 className="text-lg text-gray-700">{subtitle}</h2>  
                    </div>
                    <div className="flex justify-center items-center my-4 md:m-0">
                        {CTAs ? CTAs : null}
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}
