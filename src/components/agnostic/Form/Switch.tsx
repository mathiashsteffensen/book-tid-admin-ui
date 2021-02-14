import React from 'react'

export interface SwitchProps extends React.InputHTMLAttributes<any> {
    square?: boolean,
    customSize?: 'sm',
    variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
}

export interface Switch extends React.FC<SwitchProps> {}

export const Switch: Switch = ( { className, square = false, variant = 'primary', customSize, ...otherProps } ) => {
    return (
        <label className={`switch ${variant} ${customSize} ${className}`}>
            <input {...otherProps} type="checkbox"/>
            <span className={`slider ${square ? '' : 'round'}`}></span>
        </label>
    )
}
