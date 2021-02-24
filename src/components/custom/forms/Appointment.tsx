import React, { useState, useEffect } from 'react'

import dayjs from 'dayjs';
import axios from 'axios';

import { Form } from '../../agnostic/Form/Form'
import { Spinner } from '../../agnostic/Spinner';

import { FormLayout } from './FormLayout'

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import useAJAX from '../../../hooks/useAJAX'
import useCustomerSearch from '../../../hooks/useCustomerSearch'

import {
    customerSearch,
    getCatsAndServices,
    createAppointment,
} from '../../../requests';
import { Button } from '../../agnostic/Button';
import { Alert } from '../../agnostic/Alert';


export interface AppointmentProps {
    calendars: any,
    appointmentData: any
}

export interface Appointment extends React.FC<AppointmentProps> {}

const abortController = axios.CancelToken.source();

export const Appointment: Appointment = ({ calendars, appointmentData }: AppointmentProps) => {
    const [searchTerm, setSearchTerm] = useState('')

    const { loading: servicesLoading, data: catsAndServices, error }: {loading: boolean, data: any, error: undefined | Error} = useAJAX(getCatsAndServices, [localStorage.getItem('apiKey'), abortController], {fakeTimeOut: 30})

    const { data: customerList, loading, error: searchError } = useAJAX(customerSearch, [localStorage.getItem('apiKey'), searchTerm, 0, '+name', 20, abortController], {})

    const [selectedService, setSelectedService] = useState('')
    const [selectedCalendar, setSelectedCalendar] = useState(calendars[0].calendarID)
    
    return (
        <FormLayout
            title={appointmentData ? "Rediger Booking" : "Ny Booking"}
        >
            <Form>
                <Form.Group>
                    <Form.Label slider={false}>Start Tid</Form.Label>
                    <Form.Input 
                        required
                        type="datetime-local"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label slider={false}>Kunde</Form.Label>
                    <Autocomplete
                        disableClearable
                        id="customer-search-select"
                        size="small"
                        options={customerList || []}
                        getOptionLabel={(option: any) => option.name || ''}
                        getOptionSelected={(option, value) => {
                            if (value) return option._id === value._id;
                            else if (value === '') return true;
                            return false;
                        }}
                        loading={loading}
                        noOptionsText="Ingen Kunder"
                        loadingText="Indlæser..."
                        className="w-full"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                autoComplete="none"
                                required
                                className="input primary w-full"
                                style={{ fontSize: '12px' }}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                placeholder="Søg på navn, email el. tlf."
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <Spinner size="sm" variant="primary" /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                    { searchError && <Alert variant="danger">Der skete en fejl med at indlæse dine kunder, prøv venligst igen</Alert> }
                </Form.Group>

                <Form.Group>
                    <Form.Label slider={false}>Service</Form.Label>
                    {(!servicesLoading && catsAndServices && !error) && <Form.Input onChange={e => setSelectedService(e.target.value)} value={selectedService} select>
                        { catsAndServices.map((catAndServices) => catAndServices.services).flat().map((service) => <option value={service._id} >{service.name}</option>) }
                        <option value="" ></option>
                    </Form.Input>}

                    { (servicesLoading && !error) && <Spinner variant="primary" /> }
                </Form.Group>

                <Form.Group>
                    <Form.Label>Medarbejder</Form.Label>
                    <Form.Input 
                        select
                        value={selectedCalendar}
                        onChange={(e) => setSelectedCalendar(e.target.value)} 
                    >
                        { calendars.map(calendar => <option value={calendar.calendarID}>{calendar.name}</option>) }
                    </Form.Input>
                </Form.Group>

                <Form.Group className="py-4">
                    <Button>Opret Booking</Button>
                </Form.Group>
            </Form>
        </FormLayout>
    )
}
