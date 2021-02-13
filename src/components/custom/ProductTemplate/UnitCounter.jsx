import React from 'react';

import { Button } from '../../agnostic/Button';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export default function UnitCounter({
    value,
    unitName,
    onIncrement,
    onDecrement,
}) {
    return (
        <div className="w-full flex justify-evenly">
            <div className="flex justify-center items-center">
                <Button size="sm" onClick={onDecrement}>
                    <RemoveIcon />
                </Button>
            </div>

            <div className="flex flex-col justify-center items-center">
                <div  style={{color: 'rgb(41, 88, 175)'}} className="text-2xl font-bold text-primary">
                    {value} &#215;
                </div>
                <div className="text-sm">{unitName}</div>
            </div>

            <div className="flex justify-center items-center">
                <Button size="sm" onClick={onIncrement}>
                    <AddIcon />
                </Button>
            </div>
        </div>
    );
}
