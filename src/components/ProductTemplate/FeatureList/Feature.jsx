import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

export default function Feature({length, FeatureInstance, i, implemented}) 
{
    return (
        <ListGroup.Item 
            style={i !== length-1 ? {borderBottom: '1px solid rgba(0, 123, 255, 0.25)'} : {}}
           
        >
            <FeatureInstance.Icon className="mr-3 text-primary"/>
            <span className={implemented ? '' : 'line-through'}>{FeatureInstance.text}</span>
            
            {!implemented && <span className="ml-4 text-primary">Kommer snart!</span>}
        </ListGroup.Item>
    )
}
