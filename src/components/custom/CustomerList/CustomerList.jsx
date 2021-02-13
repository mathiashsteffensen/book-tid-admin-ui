import React from 'react';

import { ListGroup } from '../../agnostic/ListGroup/ListGroup';
import CustomerRow from './CustomerRow';

export default function CustomerList({
    data,
    update,
    handleUpdateCustomerForm,
    offset,
    mutate
}) {
    console.log(data);
    return (
        <ListGroup className="w-full">
            {data.map((customer, i) => (
                <CustomerRow
                    key={customer._id}
                    index={i + 1 + offset}
                    customer={customer}
                    update={update}
                    handleUpdateCustomerForm={handleUpdateCustomerForm}
                    mutate={mutate}
                />
            ))}
        </ListGroup>
    );
}
