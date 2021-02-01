import { useState, useEffect } from 'react'

export default function useAJAX(ajaxFunction, args, { fakeTimeOut = 0 }) {
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState(undefined)

    const [error, setError] = useState(undefined)

    useEffect(() =>
    {
        setLoading(true)
        setTimeout(() => {
            console.log(...args);
            ajaxFunction(...args).then(res => {
                    console.log(res);
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