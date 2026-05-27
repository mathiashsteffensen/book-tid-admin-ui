import { Model } from "./Model"

export interface Product extends Model {
    name: string
    stripeData: {
        metadata: {
            unit_name: string
        }
    }
}
