import React from 'react'

import {Button} from '@material-ui/core'

import {deleteCustomer} from '../requests'

export default function CustomerRow({customer, index, update, handleUpdateCustomerForm}) 
{
    return (
        <div className="grid grid-cols-4 md:py-1 md:grid-cols-12 w-full text-sm font-medium">
            <div className="col-span-4 md:col-span-1 text-gray-700 py-1 justify-center md:justify-start flex items-center">
                {index}
            </div>
            <div className="col-span-4 md:col-span-3 py-1 justify-center md:justify-start flex items-center">
                <p>{customer.name}</p>
            </div>
            <div className="col-span-4 py-1 justify-center md:justify-start flex items-center">
                <p>{customer.email}</p>
            </div>
            <div className="col-span-4 md:col-span-1 py-1 justify-center md:justify-start flex items-center">
                <p>{customer.phoneNumber}</p>
            </div>
            <div className="col-span-4 md:col-span-3 py-1 flex justify-evenly items-center">
                <Button
                    color="primary"
                    size="small"
                    onClick={() => handleUpdateCustomerForm(customer)}
                >
                    Rediger
                </Button>
                <Button
                    color="secondary"
                    size="small"
                    onClick={() => deleteCustomer(localStorage.getItem('apiKey'), customer._id).then(update).catch(err => console.log(err))}
                >
                    Slet
                </Button>
            </div>
        </div>
    )
}
