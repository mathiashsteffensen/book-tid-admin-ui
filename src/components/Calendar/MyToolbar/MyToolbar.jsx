import React from 'react'

import {Toolbar} from '@devexpress/dx-react-scheduler-material-ui'

import MyToolbarContent from './MyToolbarContent'

export default function MyToolbar({calendars, checkedCalendars, handleChange}) 
{
    const ToolbarContent = (props) => <MyToolbarContent handleChange={handleChange} checkedCalendars={checkedCalendars} calendars={calendars} {...props}/>
    return (
        <Toolbar
            flexibleSpaceComponent={ToolbarContent}
        >
        </Toolbar>
    )
}
