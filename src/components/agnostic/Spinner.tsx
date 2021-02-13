import React from 'react'

export interface SpinnerProps extends React.HTMLAttributes<any> {
    variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
    size?: 'sm' | 'lg'
}

export const Spinner = ( { variant = 'primary', size, children, className = '', ...otherProps }: SpinnerProps ) => 
{
    return (
        <span {...otherProps} className={`spinner ${variant} ${size} ${className}`}>
            <svg viewBox="0 0 16 16">
                <path fill="#444444" d="M12.9 3.1c1.3 1.2 2.1 3 2.1 4.9 0 3.9-3.1 7-7 7s-7-3.1-7-7c0-1.9 0.8-3.7 2.1-4.9l-0.8-0.8c-1.4 1.5-2.3 3.5-2.3 5.7 0 4.4 3.6 8 8 8s8-3.6 8-8c0-2.2-0.9-4.2-2.3-5.7l-0.8 0.8z"></path>
            </svg>
            {children}
        </span>
    )
}
