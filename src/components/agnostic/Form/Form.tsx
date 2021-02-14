import React, { RefAttributes } from 'react'

import { Input } from './Input'
import { Group } from './Group'
import { Label } from './Label'
import { Switch } from './Switch'
import { Row } from './Row'

export interface FormProps extends React.FormHTMLAttributes<any> {
    validated?: boolean
}

export interface Form extends React.FC<RefAttributes<FormProps>> {
    Group: Group,
    Input: Input,
    Control: Input,
    Label: Label,
    Switch: Switch,
    Row: React.FC<any>
}
//@ts-ignore
export const Form: Form = React.forwardRef<FormProps>(( { children, className, validated = false, ...otherProps }: FormProps, ref: React.ForwardedRef<any> ) => {
    return (
        <form ref={ref} className={`form ${className} ${validated && 'was-validated'}`} {...otherProps} >
            {children}
        </form>
    )
})

Form.Input = Input
Form.Control = Input
Form.Group = Group
Form.Label = Label
Form.Switch = Switch
Form.Row = Row