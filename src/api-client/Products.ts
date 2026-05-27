import { ApiClient } from "src/api-client/ApiClient"
import { MultipleResource } from "src/api-client/MultipleResource"
import { Price, Product } from "src/types"

export class Products extends MultipleResource<
    Product & { prices: Array<Price> }
> {
    constructor(apiClient: ApiClient) {
        super(apiClient, "products")
    }
}
