import React from 'react'

import { Input } from './Input'
import { Group } from './Group'
import { Label } from './Label'
import { Switch } from './Switch'
import { Row } from './Row'

export interface Form extends React.FormHTMLAttributes<any> {
    validated?: boolean
}

export const Form = React.forwardRef<HTMLFormElement>(( { children, className, validated = false, ...otherProps }: Form, ref ) => {
    return (
        <form ref={ref} className={`form ${className} ${validated && 'was-validated'}`} {...otherProps} >
            {children}
        </form>
    )
})
// @ts-ignore
Form.Input = Input
// @ts-ignore
Form.Control = Input
// @ts-ignore
Form.Group = Group
// @ts-ignore
Form.Label = Label
// @ts-ignore
Form.Switch = Switch
// @ts-ignore
Form.Row = Row