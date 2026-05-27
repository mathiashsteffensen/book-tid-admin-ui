import { ApiClient } from "src/api-client/ApiClient"
import { MultipleResource } from "src/api-client/MultipleResource"
import { Service } from "src/types"

export class Services extends MultipleResource<Service> {
    constructor(apiClient: ApiClient) {
        super(apiClient, "services")
    }
}
