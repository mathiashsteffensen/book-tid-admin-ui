import { useState, useEffect } from "react"

import { Card } from "../../agnostic/Card/Card"
import { Button } from "../../agnostic/buttons/Button"

import FeatureList from "./FeatureList/FeatureList"
import UnitCounter from "./UnitCounter"

const ProductTemplate = ({
    product,
    handleProductSelect,
    showFeatures = true,
    isSelected = false,
    currentProduct,
    selectedProduct,
    features,
}) => {
    const { name, description } = product
    const price = product.prices[0]
    const unitName = "medarbejdere"

    console.log("PRICE", price)

    const [quantity, setQuantity] = useState(currentProduct?.quantity || 1)

    const totalAmount = () => price.flatAmount + quantity * price.unitAmount
    const formatPrice = (price) =>
        new Intl.NumberFormat("da-DK", {
            style: "currency",
            currency: "DKK",
        }).format(price)

    const onIncrement = () => {
        setQuantity(quantity + 1)
    }

    const onDecrement = () => {
        quantity > 1 && setQuantity(quantity - 1)
    }

    return (
        <Card className="text-gray-900">
            <Card.Body>
                <Card.Title>
                    {name.toUpperCase()}{" "}
                    <span className="text-sm text-muted">
                        - {quantity} &#215; {unitName}
                    </span>
                </Card.Title>

                {showFeatures && (
                    <Card.Text className="mb-3">{description}</Card.Text>
                )}

                <div className="w-9/10 m-auto">
                    <UnitCounter
                        onDecrement={onDecrement}
                        onIncrement={onIncrement}
                        value={quantity}
                        unitName={unitName}
                    />
                </div>

                <div className="w-full mt-3 flex flex-col justify-center items-center">
                    {showFeatures && <FeatureList features={features} />}
                </div>

                <h3 className="text-xl font-medium w-full text-center pt-5">
                    {formatPrice(totalAmount() / 100)} / mdr
                </h3>
            </Card.Body>
            <Card.Footer>
                <div className="w-full flex justify-center items-center">
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() =>
                            handleProductSelect({
                                name,
                                quantity,
                                priceId: price.id,
                                totalAmount: totalAmount(),
                            })
                        }
                    >
                        {!isSelected || selectedProduct.quantity !== quantity
                            ? "Vælg Plan"
                            : "Plan valgt"}
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}

export default ProductTemplate
