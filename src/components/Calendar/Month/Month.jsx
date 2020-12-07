import React, {useState, useEffect, useRef} from 'react'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)

import Day from './Day'
import {geometry} from '../../../utils'

export default function Month({date, getAsyncData}) 
{
    const [state, setState] = useState({
        dateArray: [],
        month: date.month(),
        diagonalDividerLength: geometry.pythagoras.solveForSideC(50, 35),
    })

    const [diagonalDividerAngle, setDiagonalDividerAngle] = useState(23)

    const [shouldUpdateState, setShouldUpdateState] = useState(false)
    const updateState = () => setShouldUpdateState(!shouldUpdateState)

    const topRightCornerBox = useRef(null)


    useEffect(() =>
    {
        let newState = state
        let arrayLength = 42, startDate =  date.date(date.date(1).date()-7).day(1)
        let newDateArray = []

        for (let i = 0; i < arrayLength; i++)
        {
            newDateArray.push(startDate.date(startDate.date()+i))
        }

        let divRect = topRightCornerBox.current.getBoundingClientRect()

        newState.dateArray = newDateArray
        newState.month = date.month()
        newState.diagonalDividerLength = geometry.pythagoras.solveForSideC(divRect.width, divRect.height)
        setDiagonalDividerAngle(geometry.radiansToDegrees(geometry.pythagoras.solveForAngleA(divRect.height, newState.diagonalDividerLength)))

        setState(newState)
        updateState()
    }, [date])
    return (
        <div className="grid grid-cols-table w-full grid-rows-table h-3/5-screen divide-x divide-gray-500 divide-y overflow-y-auto border border-gray-500 border-t-0 border-l-0 rounded-sm">
            <div ref={topRightCornerBox} className="col-start-1 row-start-1 col-span-1 row-span-1 grid grid-cols-6 grid-rows-6 border-r-0 border-b-0 border border-gray-500">
                <div className="row-start-4 row-span-3 col-start-1 col-span-3 text-center text-xs font-medium">
                    Uge
                </div>
                <div style={{width: state.diagonalDividerLength, transform: `rotate(${diagonalDividerAngle}deg)`}} className="h-border bg-gray-500 row-start-1 col-start-1 col-span-5 origin-top-left transform"></div>
                <div className="row-start-1 row-span-3 col-start-4 col-span-2 text-xs font-medium text-center">
                    Dag
                </div>
            </div>

            <div className="col-start-1 col-span-1 row-start-2 row-span-1 flex justify-center items-center font-medium text-sm">
                {state.dateArray[0] && state.dateArray[0].week()}
            </div>
            <div className="col-start-1 col-span-1 row-start-3 row-span-1 flex justify-center items-center font-medium text-sm">
                {state.dateArray[7] && state.dateArray[7].week()}
            </div>
            <div className="col-start-1 col-span-1 row-start-4 row-span-1 flex justify-center items-center font-medium text-sm">
                {state.dateArray[14] && state.dateArray[14].week()}
            </div>
            <div className="col-start-1 col-span-1 row-start-5 row-span-1 flex justify-center items-center font-medium text-sm">
                {state.dateArray[21] && state.dateArray[21].week()}
            </div>
            <div className="col-start-1 col-span-1 row-start-6 row-span-1 flex justify-center items-center font-medium text-sm">
                {state.dateArray[28] && state.dateArray[28].week()}
            </div>

            <div className="col-start-1 col-span-1 row-start-7 row-span-1 flex justify-center items-center font-medium text-sm">
                {state.dateArray[35] && state.dateArray[35].week()}
            </div>
  
            <div className="col-start-2 col-span-1 row-start-1 row-span-1 flex justify-center items-center font-medium text-sm">
                Mandag
            </div>
            <div className="col-start-3 col-span-1 row-start-1 row-span-1 flex justify-center items-center font-medium text-sm">
                Tirsdag
            </div>
            <div className="col-start-4 col-span-1 row-start-1 row-span-1 flex justify-center items-center font-medium text-sm">
                Onsdag
            </div>
            <div className="col-start-5 col-span-1 row-start-1 row-span-1 flex justify-center items-center font-medium text-sm">
                Torsdag
            </div>
            <div className="col-start-6 col-span-1 row-start-1 row-span-1 flex justify-center items-center font-medium text-sm">
                Fredag
            </div>
            <div className="col-start-7 col-span-1 row-start-1 row-span-1 flex justify-center items-center font-medium text-sm">
                Lørdag
            </div>
            <div className="col-start-8 col-span-1 row-start-1 row-span-1 flex justify-center items-center font-medium text-sm">
                Søndag
            </div>

            {state.dateArray[0] && state.dateArray.map((day, i) => <Day getAsyncData={getAsyncData} viewMonth={date.month()} date={day} key={i}/>)}
        </div>
    )
}
