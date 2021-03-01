import { useState, useEffect } from 'react'

export interface useAJAXParams {

}

const useAJAX: (ajaxFunction: () => any, args: Array<any>, options:{ fakeTimeOut: number | undefined }) => {
    loading: boolean,
    data: any,
    error: Error | undefined
} = (ajaxFunction, args, { fakeTimeOut = 0 }) => {
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState(undefined)

    const [error, setError] = useState(undefined)

    useEffect(() =>
    {
        setLoading(true)
        setTimeout(() => {
            // @ts-ignore
            ajaxFunction(...args).then(res => {
                    setError(undefined)
                    setData(res)
                }).catch(err => {
                    console.log(err);
                    setError(err)
                }).finally(() => setLoading(false))
        }, fakeTimeOut)
    }, args)

    return { loading, data, error }
}

export default useAJAX