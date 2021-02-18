import React from 'react'

export const Text = ({ children, className, ...otherProps }: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <p {...otherProps} className={`card-text ${className}`}>
            {children}
        </p>
    )
}
