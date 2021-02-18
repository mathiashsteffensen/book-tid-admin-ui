import React from 'react'

import { Body } from './Body'
import { Header } from './Header'
import { Footer } from './Footer'
import { Text } from './Text'
import { Title } from './Title'

export interface Card extends React.FC<React.HTMLAttributes<HTMLDivElement>> {
    Header: typeof Header,
    Body: typeof Body,
    Footer: typeof Footer,
    Text: typeof Text,
    Title: typeof Title
}

export const Card: Card = ( { className = '', children, ...otherProps } ) => {
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