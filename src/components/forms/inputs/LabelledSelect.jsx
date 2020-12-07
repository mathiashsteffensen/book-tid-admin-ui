import React from 'react'

import {FormControl, InputLabel, Select, MenuItem} from '@material-ui/core'

export default function LabelledSelect({label, value, onChange, options, variant}) 
{
    return (
        <FormControl
            size="small"
            style={{width: 250}}
            variant={variant}
        >
            <InputLabel className="text-md" id={label}>{label}</InputLabel>
            <Select
                labelId={label}
                id={label}
                value={value}
                onChange={onChange}
            >
                {options.map((option, i) => <MenuItem key={i} value={option.value}>{option.text}</MenuItem>)}
            </Select>
        </FormControl>
    )
}
