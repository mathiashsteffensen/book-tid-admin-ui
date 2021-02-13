import React from 'react'

export const Text = ({ children, className, ...otherProps }) => {
    return (
        <p {...otherProps} className={`card-text ${className}`}>
            {children}
        </p>
    )
}
