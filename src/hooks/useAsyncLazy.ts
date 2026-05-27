import { useCallback, useState } from "react"

export type UseAsyncLazyOptions<T> = {
    initialData?: T
    onSuccess?: (data: T) => void
    onError?: (error: unknown) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAsyncLazy = <TFunction extends (...args: any) => Promise<any>>(
    asyncFunction: TFunction,
    {
        initialData,
        onError,
        onSuccess,
    }: UseAsyncLazyOptions<Awaited<ReturnType<TFunction>>> = {}
) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(initialData)
    const [error, setError] = useState<unknown>(undefined)
    const forceMemoizedAsyncFunction = useCallback(asyncFunction, [])
    const execute = useCallback(
        async (...args: Parameters<TFunction>) => {
            setLoading(true)
            try {
                const res = await forceMemoizedAsyncFunction(...args)
                setError(undefined)
                setData(res)
                await onSuccess?.(res)
            } catch (err) {
                console.log("ERROR", err)

                setError(err)
                onError?.(err)
            } finally {
                setLoading(false)
            }
        },
        [forceMemoizedAsyncFunction, onSuccess, onError]
    )

    return { loading, data, error, execute }
}
