import React from 'react'

export const Link = ({ className, children, ...otherProps }: React.LinkHTMLAttributes<any>) => {
    return (
        <a
            className={`nav-link ${className}`}
            {...otherProps}
        >
            {children}
        </a>
    )
}
