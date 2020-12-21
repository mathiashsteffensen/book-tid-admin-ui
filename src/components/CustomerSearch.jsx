import React from 'react'

import LabelledSelect from './forms/inputs/LabelledSelect'

import TextField from '@material-ui/core/TextField'

export default function CustomerSearch({limit, sortBy, searchTerm, handleChange}) 
{
    return (
        <div className="w-full p-3">
            <div className="grid grid-cols-8 gap-y-2 gap-x-2">
                <div className="col-span-4 md:col-span-2 flex justify-center items-center">
                    <LabelledSelect
                        onChange={(e) => handleChange('limit', e.target.value)}
                        value={limit}
                        label="Vis:"
                        options={[{value: 5, text: '5'}, {value: 10, text: '10'}, {value: 20, text: '20'}, {value: 50, text: '50'}]}
                    />
                </div>
                <div className="col-span-4 md:col-span-2 flex justify-center items-center">
                    <LabelledSelect
                        onChange={(e) => handleChange('sortBy', e.target.value)}
                        value={sortBy}
                        label="Sorter efter:"
                        options={[{value: '+name', text: 'Navn (A-Z)'}, {value: '-name', text: 'Navn (Z-A)'}, {value: '+email', text: 'E-Mail (A-Z)'}, {value: '-email', text: 'E-Mail (Z-A)'}]}
                    />
                </div>
                <div className="col-span-8 md:col-span-4 my-auto flex justify-end items-center">
                    <TextField
                        size="small" 
                        variant="outlined"
                        label="Søg:"
                        onChange={(e) => handleChange('searchTerm', e.target.value)}
                        value={searchTerm}
                    />
                </div>
            </div>
        </div>  
    )
}
