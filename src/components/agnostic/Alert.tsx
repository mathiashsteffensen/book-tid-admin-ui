import React, { ReactChild } from 'react'

export interface Alert {
    variant: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger' | 'success',
    children: ReactChild | Array<ReactChild>,
    className: string
}

export const Alert = ( { variant, children, className }: Alert ) => {
    return (
        <div className={`alert ${variant} ${className}`}>
            {children}
        </div>
    )
}
