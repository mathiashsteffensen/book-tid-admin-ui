import React, { ReactChild } from 'react'

export interface Alert extends React.HTMLAttributes<HTMLDivElement> {
    variant: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger' | 'success',
}

export const Alert = ( { variant, children, className, ...otherProps }: Alert ) => {
    return (
        <div {...otherProps} className={`alert ${variant} ${className}`}>
            {children}
        </div>
    )
}
