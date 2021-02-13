import React from 'react';
import { ListGroup } from '../../../agnostic/ListGroup/ListGroup';

export default function Feature({ length, FeatureInstance, i, implemented }) {
    return (
        <ListGroup.Item
            style={
                i !== length - 1
                    ? { borderBottom: '1px solid rgba(0, 123, 255, 0.25)' }
                    : {}
            }
            className="flex items-center"
        >
            <FeatureInstance.Icon className="mr-3 text-primary" />

            <div className="flex flex-col">
                <span
                    className={
                        implemented ? ' text-sm' : 'line-through text-sm'
                    }
                >
                    {FeatureInstance.title}
                </span>

                <span
                    className={
                        implemented ? ' text-2xs' : 'line-through text-2xs'
                    }
                    dangerouslySetInnerHTML={{
                        __html: FeatureInstance.description,
                    }}
                ></span>
            </div>

            {!implemented && (
                <span className="ml-4 text-primary">Kommer snart!</span>
            )}
        </ListGroup.Item>
    );
}
