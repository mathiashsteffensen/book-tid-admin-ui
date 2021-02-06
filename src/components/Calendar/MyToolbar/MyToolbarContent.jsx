import React from 'react';

import { Toolbar } from '@devexpress/dx-react-scheduler-material-ui';

import Spinner from 'react-bootstrap/Spinner';

import WorkerCheckBox from './WorkerCheckBox';

export default function MyToolbarContent({
    calendars,
    checkedCalendars,
    handleChange,
    syncing,
    appointmentError,
}) {
    return (
        <Toolbar.FlexibleSpace className="flex justify-center w-2/3 h-20 items-center mr-auto z-0 sm:my-0 ml-2">
            {appointmentError && (
                <span className="text-danger text-sm mr-4 w-64">
                    Der skete en fejl med at vise dine bookinger, genindlæs
                    venligst siden, hvis problemet bliver ved{' '}
                    <a className="link" href="mailto:service@booktid.net">
                        kontakt os
                    </a>
                </span>
            )}
            {syncing && (
                <Spinner
                    variant="primary"
                    className="mr-4"
                    animation="border"
                />
            )}
            {calendars.length > 1 ? <div style={{
                paddingLeft: `${calendars.length * 4.7}rem`,
                marginRight: `${calendars.length * 3.33}rem`
            }} className="flex justify-center h-full overflow-x-auto sm:p-0 w-full ml-3 items-center">
                {calendars.map((calendar) => (
                    <WorkerCheckBox
                        key={calendar._id}
                        calendar={calendar}
                        checkedCalendars={checkedCalendars}
                        handleChange={handleChange}
                    />
                ))}
            </div>
            : <div className="flex justify-center h-full sm:p-0 w-full ml-0 pr-auto items-center">
                {calendars.map((calendar) => (
                    <WorkerCheckBox
                        key={calendar._id}
                        calendar={calendar}
                        checkedCalendars={checkedCalendars}
                        handleChange={handleChange}
                    />
                ))}
            </div>}
        </Toolbar.FlexibleSpace>
    );
}
