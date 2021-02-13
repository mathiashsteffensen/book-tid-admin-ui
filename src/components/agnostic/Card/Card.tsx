import React from 'react'

import { Body } from './Body'
import { Header } from './Header'
import { Footer } from './Footer'
import { Text } from './Text'
import { Title } from './Title'

export const Card = ( { className = '', children, ...otherProps } ) => {
    return (
        <div {...otherProps} className={`card ${className}`}>
            {children}
        </div>
    )
}

Card.Body = Body
Card.Header = Header
Card.Footer = Footer
Card.Text = Text
Card.Title = Title