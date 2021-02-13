import React from 'react';

import { Checkbox } from '@material-ui/core';

export default function LabelledCheckbox({ checked, onChange, label }) {
    return (
        <label>
            <Checkbox checked={checked} onChange={onChange} />
            <span className="text-sm">{label}</span>
        </label>
    );
}
