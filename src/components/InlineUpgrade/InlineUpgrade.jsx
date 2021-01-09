import React, { useState } from 'react'

import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'

import ProductTemplate from '../ProductTemplate/ProductTemplate'

export default function InlineUpgrade({products, currentProduct, quantity, salesPrice}) 
{
    currentProduct.quantity = quantity

    const [newProduct, setNewProduct] = useState({
        name: currentProduct.name,
        isTiered: currentProduct.name === 'Premium',
        salesPrice: salesPrice,
        unitAmount: quantity,
        unitName: currentProduct.metadata.unit_name,
        priceId: currentProduct.price.id
    })

    return (
        <div className="w-full min-h-full my-4">
            <CardDeck>
                <ProductTemplate 
                    handleProductSelect={setNewProduct}
                    product={products.basic}
                    isSelected={newProduct.name === 'Basic'}
                    currentProduct={currentProduct}
                    showFeatures={false}
                    selectedProduct={newProduct}
                />
                <ProductTemplate
                    handleProductSelect={setNewProduct} 
                    product={products.premium}
                    isSelected={newProduct.name === 'Premium'}
                    showFeatures={false}
                    currentProduct={currentProduct}
                    selectedProduct={newProduct}
                />
            </CardDeck>
            { ((currentProduct.name === 'Basic' && newProduct.name === 'Premium') 
            || (newProduct.name === 'Premium' && currentProduct.quantity !== newProduct.unitAmount)
            || (currentProduct.name === 'Premium' && newProduct.name === 'Basic')) && (
                <Card className="mt-2">
                    <Card.Body>
                        Hey
                    </Card.Body>
                </Card>
            ) }
        </div>
    )
}
