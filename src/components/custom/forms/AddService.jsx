import React, { useState, useEffect } from 'react';

import {
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    Checkbox,
    Switch,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CloseIcon from '@material-ui/icons/Close';

import FormModel from './FormModel';

import axios from 'axios';

import { createService, getAllCalendars } from '../../../requests';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddService({ closeForm, formProps }) {
    const categoryList = formProps.categoryList;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [minutesTaken, setMinutesTaken] = useState(30);
    const [breakAfter, setBreakAfter] = useState(0);
    const [price, setPrice] = useState(0);

    const [category, setCategory] = useState('Uden Kategori');
    const [elgibleCalendars, setElgibleCalendars] = useState([]);
    const [onlineBooking, setOnlineBooking] = useState(true);

    const [calendars, setCalendars] = useState(false);

    const [error, setError] = useState('');

    const abortController = axios.CancelToken.source();

    useEffect(() => {
        getAllCalendars(localStorage.getItem('apiKey'), abortController).then(
            (res) =>
                setCalendars(
                    res.map((calendar) => {
                        return {
                            id: calendar._id,
                            name: calendar.name,
                        };
                    })
                )
        );
    }, []);

    const handleSubmit = () => {
        const data = {
            name,
            description,
            minutesTaken,
            breakAfter,
            elgibleCalendars,
            onlineBooking,
            categoryName: category === 'Uden Kategori' ? '' : category,
            cost: price,
            allCalendars: false,
        };
        createService(localStorage.getItem('apiKey'), data)
            .then(() => closeForm())
            .catch((err) => setError(err.response.data.msg));
    };

    const resetError = () => {
        setError('');
    };

    return (
        <FormModel
            title="Opret Service"
            subtitle="Tilføj en ny service"
            closeForm={closeForm}
            resetError={resetError}
        >
            <div className="flex flex-col justify-center items-center w-full px-6 pb-4">
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Navn på service"
                    size="small"
                    margin="normal"
                    className="w-full"
                    color="primary"
                    type="text"
                    required
                    variant="outlined"
                />
                <TextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    label="Beskrivelse"
                    margin="normal"
                    className="w-full"
                    color="primary"
                    type="text"
                    multiline
                    rows="5"
                    variant="outlined"
                />

                <div className="flex flex-col md:flex-row w-full justify-between items-center">
                    <div className="flex w-full md:w-1/2 flex-col justify-between items-center">
                        <TextField
                            value={minutesTaken}
                            onChange={(e) => setMinutesTaken(e.target.value)}
                            label="Tid (i alt i minutter)"
                            size="small"
                            margin="normal"
                            className="w-full"
                            color="primary"
                            type="number"
                            required
                            variant="outlined"
                            helperText="Den samlede tid fra kunden kommer til kunden er ude af døren igen."
                            inputProps={{
                                step: 5,
                                min: 5,
                                max: 1440,
                            }}
                        />
                        <TextField
                            value={breakAfter}
                            onChange={(e) => setBreakAfter(e.target.value)}
                            label="Pause efter"
                            size="small"
                            margin="normal"
                            className="w-full"
                            color="primary"
                            type="number"
                            required
                            variant="outlined"
                            helperText="Pause efter tillægges den samlede tid. Så hvis den samlede tid er 55 min og pause efter er 5 min så er total tiden 60 min i din kalender"
                            inputProps={{
                                step: 5,
                                min: 5,
                                max: 1440,
                            }}
                        />

                        <TextField
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            label="Pris"
                            size="small"
                            margin="normal"
                            className="w-full"
                            color="primary"
                            type="number"
                            required
                            variant="outlined"
                            inputProps={{
                                step: 50,
                            }}
                        />
                    </div>
                    <span className="md:h-64 mx-4 my-2 flex bg-blue-700 md:w-border opacity-50"></span>
                    <div className="flex w-full md:w-1/2 flex-col justify-between items-center">
                        <Select
                            variant="outlined"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full my-4"
                        >
                            {categoryList.map((category, i) => (
                                <MenuItem key={i} value={category.name}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>

                        {calendars ? (
                            <Autocomplete
                                multiple
                                required
                                className="w-full my-2"
                                options={calendars}
                                value={elgibleCalendars}
                                onChange={(event, value) => {
                                    setElgibleCalendars(value);
                                }}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.name}
                                renderOption={(option, { selected }) => {
                                    return (
                                        <React.Fragment>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </React.Fragment>
                                    );
                                }}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            onChange={(e) =>
                                                console.log(e.target)
                                            }
                                            variant="outlined"
                                            label="Hvem kan udføre servicen"
                                        />
                                    );
                                }}
                            />
                        ) : null}

                        <label className="mt-2">
                            Online Booking
                            <Switch
                                checked={onlineBooking}
                                onChange={() =>
                                    setOnlineBooking(!onlineBooking)
                                }
                                name="Online Booking"
                                color="primary"
                            />
                        </label>
                        <i className="MuiFormHelperText-root not-italic">
                            Giver kunder mulighed for at booke servicen online,
                            ellers kan den kun bookes internt
                        </i>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                margin="normal"
                variant="contained"
                color="primary"
            >
                Opret
            </Button>

            <h4 className="mt-2 text-red-600">{error}</h4>
        </FormModel>
    );
}
