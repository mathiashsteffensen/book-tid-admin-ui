import React from 'react'

export const ButtonGroup = ({ children, className = '' }) => {
    return (
        <div role="group" className={`btn-group ${className}`}>
            {children}
        </div>
    )
}
