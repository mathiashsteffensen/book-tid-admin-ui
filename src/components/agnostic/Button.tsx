import React from 'react'


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger' | 'outline-primary' | 'outline-secondary' | 'outline-light' | 'outline-dark' | 'outline-info' | 'outline-warning' | 'outline-danger',
    size?: 'sm' | 'lg'
}

export const Button: React.FC<ButtonProps> = ( { variant = 'primary', size, children, className, ...otherProps } ) => 
{
    const classes = `btn ${ variant } ${ size ? size : '' } ${className}`

    return (
        <button className={ classes } {...otherProps} >{ children }</button>
    )
}
