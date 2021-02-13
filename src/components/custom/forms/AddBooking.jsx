import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import axios from 'axios';

import FormModel from './FormModel';
import LabelledSelect from './inputs/LabelledSelect';
import { Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {
    customerSearch,
    getCatsAndServices,
    createAppointment,
} from '../../../requests';

export default function AddBooking({ closeForm, formProps }) {
    const { onlyOneCalendar, calendars } = formProps;

    const [error, setError] = useState('');

    const [state, setState] = useState({
        startTime: dayjs().add(1, 'day').minute(0).format('YYYY-MM-DDTHH:mm'),
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [customerList, setCustomerList] = useState([
        {
            name: '',
            email: '',
            phoneNumber: '',
        },
    ]);

    const [services, setServices] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedCalendar, setSelectedCalendar] = useState(
        onlyOneCalendar ? calendars[0].calendarID : ''
    );

    useEffect(() => {
        const abortController = axios.CancelToken.source();

        customerSearch(
            localStorage.getItem('apiKey'),
            searchTerm,
            0,
            '+name',
            20,
            abortController
        )
            .then((res) => {
                console.log(res);
                setCustomerList(res);
            })
            .catch((err) =>
                setError(err.message !== 'Cancel' ? err.message : '')
            );

        return () => abortController.cancel();
    }, [searchTerm]);

    useEffect(() => {
        const abortController = axios.CancelToken.source();

        getCatsAndServices(localStorage.getItem('apiKey'), abortController)
            .then((res) => {
                setServices(
                    res.map((catAndServices) => catAndServices.services).flat()
                );
            })
            .catch((err) =>
                setError(err.message !== 'Cancel' ? err.message : '')
            );
    }, []);

    const handleSubmit = () => {
        if (selectedService !== '') {
            let service = services.filter(
                (service) => service._id === selectedService
            )[0];
            const startTime = dayjs(state.startTime).add(1, 'hour');
            const endTime = startTime.add(
                service.minutesTaken + service.breakAfter,
                'minutes'
            );
            console.log(selectedCustomer);
            createAppointment(
                localStorage.getItem('apiKey'),
                selectedCalendar,
                selectedCustomer._id,
                service.name,
                startTime,
                endTime
            )
                .then(closeForm)
                .catch((err) => {
                    setError(err.message);
                });
        } else setError('Vælg venligst en service');
    };

    return (
        <FormModel
            title={
                onlyOneCalendar
                    ? `Opret booking hos ${calendars[0].name}`
                    : `Opret booking`
            }
            closeForm={closeForm}
        >
            <div className="flex flex-col justify-center items-center w-full px-6 py-4">
                <TextField
                    required
                    type="datetime-local"
                    label="Start tid"
                    defaultValue={state.startTime}
                    onChange={(e) => setState({ startTime: e.target.value })}
                />
                <span className="h-4"></span>
                <Autocomplete
                    required
                    disableClearable
                    onChange={(e, value) => setSelectedCustomer(value)}
                    value={selectedCustomer}
                    id="customer-search-select"
                    size="small"
                    style={{ width: 250 }}
                    options={customerList}
                    getOptionLabel={(option) => option.name || ''}
                    getOptionSelected={(option, value) => {
                        if (value) return option._id === value._id;
                        else if (value === '') return true;
                        return false;
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            style={{ fontSize: '12px' }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            label="Kunde"
                            placeholder="Søg på navn, email el. tlf."
                            variant="outlined"
                        />
                    )}
                />
                <span className="h-4"></span>
                {services.length !== 0 && (
                    <LabelledSelect
                        required
                        label="Service"
                        options={customerList}
                        variant="outlined"
                        style={{ width: 250 }}
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        options={services.map((service) => {
                            return {
                                value: service._id,
                                text:
                                    service.name + ' ' + service.cost + ' kr.',
                            };
                        })}
                    />
                )}
                <span className="h-4"></span>
                {calendars.length !== 1 && (
                    <LabelledSelect
                        required
                        label="Medarbejder"
                        variant="outlined"
                        style={{ width: 250 }}
                        value={selectedCalendar}
                        onChange={(e) => setSelectedCalendar(e.target.value)}
                        options={calendars.map((calendar) => {
                            return {
                                value: calendar.calendarID,
                                text: calendar.name,
                            };
                        })}
                    />
                )}
            </div>

            <Button
                onClick={handleSubmit}
                margin="normal"
                variant="contained"
                color="primary"
            >
                Opret
            </Button>

            <h4 className="text-red-700 mt-2">{error}</h4>
        </FormModel>
    );
}
