import React from 'react'

export const Item = ({ children, className, ...otherProps }) => {
    return (
        <li className={`list-group-item ${className}`} {...otherProps} >
            {children}
        </li>
    )
}
