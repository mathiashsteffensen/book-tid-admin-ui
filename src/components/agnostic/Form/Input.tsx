import React from 'react'

export interface Input extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
    customSize?: 'sm' | 'lg',
    textarea?: boolean,
    select?: boolean,
    children?: React.ReactChild | React.ReactChildren
}

export const Input = ( { variant = 'primary', customSize = '', placeholder = " ", textarea = false, select = false, children, className, ...otherProps } ) => {
    if (textarea) return <textarea placeholder={placeholder} className={`input ${variant} ${customSize} ${className}`} {...otherProps}/>
    if (select) return <select placeholder={placeholder} className={`input ${variant} ${customSize} ${className}`} {...otherProps}>{children}</select>

    return <input placeholder={placeholder} className={`input ${variant} ${customSize} ${className}`} {...otherProps}/>
}

export interface Feedback extends React.HTMLAttributes<any> {
    type: "invalid" | "valid"
}

export const Feedback = ( { type, className, children, ...otherProps } ) => (
    <span className={`${type}-feedback ${className}`} {...otherProps} >
        {children}
    </span>
)

Input.Feedback = Feedback