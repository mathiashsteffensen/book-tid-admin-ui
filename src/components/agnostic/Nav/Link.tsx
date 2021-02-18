import React from 'react'
//@ts-nocheck
export const Link = React.forwardRef(({ className, children, ...otherProps }: React.HTMLAttributes<HTMLAnchorElement>, ref) => {
    return (
        <a
            ref={ref}
            className={`nav-link ${className}`}
            {...otherProps}
        >
            {children}
        </a>
    )
})
