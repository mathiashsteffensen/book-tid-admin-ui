import React from 'react'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export default function UnitCounter({value, unitName, onIncrement, onDecrement}) 
{
    return (
        <Row>
            <Col className="flex justify-center items-center">
                <Button onClick={onDecrement}>
                    <RemoveIcon />
                </Button>
            </Col>

            <Col className="flex flex-col justify-center items-center">
                <div className="text-3xl font-bold text-primary">
                    {value} &#215;
                </div>
                <div>
                    {unitName}
                </div>
            </Col>

            <Col className="flex justify-center items-center">
                <Button onClick={onIncrement}>
                    <AddIcon />
                </Button>
            </Col>
        </Row>
    )
}
