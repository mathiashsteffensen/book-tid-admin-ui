import { Model, Service } from "src/types"

export type Appointment = Model & {
    employeeId: string
    customerId: string
    serviceId: string
    service: Service
    startAt: string
    endAt: string
    cancelledAt: string
}
