import React from 'react'

export const Title = ( { className, children, ...otherProps }: React.HTMLAttributes<HTMLDivElement> ) => {
    return (
        <div {...otherProps} className={`card-title ${className}`}>
            {children}
        </div>
    )
}
