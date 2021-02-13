import React from 'react'

import { Item } from './Item'

export const ListGroup = ( { className, children, ...otherProps} ) => {
    return (
        <ul {...otherProps} className={`list-group ${className}`}>
            {children}
        </ul>
    )
}

ListGroup.Item = Item