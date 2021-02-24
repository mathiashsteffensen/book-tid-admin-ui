import { group } from 'console'
import React, { ReactChild, useRef } from 'react'

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse',
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export interface Group extends React.FC<GroupProps> {}

export const Group: Group = ( { direction = 'column', children, md = 12, sm = 12, lg = 12, xl = 12, className, ...otherProps } ) => 
{
    const groupRef = useRef(null)

    const handleGroupClick = (e): void => {
        if (e.target instanceof HTMLLabelElement) {
            // @ts-ignore
            groupRef.current.children[0].focus()
        }
    }

    return (
        <div onClick={handleGroupClick} ref={groupRef} {...otherProps} style={{
            alignItems: "center",
            flexDirection: direction,
            justifyContent: "start"
        }} className={`flex-container form-group md-${md} ${className}`}>
            {children}
        </div>
    )
}
