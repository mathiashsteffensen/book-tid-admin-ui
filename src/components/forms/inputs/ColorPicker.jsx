import React from 'react';

import Help from '../feedback/Help';

export default function ColorPicker({ value, onChange, label, helpText }) {
    return (
        <div className="w-full bg-gray-100 rounded shadow-sm px-4 py-2 my-2 flex justify-center items-center">
            <label className="w-full flex justify-between items-center">
                <input onChange={onChange} value={value} type="color" />
                <span className="mx-2">{label}</span>
                {helpText ? <Help helpText={helpText}></Help> : null}
            </label>
        </div>
    );
}
