import React from 'react'

import Link from 'next/link'

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

export default function AltHeader({showBackLink}) 
{
    return (
        <header className="w-screen h-24 bg-gray-200 py-3 flex justify-center items-center">
            {showBackLink && <div className="absolute left-0">
                <Link href="/kalender">
                    <a className="flex justify-center items-center">
                        <NavigateBeforeIcon className="text-secondary" style={{fontSize: '3rem'}} />
                        <h4 className="hidden md:block">Tilbage til min kalender</h4>
                    </a>
                </Link> 
            </div>}

            <div className="w-1/2 text-lg md:text-2xl">
                <button onClick={() => window.location = 'https://booktid.net'}>
                    <h1>BOOKTID.NET</h1>
                </button>
                <h2 className="font-medium">ONLINE BOOKINGSYSTEM</h2>
                {process.env.NODE_ENV === 'development' && <h5 className="text-sm text-muted mt-1">BETA v0.2.0</h5>}
            </div>
        </header>
    )
}
