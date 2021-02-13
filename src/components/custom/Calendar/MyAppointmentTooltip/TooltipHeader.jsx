import React from 'react';
import dayjs from 'dayjs';
import { deleteAppointment } from '../../../../requests';

import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';

export default function TooltipHeader({
    children,
    appointmentData,
    setDate,
    selectedDate,
    setShowTooltip,
    handleAddAppointmentForm,
    ...restProps
}) {
    return (
        <AppointmentTooltip.Header
            {...restProps}
            appointmentData={appointmentData}
            showOpenButton
            onOpenButtonClick={handleAddAppointmentForm}
            showDeleteButton
            onDeleteButtonClick={() =>
                deleteAppointment(
                    localStorage.getItem('apiKey'),
                    appointmentData.id
                )
                    .then(() => {
                        setShowTooltip(false);
                        setDate(
                            dayjs(selectedDate)
                                .add(1, 'day')
                                .format('YYYY-MM-DD')
                        );
                        setDate(dayjs(selectedDate).format('YYYY-MM-DD'));
                    })
                    .catch((err) => console.log(err))
            }
            showCloseButton
        >
            {children}
        </AppointmentTooltip.Header>
    );
}
