import React from 'react'

export interface Row extends React.HTMLAttributes<any> {
    spacing?: string
}

export const Row: React.FC<Row> = ({ className, children, spacing, ...otherProps }) => {
    return (
        <div style={spacing ? {columnGap: spacing} : {}} {...otherProps} className={`row ${className}`}>
            {children}
        </div>
    )
}
