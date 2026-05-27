import { ApiClient } from "src/api-client/ApiClient"
import { MultipleResource } from "src/api-client/MultipleResource"
import { Appointment } from "src/types"

export class Appointments extends MultipleResource<Appointment> {
    constructor(apiClient: ApiClient) {
        super(apiClient, "appointments")
    }
}
