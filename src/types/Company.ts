import { Model } from "src/types"

export interface Company extends Model {
    name: string
    bookingDomainPrefix: string
    street: string
    city: string
    postal_code: string
    country: string
    state?: string
}
