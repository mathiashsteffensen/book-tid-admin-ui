import React from 'react';

import { ListGroup } from '../../agnostic/ListGroup/ListGroup';

import Category from './Category';
import Service from './Service';

export default function CatsAndServices({
    data,
    update,
    handleUpdateCatForm,
    handleUpdateServiceForm,
}) {
    const { category, services } = data;
    return (
        <Category
            data={category}
            update={update}
            handleUpdateCatForm={handleUpdateCatForm}
        >
            <ListGroup>
                {services.length > 0 ? (
                    services.map((service, i) => (
                        <Service
                            key={i}
                            handleUpdateForm={handleUpdateServiceForm}
                            update={update}
                            service={service}
                        />
                    ))
                ) : (
                    <p>Ingen services i denne kategori</p>
                )}
            </ListGroup>
        </Category>
    );
}
