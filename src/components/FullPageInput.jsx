import React from 'react';

export default function FullPageInput({ title, subtitle, input }) {
    return (
        <label className="w-full mt-2 pt-2 grid grid-cols-5 divide-x divide-blue-500">
            <div className="flex flex-col col-span-2 justify-center mr-2">
                <h3 className="text-sm">{title}</h3>
                <h4 className="text-xs text-gray-700">{subtitle}</h4>
            </div>
            <div className="col-span-3 flex justify-center items-center">
                {input}
            </div>
        </label>
    );
}
