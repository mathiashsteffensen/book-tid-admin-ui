import React from 'react'

import {Toolbar} from '@devexpress/dx-react-scheduler-material-ui'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

export default function MyToolbarContent({calendars, checkedCalendars, handleChange}) {
    return (
        <Toolbar.FlexibleSpace
            className="flex justify-center items-center w-full ml-0 mr-auto px-4"
        >
            <div
                className="flex justify-center items-center flex-row"
            >
                {calendars.map(calendar => <FormControlLabel className="pr-3 mr-4 rounded-sm" style={{backgroundColor: calendar.standardColor}} label={calendar.name} control={
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
