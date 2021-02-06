import React, { useState } from 'react';

import {
    Avatar,
    makeStyles,
    TextField,
    IconButton,
} from '@material-ui/core';

import Button from 'react-bootstrap/Button'

import Form from '../components/forms/Form';

import { deleteCalendar } from '../requests';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    veryLarge: {
        width: theme.spacing(14),
        height: theme.spacing(14),
    },
}));

export default function CalendarSettings({
    calendar,
    handleNameChange,
    handleEmailChange,
    update,
}) {
    const avatarClass = useStyles();

    const [showForm, setShowForm] = useState(false);
    const [formProps, setFormProps] = useState({});
    const [formType, setFormType] = useState('');

    let handleAvatarForm = () => {
        setFormType('avatar');
        setFormProps({
            pictureURL: calendar.pictureURL,
            avatarClass: avatarClass.veryLarge,
            calendarID: calendar.calendarID,
            updateBG: update,
        });
        setShowForm(true);
    };

    let handleColorForm = () => {
        setFormType('color');
        setFormProps({
            onlineColor: calendar.onlineColor,
            standardColor: calendar.standardColor,
            calendarID: calendar.calendarID,
        });
        setShowForm(true);
    };

    let handleOpeningHoursForm = () => {
        setFormType('opening-hours');
        setFormProps({
            schedule: calendar.schedule,
            name: calendar.name,
            calendarID: calendar.calendarID,
        });
        setShowForm(true);
    };

    let handleCloseForm = () => {
        setShowForm(false);
        setFormType('');
        update();
    };

    let handleDelete = () => {
        let confirmed = window.confirm(
            `Er du sikker på at du vil slette kalenderen for ${calendar.name}? Dette kan ikke gøres om. OBS! Alle bookinger vil stadig være gældende`
        );
        if (confirmed) {
            deleteCalendar(
                localStorage.getItem('apiKey'),
                calendar.calendarID
            ).then(update);
        }
    };

    return (
        <div className="md:w-full my-2 w-10/12 bg-gray-100 rounded px-4 py-3 md:py-2 shadow-sm flex flex-col md:flex-row justify-between items-center">
            <IconButton onClick={handleAvatarForm}>
                <Avatar
                    className={avatarClass.large}
                    alt="kalendar profil billede"
                    src={calendar.pictureURL}
                />
            </IconButton>

            <IconButton onClick={handleColorForm}>
                <Avatar
                    className={avatarClass.small}
                    style={{ backgroundColor: calendar.onlineColor }}
                >
                    <span></span>
                </Avatar>

                <span className="w-2"></span>

                <Avatar
                    className={avatarClass.small}
                    style={{ backgroundColor: calendar.standardColor }}
                >
                    <span></span>
                </Avatar>
            </IconButton>

            <TextField
                variant="outlined"
                size="small"
                value={calendar.name}
                onChange={(e) => handleNameChange(e.target.value, calendar._id)}
            />
            <span className="md:h-0 h-4"></span>
            <TextField
                variant="outlined"
                className="w-full md:w-1/3"
                size="small"
                value={calendar.email}
                onChange={(e) =>
                    handleEmailChange(e.target.value, calendar._id)
                }
            />

            <div className="my-3">
                <Button variant="outline-primary" className="mr-2" onClick={handleOpeningHoursForm}>
                    Åbningstider
                </Button>
                <Button variant="outline-danger" onClick={handleDelete}>
                    Slet
                </Button>
            </div>
            {showForm ? (
                <Form
                    formProps={formProps}
                    isOpen={showForm}
                    formType={formType}
                    handleClose={handleCloseForm}
                />
            ) : null}
        </div>
    );
}
