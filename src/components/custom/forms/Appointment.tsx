import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import { hideForm } from '../../../redux/slices/actions'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import axios from 'axios';

import { Form } from '../../agnostic/Form/Form'
import { Spinner } from '../../agnostic/Spinner';

import { FormLayout } from './FormLayout'

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import useAJAX from '../../../hooks/useAJAX'

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
    const dispatch = useDispatch()

    const [searchTerm, setSearchTerm] = useState('')

    const { loading: servicesLoading, data: catsAndServices, error }: {loading: boolean, data: any, error: undefined | Error} = useAJAX(getCatsAndServices, [localStorage.getItem('apiKey'), abortController], {fakeTimeOut: 30})

    const { data: customerList, loading, error: searchError } = useAJAX(customerSearch, [localStorage.getItem('apiKey'), searchTerm, 0, '+name', 20, abortController], {})

    const [selectedTime, setSelectedTime] = useState(dayjs.utc().set('hour', 12).set('minute', 0).toJSON().slice(0, 16))
    const [selectedService, setSelectedService] = useState('')
    const [selectedCalendar, setSelectedCalendar] = useState(calendars[0].calendarID)
    const [selectedCustomer, setSelectedCustomer] = useState({_id: null})

    const [submitError, setSubmitError]: [string | false, any] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedCustomer._id === null) return setSubmitError('Vælg venligst en kunde')
        if (selectedService === '') return setSubmitError('Vælg venligst en service')
        
        let service = catsAndServices.map((catAndServices) => catAndServices.services).flat().filter(
            (service) => service._id === selectedService
        )[0];
        const startTime = dayjs.utc(selectedTime);
        const endTime = startTime.add(
            service.minutesTaken + service.breakAfter,
            'minutes'
        );

        setSubmitting(true)

        createAppointment(
            localStorage.getItem('apiKey'),
            selectedCalendar,
            selectedCustomer._id,
            service.name,
            startTime,
            endTime
        )
            .catch((err) => {
                setSubmitError(err.message);
            })
            .finally(() => {
                setSubmitting(false)
                dispatch(hideForm())
            })
    }

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
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
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
                        value={selectedCustomer}
                        onChange={(e, value) => setSelectedCustomer(value)}
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
                    {(!servicesLoading && catsAndServices && !error) && <Form.Input style={selectedService === '' ? {color: 'rgba(0,0,0,0.6)'} : {}} onChange={e => e.target.value !== '' && setSelectedService(e.target.value)} value={selectedService} select>
                        { catsAndServices.map((catAndServices) => catAndServices.services).flat().map((service) => <option style={{color: 'black'}} value={service._id} >{service.name}</option>) }
                        <option value="" >{`<-- Vælg en service -->`}</option>
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

                { submitError && <Alert variant="danger">{submitError}</Alert>}

                <Form.Group className="py-4">
                    <Button className="flex justify-center" onClick={handleSubmit} >{ submitting ? <Spinner variant="light" /> : 'Opret Booking'}</Button>
                </Form.Group>
            </Form>
        </FormLayout>
    )
}
