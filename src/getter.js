import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/da';
dayjs.locale('da');
dayjs.extend(utc);

const API_URI =
    process.env.NODE_ENV === 'production'
        ? 'https://api.booktid.net/admin'
        : 'http://localhost:4000/admin';

import {
    getAppointmentsByCalendarMonth,
    getAppointmentsByWeek,
    getAppointmentsByDay,
} from './requests';

async function getter(ENDPOINT) {
    return await axios
        .get(API_URI + ENDPOINT)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });
}

async function appointmentGetter(
    viewType,
    date,
    apiKey,
    calendars,
    selectedCalendars
) {
    const abortController = axios.CancelToken.source();
    switch (viewType) {
        case 'Month':
            return await getAppointmentsByCalendarMonth(
                apiKey,
                dayjs(date).add(1, 'hour').format('YYYY-MM-DD'),
                abortController
            )
                .then((res) => {
                    let flattened = res.flat();

                    return flattened
                        .filter(
                            (appointment) =>
                                selectedCalendars.indexOf(
                                    appointment.calendarID
                                ) !== -1
                        )
                        .map((appointment) => {
                            const ownerCalendar = calendars.filter(
                                (calendar) =>
                                    calendar.calendarID ===
                                    appointment.calendarID
                            )[0];

                            return {
                                startDate: dayjs(appointment.startTime)
                                    .subtract(1, 'hour')
                                    .toJSON(),
                                endDate: dayjs(appointment.endTime)
                                    .subtract(1, 'hour')
                                    .toJSON(),
                                title: appointment.service,
                                id: appointment._id,
                                calendarID: appointment.bookedOnline
                                    ? ownerCalendar.calendarID + 'online'
                                    : ownerCalendar.calendarID,
                                calendarName: ownerCalendar.name,
                                color: appointment.bookedOnline
                                    ? ownerCalendar.onlineColor
                                    : ownerCalendar.standardColor,
                                bookedOnline: appointment.bookedOnline,
                            };
                        });
                })
                .catch((err) => {
                    throw new Error(err);
                });
            break;

        case 'Week':
            return await getAppointmentsByWeek(
                apiKey,
                dayjs(date).add(1, 'hour').format('YYYY-MM-DD'),
                abortController
            )
                .then((res) => {
                    return res
                        .filter(
                            (appointment) =>
                                selectedCalendars.indexOf(
                                    appointment.calendarID
                                ) !== -1
                        )
                        .map((appointment) => {
                            const ownerCalendar = calendars.filter(
                                (calendar) =>
                                    calendar.calendarID ===
                                    appointment.calendarID
                            )[0];

                            return {
                                startDate: dayjs(appointment.startTime)
                                    .subtract(1, 'hour')
                                    .toJSON(),
                                endDate: dayjs(appointment.endTime)
                                    .subtract(1, 'hour')
                                    .toJSON(),
                                title: appointment.service,
                                id: appointment._id,
                                calendarID: appointment.bookedOnline
                                    ? ownerCalendar.calendarID + 'online'
                                    : ownerCalendar.calendarID,
                                calendarName: ownerCalendar.name,
                                color: appointment.bookedOnline
                                    ? ownerCalendar.onlineColor
                                    : ownerCalendar.standardColor,
                                bookedOnline: appointment.bookedOnline,
                            };
                        });
                })
                .catch((err) => {
                    throw new Error(err);
                });
            break;

        case 'Day':
            return await getAppointmentsByDay(
                apiKey,
                dayjs(date).add(1, 'hour').format('YYYY-MM-DD'),
                abortController
            )
                .then((res) => {
                    console.log(res);
                    return res
                        .filter(
                            (appointment) =>
                                selectedCalendars.indexOf(
                                    appointment.calendarID
                                ) !== -1
                        )
                        .map((appointment) => {
                            const ownerCalendar = calendars.filter(
                                (calendar) =>
                                    calendar.calendarID ===
                                    appointment.calendarID
                            )[0];

                            return {
                                startDate: dayjs(appointment.startTime)
                                    .subtract(1, 'hour')
                                    .toJSON(),
                                endDate: dayjs(appointment.endTime)
                                    .subtract(1, 'hour')
                                    .toJSON(),
                                title: appointment.service,
                                id: appointment._id,
                                calendarID: appointment.bookedOnline
                                    ? ownerCalendar.calendarID + 'online'
                                    : ownerCalendar.calendarID,
                                calendarName: ownerCalendar.name,
                                color: appointment.bookedOnline
                                    ? ownerCalendar.onlineColor
                                    : ownerCalendar.standardColor,
                                bookedOnline: appointment.bookedOnline,
                            };
                        });
                })
                .catch((err) => {
                    throw new Error(err);
                });

        default:
            break;
    }
}

getter.appointment = appointmentGetter;

export default getter;
