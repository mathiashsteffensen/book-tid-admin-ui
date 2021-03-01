import React, { useState, useEffect } from 'react';

import { Card } from '../../agnostic/Card/Card';
import { Button } from '../../agnostic/Button';

import FeatureList from './FeatureList/FeatureList';
import UnitCounter from './UnitCounter';

const ProductTemplate = ({
    product,
    handleProductSelect,
    showFeatures = true,
    isSelected = false,
    currentProduct,
    selectedProduct,
    features,
}) => {
    const { price, name, description, metadata } = product;

    const isTiered = price.billing_scheme === 'tiered';

    if (isTiered) {
        var tierData = price.tiers[0];
        var pricePerTier = tierData.unit_amount / 100,
            startPrice = tierData.flat_amount / 100,
            unitName = metadata.unit_name;
    } else {
        var startPrice = price.unit_amount / 100,
            unitName = metadata.unit_name;
    }

    const [unitAmount, setUnitAmount] = useState(
        currentProduct && isTiered ? currentProduct.quantity : 1
    );
    const [salesPrice, setSalesPrice] = useState(
        new Intl.NumberFormat('da-DK', {
            style: 'currency',
            currency: 'DKK',
        }).format(startPrice)
    );

    const onIncrement = () => {
        setUnitAmount(unitAmount + 1);
    };

    const onDecrement = () => {
        unitAmount > 1 && setUnitAmount(unitAmount - 1);
    };

    useEffect(() => {
        if (!isTiered)
            setSalesPrice(
                new Intl.NumberFormat('da-DK', {
                    style: 'currency',
                    currency: 'DKK',
                }).format(startPrice)
            );
        else
            setSalesPrice(
                new Intl.NumberFormat('da-DK', {
                    style: 'currency',
                    currency: 'DKK',
                }).format(startPrice + unitAmount * pricePerTier)
            );
    }, [unitAmount]);

    return (
        <Card className="text-gray-900">
            <Card.Body>
                <Card.Title>
                    {name.toUpperCase()}{' '}
                    <span className="text-sm text-muted">
                        - {unitAmount} &#215; {unitName}
                    </span>
                </Card.Title>

                {showFeatures && (
                    <Card.Text className="mb-3">{description}</Card.Text>
                )}

                {isTiered && (
                    <div className="w-9/10 m-auto">
                        <UnitCounter
                            onDecrement={onDecrement}
                            onIncrement={onIncrement}
                            value={unitAmount}
                            unitName={unitName}
                        />
                    </div>
                )}

                <div className="w-full mt-3 flex flex-col justify-center items-center">
                    {showFeatures && <FeatureList features={features} />}
                </div>

                <h3 className="text-xl font-medium w-full text-center pt-5">{salesPrice},- / mdr</h3>
            </Card.Body>
            <Card.Footer>
                <div className="w-full flex justify-center items-center">
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() =>
                            handleProductSelect({
                                name,
                                isTiered,
                                salesPrice,
                                unitAmount,
                                unitName,
                                priceId: price.id,
                                salesPriceNumber: startPrice + unitAmount * pricePerTier
                            })
                        }
                    >
                        {!isSelected ||
                        selectedProduct.unitAmount !== unitAmount
                            ? 'Vælg Plan'
                            : 'Plan valgt'}
                    </Button> 
                </div>
                
            </Card.Footer>
        </Card>
    );
};

export default ProductTemplate;
