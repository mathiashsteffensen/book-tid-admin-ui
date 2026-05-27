import { FC } from "react"

import { api } from "src/api-client"
import { Form, FormGroup, Spinner, Stack, Text } from "src/components/agnostic"
import { DateHelper, DateType } from "src/helpers"
import { useAsync, useFormValues } from "src/hooks"
import { Appointment } from "src/types"

export interface AppointmentFormProps {
    appointment?: Appointment
}

export type AppointmentFormValues = Pick<
    Appointment,
    "employeeId" | "serviceId" | "customerId"
> & {
    startAt: DateType
    endAt: DateType
}

export const AppointmentForm: FC<AppointmentFormProps> = ({ appointment }) => {
    const isEdit = !!appointment
    const initialValues: AppointmentFormValues = isEdit
        ? {
              ...appointment,
              startAt: DateHelper.new(appointment.startAt),
              endAt: DateHelper.new(appointment.endAt).add(1, "hour"),
          }
        : {
              startAt: DateHelper.now(),
              endAt: DateHelper.now(),
              employeeId: "",
              serviceId: "",
              customerId: "",
          }

    const formValuesToAppointment = (
        values: AppointmentFormValues
    ): Partial<Appointment> => ({
        ...values,
        startAt: values.startAt.toJSON(),
        endAt: values.endAt.toJSON(),
    })

    const form = useFormValues({
        initialValues,
        onSubmit: isEdit
            ? (values) =>
                  api().appointments.create(formValuesToAppointment(values))
            : (values) =>
                  api().appointments.update(
                      appointment!.id,
                      formValuesToAppointment(values)
                  ),
    })

    const { data, loading, error } = useAsync(async () => {
        const [employees, services, customers] = await Promise.all([
            await api().employees.list(),
            await api().services.list(),
            await api().customers.list(),
        ])

        return { employees, services, customers }
    })

    const { employees, services, customers } = data || {}

    return (
        <Form onSubmit={form.onSubmit}>
            {error && <Text color="error">{error}</Text>}

            {loading ? (
                <Stack justifyContent="center" alignItems="center">
                    <Spinner />
                </Stack>
            ) : (
                <>
                    <Stack
                        direction="row"
                        justifyContent="space-evenly"
                        spacing={4}
                    >
                        <Stack grow>
                            <FormGroup
                                name="startAt"
                                form={form}
                                label="Start tid"
                                input={{ type: "date-time-picker" }}
                            />
                        </Stack>

                        <Stack grow>
                            <FormGroup
                                name="endAt"
                                form={form}
                                label="Slut tid"
                                input={{ type: "date-time-picker" }}
                            />
                        </Stack>
                    </Stack>

                    <FormGroup
                        name="serviceId"
                        form={form}
                        label="Service"
                        input={{
                            type: "search-select",
                            options:
                                services?.map((s) => ({
                                    id: s.id,
                                    label: s.name,
                                })) || [],
                        }}
                    />

                    <FormGroup
                        name="employeeId"
                        form={form}
                        label="Medarbejder"
                        input={{
                            type: "search-select",
                            options:
                                employees?.map((e) => ({
                                    id: e.id,
                                    label: `${e.user.name} - ${e.user.email}`,
                                })) || [],
                        }}
                    />

                    <FormGroup
                        name="customerId"
                        form={form}
                        label="Kunde"
                        input={{
                            type: "search-select",
                            options:
                                customers?.map((c) => ({
                                    id: c.id,
                                    label: `${c.name} - ${c.email}`,
                                })) || [],
                        }}
                    />
                </>
            )}
        </Form>
    )
}
