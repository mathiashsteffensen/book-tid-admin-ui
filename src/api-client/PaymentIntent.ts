import { PaymentIntent as PaymentIntentType } from "src/types"

import { ApiClient } from "./ApiClient"
import { SingularResource } from "./SingularResource"

export class PaymentIntent extends SingularResource<PaymentIntentType> {
    constructor(apiClient: ApiClient) {
        super(apiClient, "payment-intent")
    }
}
