import React from 'react'
import { useDispatch } from 'react-redux'
import { hideForm } from '../../../redux/slices/actions'

import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

export interface FormLayoutProps {
    title: string,
    subtitle?: string,
    children: React.ReactChild | React.ReactChildren
}

export const FormLayout = ({ title, subtitle, children }: FormLayoutProps) => {
    const dispatch = useDispatch()

    const handleClose = () => dispatch(hideForm())

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center text-gray-100 bg-dark px-4 py-2">
                <div>
                    <h1 className="text-xl">{title}</h1>
                    <h2 className="text-lg">{subtitle}</h2>
                </div>
                <div>
                    <IconButton onClick={handleClose}>
                       <CloseIcon className="text-gray-100" /> 
                    </IconButton>            
                </div>
            </div>
            <div className="px-4 py-2">
                {children}
            </div>
        </div>
    )
}
