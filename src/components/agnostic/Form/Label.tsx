import React from 'react'

export interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
    slider?: boolean,
}

export interface Label extends React.FC<LabelProps> {}

export const Label: Label = ({ slider = true, className, children, ...otherProps }) => {
    return (
        <label className={`form-label ${slider && 'sliding-label'} ${className}`} {...otherProps} >
            {children}
        </label>
    )
}
