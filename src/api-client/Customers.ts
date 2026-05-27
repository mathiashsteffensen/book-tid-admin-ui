import { ApiClient } from "src/api-client/ApiClient"
import { MultipleResource } from "src/api-client/MultipleResource"
import { Customer } from "src/types"

export type SearchParams<T extends Record<string, unknown>> = {
    query?: string
    sortBy?: Array<{ [key in keyof T]?: "desc" | "asc" }>
    offset?: number
    limit?: number
}

export type CustomerSearchParams = SearchParams<Omit<Customer, "id">>

export class Customers extends MultipleResource<Customer> {
    constructor(apiClient: ApiClient) {
        super(apiClient, "customers")
    }

    count() {
        return this.request<{ count: number }>({
            url: "/count",
        }).then(({ count }) => count)
    }

    search(params: CustomerSearchParams = {}) {
        params.sortBy ||= []

        return this.list({
            params: {
                ...params,
                sortBy: JSON.stringify(params.sortBy),
            },
        })
    }
}
