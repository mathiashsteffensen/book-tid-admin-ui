import React from 'react'

import {Toolbar} from '@devexpress/dx-react-scheduler-material-ui'

import WorkerCheckBox from './WorkerCheckBox'

export default function MyToolbarContent({calendars, checkedCalendars, handleChange}) {
    return (
        <Toolbar.FlexibleSpace
            className="flex justify-center items-center px-4 ml-0 mr-auto"
        >
            <div
                className="flex justify-center items-center flex-col sm:flex-row"
            >
                {calendars.map(calendar => <WorkerCheckBox calendar={calendar} checkedCalendars={checkedCalendars} handleChange={handleChange} />)}
            </div>
        </Toolbar.FlexibleSpace>
    )
}
