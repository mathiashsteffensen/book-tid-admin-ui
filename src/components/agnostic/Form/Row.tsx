import React from 'react'

export const Row = ({ className, children, ...otherProps }) => {
    return (
        <div {...otherProps} className={`form-row ${className}`}>
            {children}
        </div>
    )
}
