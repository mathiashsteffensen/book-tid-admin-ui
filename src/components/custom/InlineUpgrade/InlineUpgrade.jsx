import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { CardGroup } from '../../agnostic/CardGroup';
import { Card } from '../../agnostic/Card/Card';
import { Spinner } from '../../agnostic/Spinner';
import { Button } from '../../agnostic/Button';

import ProductTemplate from '../ProductTemplate/ProductTemplate';

import {
    retrieveUpcomingInvoice,
    updateSubscription,
    onSubscriptionComplete,
} from '../../../requests';

export default function InlineUpgrade({
    products,
    currentProduct,
    quantity,
    salesPrice,
    periodEnd,
    hide,
}) {
    const router = useRouter();

    currentProduct.quantity = quantity;

    const [newProduct, setNewProduct] = useState({
        name: currentProduct.name,
        isTiered: currentProduct.name === 'Premium',
        salesPrice: salesPrice,
        unitAmount: quantity,
        unitName: currentProduct.metadata.unit_name,
        priceId: currentProduct.price.id,
    });

    const [dueToday, setDueToday] = useState(false);
    const [dueAtPeriodEnd, setDueAtPeriodEnd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        retrieveUpcomingInvoice(
            newProduct.priceId,
            newProduct.unitAmount,
            localStorage.getItem('apiKey')
        )
            .then((res) => {
                console.log(res);
                setDueAtPeriodEnd(res.next_invoice_sum);
                setDueToday(res.immediate_total);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
    }, [newProduct]);

    const handleConfirmChange = () => {
        setSubmitLoading(true);
        const apiKey = localStorage.getItem('apiKey');
        updateSubscription(newProduct.priceId, newProduct.unitAmount, apiKey)
            .then(() => {
                onSubscriptionComplete(apiKey)
                    .then(() => {
                        setSubmitLoading(false);
                        location.reload();
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="w-full min-h-full my-4">
            <CardGroup>
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
            </CardGroup>
            {((currentProduct.name === 'Basic' &&
                newProduct.name === 'Premium') ||
                (newProduct.name === 'Premium' &&
                    currentProduct.quantity !== newProduct.unitAmount) ||
                (currentProduct.name === 'Premium' &&
                    newProduct.name === 'Basic')) && (
                <Card className="mt-2">
                    <Card.Body>
                        {error && (
                            <>Der skete en fejl, genindlæs venligst siden</>
                        )}

                        {isLoading && !error && (
                            <div className="flex justify-center items-center">
                                <Spinner variant="primary" />
                            </div>
                        )}

                        {!isLoading && (
                            <>
                                {newProduct.name === 'Premium' && (
                                    <>
                                        <p>
                                            Ændring til <strong>Premium</strong>{' '}
                                            planen med{' '}
                                            <strong>
                                                {newProduct.unitAmount}
                                            </strong>{' '}
                                            medarbejderkalendere
                                        </p>
                                        {dueToday > 0 && (
                                            <p>
                                                Der vil blive trukket{' '}
                                                <strong>
                                                    {new Intl.NumberFormat(
                                                        'da-DK',
                                                        {
                                                            style: 'currency',
                                                            currency: 'DKK',
                                                        }
                                                    ).format(dueToday / 100)}
                                                </strong>{' '}
                                                i dag
                                            </p>
                                        )}
                                        {dueToday < 0 && (
                                            <p>
                                                Du vil blive refunderet{' '}
                                                <strong>
                                                    {new Intl.NumberFormat(
                                                        'da-DK',
                                                        {
                                                            style: 'currency',
                                                            currency: 'DKK',
                                                        }
                                                    ).format(dueToday / -100)}
                                                </strong>{' '}
                                                i dag
                                            </p>
                                        )}

                                        <p>
                                            Næste betaling på{' '}
                                            <strong>
                                                {new Intl.NumberFormat(
                                                    'da-DK',
                                                    {
                                                        style: 'currency',
                                                        currency: 'DKK',
                                                    }
                                                ).format(dueAtPeriodEnd / 100)}
                                            </strong>{' '}
                                            vil forfalde{' '}
                                            {dayjs(periodEnd).format(
                                                'D/M/YYYY'
                                            )}
                                        </p>
                                    </>
                                )}

                                {currentProduct.name === 'Premium' &&
                                    newProduct.name === 'Basic' && (
                                        <>
                                            Ændring til <strong>Basic</strong>{' '}
                                            planen med <strong>1</strong>{' '}
                                            medarbejderkalender
                                            {dueToday > 0 && (
                                                <p>
                                                    Der vil blive trukket{' '}
                                                    <strong>
                                                        {new Intl.NumberFormat(
                                                            'da-DK',
                                                            {
                                                                style:
                                                                    'currency',
                                                                currency: 'DKK',
                                                            }
                                                        ).format(
                                                            dueToday / 100
                                                        )}
                                                    </strong>{' '}
                                                    i dag
                                                </p>
                                            )}
                                            {dueToday < 0 && (
                                                <p>
                                                    Du vil blive refunderet{' '}
                                                    <strong>
                                                        {new Intl.NumberFormat(
                                                            'da-DK',
                                                            {
                                                                style:
                                                                    'currency',
                                                                currency: 'DKK',
                                                            }
                                                        ).format(
                                                            dueToday / -100
                                                        )}
                                                    </strong>{' '}
                                                    i dag
                                                </p>
                                            )}
                                            <p>
                                                Næste betaling på{' '}
                                                <strong>
                                                    {new Intl.NumberFormat(
                                                        'da-DK',
                                                        {
                                                            style: 'currency',
                                                            currency: 'DKK',
                                                        }
                                                    ).format(
                                                        dueAtPeriodEnd / 100
                                                    )}
                                                </strong>{' '}
                                                vil forfalde{' '}
                                                {dayjs(periodEnd).format(
                                                    'D/M/YYYY'
                                                )}
                                            </p>
                                        </>
                                    )}
                                <div className="mt-2">
                                    <Button
                                        onClick={handleConfirmChange}
                                        variant={
                                            dueToday < 0
                                                ? 'outline-primary'
                                                : 'primary'
                                        }
                                        className="mr-2"
                                    >
                                        {submitLoading ? (
                                            <Spinner
                                                variant="light"
                                                size="sm"
                                            />
                                        ) : (
                                            'Bekræft Ændring'
                                        )}
                                    </Button>
                                    <Button
                                        onClick={hide}
                                        variant={
                                            dueToday > 0
                                                ? 'outline-primary'
                                                : 'primary'
                                        }
                                    >
                                        Aflys ændring
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            )}
            <Card className="mt-2">
                <Card.Body className="flex justify-center">
                    <img className="w-2/5" src="stripe-blurple.svg" alt="Powered By Stripe" />
                </Card.Body>
            </Card>
        </div>
    );
}
