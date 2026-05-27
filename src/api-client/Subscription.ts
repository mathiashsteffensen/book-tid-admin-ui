import { Subscription as SubscriptionType } from "src/types"

import { ApiClient } from "./ApiClient"
import { SingularResource } from "./SingularResource"

export class Subscription extends SingularResource<
    SubscriptionType,
    Partial<SubscriptionType> & { paymentMethodId: string },
    {
        subscription: SubscriptionType
        invoice: unknown
        paymentMethodId: string
    }
> {
    constructor(client: ApiClient) {
        super(client, "subscription")
    }
}
