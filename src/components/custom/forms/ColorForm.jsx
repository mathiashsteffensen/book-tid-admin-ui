import React, { useState } from 'react';

import { Button } from '@material-ui/core';

import FormModel from './FormModel';
import ColorPicker from './inputs/ColorPicker';

import { updateCalendarColors } from '../../../requests';

export default function ColorForm({ closeForm, formProps }) {
    const { calendarID } = formProps;

    const [onlineColor, setOnlineColor] = useState(formProps.onlineColor);
    const [standardColor, setStandardColor] = useState(formProps.standardColor);

    const handleSave = () => {
        updateCalendarColors(
            localStorage.getItem('apiKey'),
            calendarID,
            onlineColor,
            standardColor
        ).then(closeForm);
    };

    return (
        <FormModel title="Kalender farver" closeForm={closeForm}>
            <ColorPicker
                value={onlineColor}
                onChange={(e) => setOnlineColor(e.target.value)}
                label="Online Farve"
                helpText="Farven der vises i kalenderen når denne medarbejder har en online booking"
            />
            <ColorPicker
                value={standardColor}
                onChange={(e) => setStandardColor(e.target.value)}
                label="Standard Farve"
                helpText="Farven der vises i kalenderen når denne medarbejder har en booking der ikke er lavet online"
            />
            <span className="h-2"></span>
            <Button color="primary" variant="contained" onClick={handleSave}>
                Gem
            </Button>
        </FormModel>
    );
}
