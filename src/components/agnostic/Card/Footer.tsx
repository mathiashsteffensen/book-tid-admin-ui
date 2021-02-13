import React from 'react'

export const Footer = ({className, children, ...otherProps}) => {
    return (
        <div {...otherProps} className={`card-footer ${className}`}>
            {children}
        </div>
    )
}
