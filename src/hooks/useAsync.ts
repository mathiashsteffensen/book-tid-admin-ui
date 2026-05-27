import { useEffect } from "react"

import { useAsyncLazy, UseAsyncLazyOptions } from "src/hooks/useAsyncLazy"

export type UseAsyncOptions<T> = UseAsyncLazyOptions<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAsync = <TFunction extends () => Promise<any>>(
    asyncFunction: TFunction,
    options: UseAsyncOptions<Awaited<ReturnType<TFunction>>> = {}
) => {
    const { data, loading, error, execute: refresh } = useAsyncLazy(
        asyncFunction,
        options
    )

    useEffect(() => {
        if (!options.initialData) {
            refresh(...([] as Parameters<TFunction>))
        }
         
    }, [])

    return { loading, data, error, refresh }
}
