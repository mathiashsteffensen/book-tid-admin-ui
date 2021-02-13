import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Label = ({ name, onlineColor, standardColor }) => {
    return (
        <div className="flex flex-col justify-between items-center">
            {name}

            <div className="flex">
                <div className="ml-1 flex flex-col justify-center items-center text-xs">
                    Online
                    <span
                        className="w-2 h-2 circle"
                        style={{ backgroundColor: onlineColor }}
                    ></span>
                </div>

                <div className="ml-1 flex flex-col justify-center items-center text-xs">
                    Standard
                    <span
                        className="w-2 h-2 circle"
                        style={{ backgroundColor: standardColor }}
                    ></span>
                </div>
            </div>
        </div>
    );
};

export default function WorkerCheckBox({
    calendar,
    checkedCalendars,
    handleChange,
}) {
    return (
        <>
            <FormControlLabel
                key={calendar.calendarID}
                className="pr-3 mx-auto sm:mr-4 rounded-sm border-primary"
                label={
                    <Label
                        standardColor={calendar.standardColor}
                        onlineColor={calendar.onlineColor}
                        name={calendar.name}
                    />
                }
                control={
                    <Checkbox
                        checked={
                            checkedCalendars.indexOf(calendar.calendarID) !== -1
                        }
                        onChange={() => handleChange(calendar.calendarID)}
                    />
                }
            />
        </>
    );
}
