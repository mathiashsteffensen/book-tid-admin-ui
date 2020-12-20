import React from 'react'

import {Toolbar} from '@devexpress/dx-react-scheduler-material-ui'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

export default function MyToolbarContent({calendars, checkedCalendars, handleChange}) {
    return (
        <Toolbar.FlexibleSpace
            className="flex justify-center items-center px-4 ml-0 mr-auto"
        >
            <div
                className="flex justify-center items-center flex-col sm:flex-row"
            >
                {calendars.map(calendar => <FormControlLabel key={calendar.calendarID} className="pr-3 mx-auto sm:mr-4 rounded-sm" style={{backgroundColor: calendar.standardColor}} label={calendar.name} control={
                    <Checkbox 
                        checked={checkedCalendars.indexOf(calendar.calendarID) !== -1}
                        onChange={() => handleChange(calendar.calendarID)}
                        style={{color: calendar.onlineColor}}
                    />
                } />)}
            </div>
        </Toolbar.FlexibleSpace>
    )
}
