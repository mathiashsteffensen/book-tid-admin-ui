import React from 'react'

export const Title = ( { className, children, ...otherProps } ) => {
    return (
        <div {...otherProps} className={`card-title ${className}`}>
            {children}
        </div>
    )
}
