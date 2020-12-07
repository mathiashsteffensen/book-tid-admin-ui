import React, {useState, useEffect} from 'react'
import dayjs from 'dayjs'

import Month from './Month/Month'
import Week from './Week/Week'
import { Button } from '@material-ui/core'

export default function Calendar(props) 
{
    const {
        getAsyncData,
    } = props

    const [state, setState] = useState({
        date: dayjs(),
        dateArray: [],
    })

    const [viewPortWidth, setViewPortWidth] = useState(600)
    const [viewType, setViewType] = useState('month')

    const checkViewWidth = () =>
    {
        const vw = window.innerWidth
        setViewPortWidth(vw)
        if (vw < 600) setViewType('week')
    }

    useEffect(() =>
    {
        checkViewWidth()
        window.addEventListener('resize', checkViewWidth)
        return () => window.removeEventListener('resize', checkViewWidth)
    }, [])

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-11/12 bg-gray-100 px-4 py-2 mb-4 rounded shadow">
                <div className="float-left">
                    <Button>
                        I dag
                    </Button>
                </div>
                <div className="float-right flex justify-between items-center sm:w-1/2 lg:w-1/3">
                    {viewPortWidth > 599 && <Button
                        size="small"
                        onClick={() => setViewType('month')}
                    >
                        Måned
                    </Button>}

                    <Button
                        size="small"
                        onClick={() => setViewType('week')}
                    >
                        Uge
                    </Button>

                    <Button
                        size="small"
                        onClick={() => setViewType('day')}
                    >
                        Dag
                    </Button>
                </div>
            </div>

            {viewType === 'month' && <Month getAsyncData={getAsyncData} date={state.date} />}
            {viewType === 'week' && <Week getAsyncData={getAsyncData} date={state.date} />}
        </div>
    )
}
