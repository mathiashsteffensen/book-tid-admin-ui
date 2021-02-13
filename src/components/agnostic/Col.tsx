import React from 'react'

export interface Col extends React.HTMLAttributes<any> {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export const Col = ({ className, children, sm = 12, md, lg, xl, ...otherProps }) => {
    return (
        <div {...otherProps} className={`col sm-${sm} md-${md} lg-${lg} xl-${xl} ${className}`}>
            {children}
        </div>
    )
}
