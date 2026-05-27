import { useTheme } from "@mui/material"
import { useMemo, useRef } from "react"

import { api } from "src/api-client"
import { EmployeesSelect } from "src/api-client/Employees"
import {
    Alert,
    Button,
    Calendar,
    CalendarItem,
    CalendarRef,
} from "src/components/agnostic"
import { Layout } from "src/components/custom"
import { ColorHelper, DateHelper, DateType } from "src/helpers"
import { useAsync, useResourceFormModal } from "src/hooks"
import { Appointment, Service } from "src/types"

type AppointmentFormType = Pick<
    Appointment,
    "employeeId" | "serviceId" | "customerId"
> & {
    startAt: DateType
    endAt: DateType
}

export default function Kalender() {
    const calendarRef = useRef<CalendarRef>(null)

    const { data, loading, error } = useAsync(async () => {
        const [employees, services, customers] = await Promise.all([
            await api().employees.list(),
            await api().services.list(),
            await api().customers.list(),
        ])

        return { employees, services, customers }
    })

    const { employees, services, customers } = data || {
        employees: [],
        services: [],
        customers: [],
    }

    const getServiceById = (id: string) => services.find((s) => s.id === id)

    const getNewEndAt = (startAt: DateType, serviceId: string) => {
        const service = getServiceById(serviceId)

        if (!service) {
            return startAt.add(1, "hour")
        }

        return startAt.add(service.minutesTaken, "minutes")
    }

    const theme = useTheme()

    const appointmentToCalendarItem = (
        appointment: Appointment,
        service: Service,
        employee: EmployeesSelect
    ): CalendarItem => {
        return {
            id: appointment.id,
            startAt: DateHelper.new(appointment.startAt),
            endAt: DateHelper.new(appointment.endAt),
            title: `${service.name} - ${employee.user.name}`,
            color:
                ColorHelper.hexToRgb(theme.palette.primary.light) ||
                theme.palette.primary.light,
        }
    }

    const defaultStartAt = useMemo(
        () => DateHelper.now().add(1, "hour").set("minute", 0),
        []
    )

    const appointmentForms = useResourceFormModal<
        Appointment,
        Partial<Appointment>,
        AppointmentFormType
    >({
        name: "Booking",
        resource: () => api().appointments,
        refresh: () => calendarRef.current?.refreshItems(),
        formGroups: ({ formGroup }) => [
            {
                stack: {
                    direction: { xs: "column", sm: "row" },
                    justifyContent: "space-evenly",
                    spacing: 4,
                    formGroups: [
                        formGroup("startAt", "Start tid", {
                            type: "date-time-picker",
                            onChange: ({ change, values }) => {
                                console.log("Start at change")
                                change(
                                    "endAt",
                                    getNewEndAt(
                                        values.startAt,
                                        values.serviceId
                                    )
                                )
                            },
                        }),
                        formGroup("endAt", "Slut tid", {
                            type: "date-time-picker",
                        }),
                    ],
                },
            },
            formGroup("serviceId", "Service", {
                type: "search-select",
                options: services.map((s) => ({
                    id: s.id,
                    label: s.name,
                })),
                onChange: ({ change, values }) => {
                    change(
                        "endAt",
                        getNewEndAt(values.startAt, values.serviceId)
                    )
                },
            }),
            formGroup("employeeId", "Medarbejder", {
                type: "search-select",
                options: employees.map((e) => ({
                    id: e.id,
                    label: `${e.user.name} - ${e.user.email}`,
                })),
            }),
            formGroup("customerId", "Kunde", {
                type: "search-select",
                options: customers.map((c) => ({
                    id: c.id,
                    label: `${c.name} - ${c.email}`,
                })),
            }),
        ],
        transforms: {
            toForm: (appointment) => ({
                ...appointment,
                startAt: appointment.startAt
                    ? DateHelper.new(appointment.startAt)
                    : defaultStartAt,
                endAt: appointment.endAt
                    ? DateHelper.new(appointment.endAt)
                    : (appointment.startAt
                          ? DateHelper.new(appointment.startAt)
                          : defaultStartAt
                      ).add(1, "hour"),
            }),
            fromForm: (values) => ({
                ...values,
                startAt: values.startAt?.toJSON(),
                endAt: values.endAt?.toJSON(),
            }),
        },
    })

    return (
        <Layout
            title="Kalender"
            CTAs={
                <Button
                    variant="outlined"
                    onClick={() => appointmentForms.create()}
                >
                    Ny Booking
                </Button>
            }
            sidebar
        >
            {error && <Alert>{error}</Alert>}
            <Calendar
                ref={calendarRef}
                ready={
                    !loading && services.length !== 0 && employees.length !== 0
                }
                fetchItems={(startAt, endAt) =>
                    api()
                        .appointments.list({
                            params: {
                                startAt: startAt.toJSON(),
                                endAt: endAt.toJSON(),
                            },
                        })
                        .then((appointments) =>
                            Promise.all(
                                appointments.map(async (appointment) => {
                                    const service = await api().services.get(
                                        appointment.serviceId
                                    )
                                    const employee = await api().employees.get(
                                        appointment.employeeId
                                    )

                                    return appointmentToCalendarItem(
                                        appointment,
                                        service,
                                        employee!
                                    )
                                })
                            )
                        )
                }
                onItemClick={(item) => {
                    api()
                        .appointments.get(item.id)
                        .then(appointmentForms.update)
                }}
                onHourClick={(date) =>
                    appointmentForms.create({ startAt: date.toISOString() })
                }
                defaultViewType="month"
            >
                <Calendar.TopBar />
                <Calendar.WeekView />
                <Calendar.MonthView />
            </Calendar>
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    const user = await api(req)
        .user.get()
        .catch(() => {})

    if (user) {
        return {
            props: {
                user,
            },
        }
    } else
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
        }
}
