import React from 'react'

export const Footer = ({className, children, ...otherProps}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...otherProps} className={`card-footer ${className}`}>
            {children}
        </div>
    )
}
