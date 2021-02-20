import React from 'react'

export const Brand = ({ children, className, ...otherProps }: React.LinkHTMLAttributes<any>) => {
    return (
        <div {...otherProps} className={`navbar-brand ${className}`}>
            {children}
        </div>
    )
}
