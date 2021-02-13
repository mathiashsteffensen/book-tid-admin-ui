import React, { ReactChild, } from 'react'

export interface FlexContainer extends React.HTMLAttributes<any> {
    align?: string,
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse',
    justify?: string,
    children: ReactChild | Array<ReactChild>,
    className?: string,
}

export const FlexContainer = ( { align = 'center', direction = 'row', justify = 'center', children, className, ...otherProps }: FlexContainer ) => 
{
    return (
        <div {...otherProps} style={{
            alignItems: align,
            flexDirection: direction,
            justifyContent: justify
        }} className={`flex-container ${className}`}>
            {children}
        </div>
    )
}
