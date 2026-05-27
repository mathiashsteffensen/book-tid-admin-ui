import { useRouter } from "next/router"
import { createContext, FC, useContext, useEffect, useState } from "react"

export type QueryValue = Values<ReturnType<typeof useRouter>["query"]>

const QueryContext = createContext<{
    get: (param: string) => QueryValue
    set: (param: string, value: string) => void
}>({
    get: () => undefined,
    set: () => {},
})

export const QueryContextProvider: FC = ({ children }) => {
    const router = useRouter()

    const [stateQuery, setStateQuery] = useState<Record<string, QueryValue>>(
        router.query
    )

    const get = (param: string) =>
        router.query ? router.query[param] : undefined
    const set = (param: string, value: string) => {
        setStateQuery((prev) => ({ ...prev, [param]: value }))
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.replace({
                query: { ...router.query, ...stateQuery },
            })
        }, 200)

        return () => clearInterval(timeoutId)
    }, [stateQuery])

    return (
        <QueryContext.Provider value={{ get, set }}>
            {children}
        </QueryContext.Provider>
    )
}

export const useQuery = () => {
    return useContext(QueryContext)
}
