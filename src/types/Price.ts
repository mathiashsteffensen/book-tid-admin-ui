import { Model } from "./Model"

export interface Price extends Model {
    currency: string
    flatAmount: number
    unitAmount: number
}
