import React from 'react'

export const Header = ( { children, ...otherProps } ) => {
    return (
        <div {...otherProps} className="card-header">
            {children}
        </div>
    )
}
