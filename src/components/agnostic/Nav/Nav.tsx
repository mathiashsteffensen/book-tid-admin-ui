import React from 'react'

import { Link } from './Link'

export const Nav = ({ className, children, ...otherProps }: React.HTMLAttributes<any>) => {
    return (
        <div {...otherProps} className={`nav ${className}`}>
            {children}
        </div>
    )
}

Nav.Link = Link