import React from 'react'

export const ButtonGroup = ({ children }) => {
    return (
        <div role="group" className="btn-group">
            {children}
        </div>
    )
}
