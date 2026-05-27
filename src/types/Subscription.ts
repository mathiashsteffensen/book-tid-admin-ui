import { Model } from "src/types/Model"

export interface Subscription extends Model {
    companyId: string
    priceId: string
    stripeId: string
    status: string
    quantity: number
    currentPeriodEnd: string
    currentPeriodStart: string
    cancelAtPeriodEnd: string
}
