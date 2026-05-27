export interface App {
    name: string
    description: string
    id: string
    icon: string
    activated: boolean
    settings: Array<{
        id: string
        name: string
        description: string
        type: "select" | "switch" | string | "image"
        options?:
            | Array<{
                  value: string
                  name: string
              }>
            | "timeOfDay"
            | string
        otherProps: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [property: string]: any
        }
    }>
}

declare global {
    type Values<T> = T[keyof T]
}
