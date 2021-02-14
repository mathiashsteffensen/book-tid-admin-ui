import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
    customSize?: 'sm' | 'lg',
    textarea?: boolean,
    select?: boolean,
    children?: React.ReactChild | React.ReactChildren
}

export interface Input extends React.FC<InputProps> {
    Feedback: Feedback
}

export const Input: Input = ( { variant = 'primary', customSize = '', placeholder = " ", textarea = false, select = false, children, className, ...otherProps } ) => {
    if (textarea) return <textarea placeholder={placeholder} className={`input ${variant} ${customSize} ${className}`} {...otherProps}/>
    if (select) return <select placeholder={placeholder} className={`input ${variant} ${customSize} ${className}`} {...otherProps}>{children}</select>

    return <input placeholder={placeholder} className={`input ${variant} ${customSize} ${className}`} {...otherProps}/>
}

export interface FeedbackProps extends React.HTMLAttributes<any> {
    type: "invalid" | "valid"
}

export interface Feedback extends React.FC<FeedbackProps> {

}

export const Feedback: Feedback = ( { type, className, children, ...otherProps } ) => (
    <span className={`${type}-feedback ${className}`} {...otherProps} >
        {children}
    </span>
)

Input.Feedback = Feedback
