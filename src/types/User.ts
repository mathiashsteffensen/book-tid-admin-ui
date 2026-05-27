export type User = {
    id: string
    name: string
    email: string
    password: string
    authenticationToken: string
    subscribing?: boolean

    createdAt: string
    updatedAt: string
}
