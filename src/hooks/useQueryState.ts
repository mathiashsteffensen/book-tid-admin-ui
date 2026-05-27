import { isNumber } from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"

import { DateHelper, DateType } from "src/helpers"
import { useQuery } from "src/hooks/useQuery"

type TransformObject<T> = {
    toUrl: (value: T) => string
    fromUrl: (value: string) => T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTransform = <T>(obj: any): obj is TransformObject<T> =>
    obj && typeof obj.toUrl === "function" && typeof obj.fromUrl === "function"

export const numberTransform: TransformObject<number> = {
    toUrl: (value) => value.toString(),
    fromUrl: (value) => parseInt(value, 10),
}

export const jsonTransform: TransformObject<Record<string, unknown>> = {
    toUrl: (value) => JSON.stringify(value),
    fromUrl: (value) => JSON.parse(value),
}

export const dateTransform: TransformObject<DateType> = {
    toUrl: (value) => value.toJSON(),
    fromUrl: (value) => DateHelper.new(value),
}

export function useQueryState<T>(
    queryParam: string,
    defaultValue: T,
    transform: TransformObject<T>
): [T, (value: T) => void]

export function useQueryState<T>(
    queryParam: string,
    transform: TransformObject<T>
): [T, (value: T) => void]

export function useQueryState(
    queryParam: string,
    defaultValue: number
): [number, (value: number) => void]

export function useQueryState(
    queryParam: string,
    defaultValue?: string
): [string, (value: string) => void]

export function useQueryState<T>(
    queryParam: string,
    defaultValueOrTransform?: T | TransformObject<T>,
    maybeTransform?: TransformObject<T>
) {
    const defaultValue = useMemo(
        () =>
            isTransform(defaultValueOrTransform)
                ? undefined
                : (defaultValueOrTransform as T | undefined),
        []
    )
    const transform = useMemo(() => {
        if (isTransform(defaultValueOrTransform)) {
            return defaultValueOrTransform as TransformObject<T>
        } else if (isNumber(defaultValueOrTransform)) {
            return (numberTransform as unknown) as TransformObject<T>
        } else if (isTransform(maybeTransform)) {
            return maybeTransform
        }
        return undefined
    }, [defaultValueOrTransform, maybeTransform])

    const toUrl = useCallback(
        (value: T): string =>
            transform ? transform.toUrl(value) : (value as string),
        [transform]
    )

    const fromUrl = useCallback(
        (value: string): T =>
            (transform ? transform.fromUrl(value) : value) as T,
        [transform]
    )

    const query = useQuery()

    const [state, setState] = useState(
        query.get(queryParam)
            ? fromUrl(query.get(queryParam) as string)
            : defaultValue
    )

    const setStateWrapper = useCallback((value: T) => {
        setState(value)
        query.set(queryParam, toUrl(value))
    }, [])

    useEffect(() => {
        if (defaultValue && !query.get(queryParam)) {
            query.set(queryParam, toUrl(defaultValue))
        }
    }, [defaultValue])

    return [state || defaultValue, setStateWrapper]
}
