import React, { useState } from 'react';

// NextJS Imports
import { useRouter } from 'next/router';

// Stripe elements
import {
    CardElement,
    PaymentRequestButtonElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

// Component library imports
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

// Icon imports
import CompleteIcon from '@material-ui/icons/CheckCircleOutline';

// API Request Imports
import {
    createSubscription,
    retryInvoiceWithNewPaymentMethod,
    onSubscriptionComplete,
} from '../../requests';

export default function PaymentForm({
    product,
    title,
    setShowPaymentForm,
    showBackLink = false,
    customerId,
    isRetry = false,
    latestInvoice,
}) {
    const stripe = useStripe();
    const elements = useElements();

    const router = useRouter();

    const [errorMsg, setError] = useState('');

    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    async function handlePaymentThatRequiresCustomerAction({
        subscription,
        invoice,
        priceId,
        paymentMethodId,
        isRetry,
    }) {
        if (subscription && subscription.status === 'active') {
            // Subscription is active, no customer actions required.
            return localStorage.getItem('apiKey');
        }

        // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
        // If it's a retry, the payment intent will be on the invoice itself.
        let paymentIntent = invoice
            ? invoice.payment_intent
            : subscription.latest_invoice.payment_intent;

        if (
            paymentIntent.status === 'requires_action' ||
            (isRetry === true &&
                paymentIntent.status === 'requires_payment_method')
        ) {
            return await stripe
                .confirmCardPayment(paymentIntent.client_secret, {
                    payment_method: paymentMethodId,
                })
                .then((result) => {
                    if (result.error) {
                        // Start code flow to handle updating the payment details.
                        // Display error message in your UI.
                        // The card was declined (i.e. insufficient funds, card has expired, etc).
                        throw new Error(result.error.message);
                    } else {
                        if (result.paymentIntent.status === 'succeeded') {
                            // No customer action needed
                            return localStorage.getItem('apiKey');
                        }
                    }
                });
        } else {
            // No customer action needed.
            return localStorage.getItem('apiKey');
        }
    }

    const handleSubmit = async (event) => {
        setLoading(true);
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Disabling form submission.
            return;
        }

        // Get a reference to a mounted CardElement.
        const cardElement = elements.getElement(CardElement);

        // Use the card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) setError(error.message);
        else {
            setError('');
            !isRetry
                ? createSubscription(
                      customerId,
                      paymentMethod.id,
                      product.priceId,
                      product.unitAmount,
                      localStorage.getItem('apiKey')
                  )
                      .then(handlePaymentThatRequiresCustomerAction)
                      .then(onSubscriptionComplete)
                      .then(() => {
                          setComplete(true);
                          setTimeout(() => router.push('/tak'), 75);
                      })
                      .catch((err) => {
                          setComplete(false);
                          setError(err.message);
                      })
                      .finally(() => setLoading(false))
                : retryInvoiceWithNewPaymentMethod(
                      customerId,
                      paymentMethod.id,
                      latestInvoice.id,
                      product.priceId,
                      localStorage.getItem('apiKey')
                  )
                      .then(handlePaymentThatRequiresCustomerAction)
                      .then(onSubscriptionComplete)
                      .then(() => {
                          setComplete(true);
                          setTimeout(() => router.push('/tak'), 75);
                      })
                      .catch((err) => {
                          setComplete(false);
                          setError(err.message);
                      })
                      .finally(() => setLoading(false));
        }
    };

    return (
        <Form
            onSubmit={handleSubmit}
            className="bg-gray-100 min-w-2/3-screen overflow-hidden rounded shadow"
        >
            <Row className="divide-x-2 h-80 divide-primary">
                <Col className="pr-0 h-full" md={8}>
                    <div className="w-full bg-gray-700 h-24 flex justify-center items-center">
                        <h3 className="text-2xl text-gray-100 font-semibold">
                            {title}{' '}
                            <span className="font-normal underline">
                                BOOKTID {product.name}
                            </span>
                        </h3>
                    </div>
                    <div className="w-full h-56 px-12 py-4 flex justify-center items-center flex-col">
                        <CardElement className="form-control w-92" />

                        {errorMsg !== '' && (
                            <div className="w-2/3 text-center text-red-500">
                                {errorMsg}
                            </div>
                        )}

                        {!loading && !complete && (
                            <Button type="submit" className="my-3">
                                Opgrader
                            </Button>
                        )}

                        {!loading && complete && (
                            <Button className="my-3">
                                <CompleteIcon size="lg" />
                            </Button>
                        )}

                        {loading && (
                            <Button className="my-3">
                                <Spinner role="status" animation="border">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </Button>
                        )}

                        {showBackLink && (
                            <div
                                onClick={() => setShowPaymentForm(false)}
                                className="pt-2 hover:opacity-75 hover:underline text-secondary cursor-pointer"
                            >
                                Vælg en anden plan
                            </div>
                        )}
                    </div>
                </Col>

                <Col className="pl-0 h-full">
                    <div className="w-full h-24 flex justify-center items-center">
                        <h3 className="text-2xl underline">Din ordre</h3>
                    </div>
                    <Row className="divide-x-2 h-full  divide-secondary divide-dotted">
                        <Col className="py-4 ml-8 pl-0 text-base" md={7}>
                            BOOKTID {product.name} Abonnement
                            <br />
                            <div className="text-sm text-muted">
                                {product.unitAmount} &#215; {product.unitName}
                            </div>
                        </Col>
                        <Col className="py-4 ml-2 text-base">
                            {product.salesPrice} per måned
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
}
