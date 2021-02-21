export interface App {
    name: string,
    description: string,
    id: string,
    icon: string,
    activated: boolean,
    settings: Array<{
        id: string,
        name: string,
        description: string,
        type: 'select' | 'switch' | string,
        options?: Array<{
            value: string,
            name: string
        }> | 'timeOfDay' | string,
        otherProps: {
            [property: string]: any
        }
    }>
}