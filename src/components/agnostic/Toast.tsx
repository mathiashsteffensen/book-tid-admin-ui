import React, { useState, useEffect } from 'react'
import { useTimeout } from 'react-use';

import { Card } from './Card/Card'

export interface Toast extends React.HTMLAttributes<any> {
    show: boolean,
    delay?: number
}

export const Toast = ({ show, delay = 300, onClose, className, children, ...otherProps }) => {
    if (show) {

        const [isReady] = useTimeout(delay);

        if (isReady()) onClose()
        else return (
            <Card
                role="alert"
                aria-live="assertive"
                aria-atomic="true" 
                className={`toast ${className}`}
            >
                {children}
            </Card>
        )
    }

    return null;
}

Toast.Header = Card.Header
Toast.Body = Card.Body
Toast.Title = Card.Title
Toast.Text = Card.Text
Toast.Footer = Card.Footer