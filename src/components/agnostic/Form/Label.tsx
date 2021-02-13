import React from 'react'

export const Label = ({ slider = true, className, children, ...otherProps }) => {
    return (
        <label className={`form-label ${slider && 'sliding-label'} ${className}`} {...otherProps} >
            {children}
        </label>
    )
}
