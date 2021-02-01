import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Feature from './Feature';
export default function FeatureList({ features }) {
    return (
        <Card className="max-w-full w-9/12">
            <Card.Header>Funktioner</Card.Header>
            <ListGroup variant="flush">
                {features.map((FeatureInstance, i) => (
                    <Feature
                        FeatureInstance={FeatureInstance}
                        implemented={FeatureInstance.implemented}
                        key={i}
                        i={i}
                        length={features.length}
                    />
                ))}
            </ListGroup>
        </Card>
    );
}
