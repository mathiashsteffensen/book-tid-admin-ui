import React from 'react'

export const CardGroup = ({children, className, ...otherProps}) => {
    return (
        <div {...otherProps} className={`card-group ${className}`}>
            {children}
        </div>
    )
}
