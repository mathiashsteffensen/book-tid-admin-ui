import React from 'react'

export const Body = ( { children, className, ...otherProps }: React.HTMLAttributes<HTMLDivElement> ) => {
    return (
        <div {...otherProps} className={`card-body ${className}`}>
            {children}
        </div>
    )
}
