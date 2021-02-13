import React, { ReactChild } from 'react'

export interface Subtitle {
    variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
    size?: 'sm' | 'lg',
    children: ReactChild
}

export const Subtitle = ( { variant = 'dark', size = '', children } ) => {
    return (
        <h2 className={`subtitle ${variant} ${size}`}>{children}</h2>
    )
}
