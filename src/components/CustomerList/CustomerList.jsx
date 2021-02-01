import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import CustomerRow from './CustomerRow';

export default function CustomerList({
    data,
    update,
    handleUpdateCustomerForm,
    offset,
}) {
    console.log(data);
    return (
        <ListGroup as="ul" className="w-full">
            {data.map((customer, i) => (
                <CustomerRow
                    key={customer._id}
                    index={i + 1 + offset}
                    customer={customer}
                    update={update}
                    handleUpdateCustomerForm={handleUpdateCustomerForm}
                />
            ))}
        </ListGroup>
    );
}
