import React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
    customSize?: 'sm' | 'lg'
}

export const Select = ( { children, variant = 'primary', customSize, ...otherProps }: SelectProps ) => (
    <div className={`select ${variant} ${customSize}`} >
        <select {...otherProps}>
            {children}
        </select>
    </div>
)
