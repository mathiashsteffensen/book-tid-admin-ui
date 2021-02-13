import React from 'react';

import { Button } from '../../agnostic/Button';
import { ButtonGroup } from '../../agnostic/ButtonGroup';

import { deleteCustomer } from '../../../requests';
import { ListGroup } from '../../agnostic/ListGroup/ListGroup';

export default function CustomerRow({
    customer,
    index,
    handleUpdateCustomerForm,
    mutate
}) {
    return (
        <ListGroup.Item
            className="grid py-1 grid-cols-4 md:grid-cols-12 text-sm"
        >
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
                <ButtonGroup>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleUpdateCustomerForm(customer)}
                    >
                        Rediger
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                            deleteCustomer(
                                localStorage.getItem('apiKey'),
                                customer._id
                            )
                                .then(() => mutate(null, true))
                                .catch((err) => console.log(err))
                        }
                    >
                        Slet
                    </Button>
                </ButtonGroup>
            </div>
        </ListGroup.Item>
    );
}
