import React from 'react';

import { Toolbar } from '@devexpress/dx-react-scheduler-material-ui';

import { Spinner } from '../../../agnostic/Spinner';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MyToolbarContent({
    calendars,
    checkedCalendars,
    handleChange,
    syncing,
    appointmentError,
}) {
    return (
        <Toolbar.FlexibleSpace className="flex my-4 justify-center w-3/5 h-20 items-center mr-auto sm:my-0 ml-2">
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
                />
            )}

            <Autocomplete
                className="w-92" 
                multiple
                options={calendars}
                getOptionLabel={(option) => option.name}
                defaultValue={calendars}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Vis tider for"
                    />
                )}
                renderOption={(option, { selected }) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </React.Fragment>
                )}
                getOptionSelected={(option, value) => option._id === value._id}
                disableCloseOnSelect
                disableClearable
                onChange={(e, value) => handleChange(value)}
                value={checkedCalendars}
            />
        </Toolbar.FlexibleSpace>
    );
}
