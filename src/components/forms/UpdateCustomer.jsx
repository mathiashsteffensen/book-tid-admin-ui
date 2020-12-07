import React, {useState} from 'react'
import {Button, TextField} from '@material-ui/core'

import FormModel from './FormModel'
import {updateCustomer} from '../../requests'

export default function UpdateCustomer({closeForm, formProps}) 
{
    const [state, setState] = useState(formProps)

    const [error, setError] = useState('')

    const [shouldUpdate, setShouldUpdate] = useState(false)
    const update = () => setShouldUpdate(!shouldUpdate)
    console.log(state)
    const handleChange = (key, value) =>
    {
        let newState = state
        newState[key] = value
        setState(newState)
        update()
    }

    return (
        <FormModel
            title="Rediger kunde"
            closeForm={closeForm}
            resetError={() => setError('')}
        >
            <div className="w-full mt-2 flex flex-col justify-center items-center">
                <div className="my-2 w-10/12">
                    <TextField 
                        label="Navn"
                        required
                        onChange={(e) => handleChange('name', e.target.value)}
                        value={state.name}
                        className="w-full"
                    />  
                </div>

                <div className="my-2 w-10/12">
                    <TextField 
                        label="E-Mail"
                        type="email"
                        required
                        onChange={(e) => handleChange('email', e.target.value)}
                        value={state.email}
                        className="w-full"
                    />
                </div>
                
                <div className="my-2 w-10/12">
                    <TextField 
                        label="Telefon"
                        type="phonenumber"
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        value={state.phoneNumber}
                        className="w-full"
                    />  
                </div>
                
                <div className="my-2 w-10/12">
                    <TextField 
                        label="Note"
                        multiline
                        rows={4}
                        onChange={(e) => handleChange('note', e.target.value)}
                        value={state.note}
                        variant="outlined"
                        className="w-full"
                    />  
                </div>

                <div className="w-9/12 mt-4">
                    <Button
                        className="float-right"
                        variant="contained"
                        color="primary"
                        onClick={() => updateCustomer(localStorage.getItem('apiKey'), {
                            name: state.name,
                            email: state.email,
                            phoneNumber: state.phoneNumber,
                            note: state.note
                        }, state.customerID).then(closeForm).catch(err => setError(err.message))}
                    >
                        Gem
                    </Button>
                    <div className="float-left text-red-600">
                        {error}
                    </div>
                </div>
            </div>
        </FormModel>
    )
}