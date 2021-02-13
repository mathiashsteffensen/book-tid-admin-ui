import React from 'react'

export const InputGroup = ( { children, className, ...otherProps }: React.HTMLAttributes<any> ) => {
    return (
        <div {...otherProps} className={`input-group ${className}`}>
            {children}
        </div>
    )
}

InputGroup.Append = ( { children, className, ...otherProps }: React.HTMLAttributes<any> ) => {
    return (
        <div {...otherProps} className={`input-group-append ${className}`}>
            {children}
        </div>
    )
}

InputGroup.Text = ( { children, className, ...otherProps }: React.HTMLAttributes<any> ) => {
    return (
        <span {...otherProps} className={`input-group-text ${className}`}>
            {children}
        </span>
    )
}