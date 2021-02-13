import React from 'react'

export const Collapse = ({ className, children, ...otherProps}: React.HTMLAttributes<any>) => {
    return (
        <div
            className={`navbar-collapse ${className}`}
            {...otherProps}
        >
            {children}
        </div>
    )
}
