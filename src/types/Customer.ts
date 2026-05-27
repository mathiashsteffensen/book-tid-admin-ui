import { Model } from "src/types/Model"

export type Customer = Model & {
    name: string
    email: string
    phoneNumber?: string
    note?: string
}
