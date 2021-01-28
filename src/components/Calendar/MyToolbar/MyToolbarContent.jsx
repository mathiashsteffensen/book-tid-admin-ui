import React from 'react'

import {Toolbar} from '@devexpress/dx-react-scheduler-material-ui'

import Spinner from 'react-bootstrap/Spinner'

import WorkerCheckBox from './WorkerCheckBox'

export default function MyToolbarContent({calendars, checkedCalendars, handleChange, syncing, appointmentError}) {
    return (
        <Toolbar.FlexibleSpace
            className="flex justify-center items-center px-4 ml-0 mr-auto"
        >
            { appointmentError && <span className="text-danger text-sm mr-4 w-64">Der skete en fejl med at vise dine bookinger, genindlæs venligst siden, hvis problemet bliver ved <a className="link" href="mailto:service@booktid.net" >kontakt os</a></span> }
            { syncing && <Spinner variant="primary" className="mr-4" animation="border" /> }
            <div
                className="flex justify-center items-center flex-col sm:flex-row"
            >
                {calendars.map(calendar => <WorkerCheckBox key={calendar._id} calendar={calendar} checkedCalendars={checkedCalendars} handleChange={handleChange} />)}
            </div>
        </Toolbar.FlexibleSpace>
    )
}
