import React, { useRef, useEffect } from 'react';

import { Toolbar } from '@devexpress/dx-react-scheduler-material-ui';

import MyToolbarContent from './MyToolbarContent';

export default function MyToolbar({
    calendars,
    checkedCalendars,
    handleChange,
    syncing,
    appointmentError,
}) {

    const ref = useRef(null)

    useEffect(() => {
        console.log(ref.current, 'ref');
    }, [ref])

    const ToolbarContent = (props) => (
        <MyToolbarContent
            appointmentError={appointmentError}
            syncing={syncing}
            handleChange={handleChange}
            checkedCalendars={checkedCalendars}
            calendars={calendars}
            {...props}
        />
    );
    return <Toolbar ref={ref} flexibleSpaceComponent={ToolbarContent}>hello</Toolbar>;
}
