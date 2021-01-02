import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import PhoneIcon from '@material-ui/icons/AddToHomeScreen';
import FeatureList from './FeatureList/FeatureList';
import UnitCounter from './UnitCounter';

const ProductTemplate = ({product, handleProductSelect}) => 
{
    const {
        price,
        name,
        description,
        metadata
    } = product

    const isTiered = price.billing_scheme === 'tiered'

    if (isTiered) 
    {
        var tierData = price.tiers[0]
        var pricePerTier = tierData.unit_amount/100, 
            startPrice = tierData.flat_amount/100,
            unitName = metadata.unit_name
    } else
    {
        var startPrice = price.unit_amount/100,
            unitName = metadata.unit_name
    }

    const features = [
        {
            Icon: PhoneIcon,
            text: 'Test Feature'
        },
        {
            Icon: PhoneIcon,
            text: 'Amazing Test Feature'
        }
    ]

    const [unitAmount, setUnitAmount] = useState(1)
    const [salesPrice, setSalesPrice] = useState(new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(startPrice))

    const onIncrement = () =>
    {
        setUnitAmount(unitAmount+1)
    }

    const onDecrement = () =>
    {
        unitAmount > 1 && setUnitAmount(unitAmount-1)
    }

    useEffect(() => 
    {
        if (!isTiered) setSalesPrice(new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(startPrice))
        else setSalesPrice(new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(startPrice + (unitAmount * pricePerTier)))
    }, [unitAmount])

    return (
        <Card className="text-gray-700">
            <Card.Header className="flex justify-center items-center"><h3 className="text-xl font-medium">{salesPrice} per måned</h3></Card.Header>
            <Card.Body>
                <Card.Title>{name.toUpperCase()}</Card.Title>

                <Card.Text className="mb-3">{description}</Card.Text>

                {isTiered && <div className="w-2/3 m-auto">
                    <UnitCounter
                        onDecrement={onDecrement}
                        onIncrement={onIncrement}
                        value={unitAmount}
                        unitName={unitName}
                    />
                </div>}

                <div className="w-full mt-3 flex flex-col justify-center items-center">
                    <FeatureList features={features} />

                    <Button 
                        className="mx-auto mt-3"
                        onClick={() => handleProductSelect({
                            name,
                            isTiered,
                            salesPrice,
                            unitAmount,
                            unitName,
                            priceId: price.id
                        })}
                    >
                        Vælg Plan
                    </Button> 
                </div>
            </Card.Body>
        </Card>
    )
}

export default ProductTemplate