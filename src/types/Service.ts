import { Model } from "src/types/Model"

export type Service = Model & {
    categoryId: string | null
    name: string
    description: string
    minutesTaken: number
    breakAfter: number
    price: number
    hiddenAt: string
}
