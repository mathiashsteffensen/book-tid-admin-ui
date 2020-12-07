import React, {useState} from 'react'

import FormModel from '../../FormModel'

import {AppBar, Tab, Tabs}from '@material-ui/core/'
import NormalHours from './NormalHours'
import SpecialHours from './SpecialHours'

import {updateCalendarSchedule} from '../../../../requests'

export default function OpeningHours({closeForm, formProps}) 
{
    const {schedule, name, calendarID} = formProps

    const updateSchedule = (newSchedule) =>
    {
        updateCalendarSchedule(localStorage.getItem('apiKey'), calendarID, newSchedule).then(closeForm).catch((err) => console.log(err))
    }

    const [tabIndex, setTabIndex] = useState(0)

    const handleTabChange = (e, newIndex) =>
    {
        setTabIndex(newIndex)
    }

    return (
        <FormModel
            title="Åbningstider"
            subtitle="Sæt dine åbningstider og ferie"
            closeForm={closeForm}
        >
            <span className="h-4"></span>
            <AppBar
                position="relative"
                color="transparent"
                className="w-full"
                style={{boxShadow: 'none'}}
            >
                <Tabs
                    variant="fullWidth"
                    value={tabIndex}
                    onChange={handleTabChange}
                >
                    <Tab
                        component="a"
                        label="Åbningstider"
                        id={0}
                        className="outline-none"
                    />
                    <Tab
                        component="a"
                        label="Specielle åbningstider"
                        id={1}
                        className="outline-none"
                    />
                </Tabs>
            </AppBar>

            <NormalHours updateSchedule={updateSchedule} schedule={schedule} name={name} value={tabIndex} index={0} />

            <SpecialHours updateSchedule={updateSchedule} schedule={schedule} name={name} value={tabIndex} index={1} />

        </FormModel>
    )
}
