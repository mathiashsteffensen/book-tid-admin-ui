import React from 'react'

export const Brand = ({ children, className, ...otherProps }: React.LinkHTMLAttributes<any>) => {
    return (
        <a {...otherProps} className={`navbar-brand ${className}`}>
            {children}
        </a>
    )
}
