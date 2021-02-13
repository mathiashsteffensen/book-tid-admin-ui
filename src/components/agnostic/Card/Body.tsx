import React from 'react'

export const Body = ( { children, className, ...otherProps } ) => {
    return (
        <div {...otherProps} className={`card-body ${className}`}>
            {children}
        </div>
    )
}
