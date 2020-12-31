import React, { useState } from 'react'

// Stripe elements
import { CardElement, PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Component library imports
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

// API Request Imports
import {
    createSubscription,
    retryInvoiceWithNewPaymentMethod
} from '../../requests'

// Stripe imports

import {
  handlePaymentThatRequiresCustomerAction,
  handleRequiresPaymentMethod
} from '../../stripe'

export default function PaymentForm({product, title, setShowPaymentForm, showBackLink = false,customerId, isRetry = false, latestInvoice}) 
{
    const stripe = useStripe();
    const elements = useElements();

    const [errorMsg, setError] = useState('')

    const handleSubmit = async (event) => 
    {
        // Block native form submission.
        event.preventDefault();
        console.log('submitting')
        if (!stripe || !elements) 
        {
            // Stripe.js has not loaded yet. Disabling form submission.
            return;
        }

        // Get a reference to a mounted CardElement.
        const cardElement = elements.getElement(CardElement);

        // Use the card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) setError(error.message)
        else 
        {
            setError('')
            console.log('[PaymentMethod]', paymentMethod);
            console.log(product.priceId)
            !isRetry 
            ? createSubscription(customerId, paymentMethod.id, product.priceId, product.unitAmount, localStorage.getItem('apiKey'))
              .then(handlePaymentThatRequiresCustomerAction)
              .then(handleRequiresPaymentMethod)
              .then(res => console.log(res))
              .catch((err) =>
              {
                  console.log(err);
                  setError(err.message)
              })
            : retryInvoiceWithNewPaymentMethod(customerId, paymentMethod.id, latestInvoice.id, product.priceId, localStorage.getItem('apiKey'))
              .catch((err) =>
              {
                  console.log(err);
                  setError(err.message)
              })
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="bg-gray-100 min-w-2/3-screen overflow-hidden rounded shadow">
            <Row className="divide-x-2 h-80 divide-primary">
                <Col className="pr-0 h-full" md={8}>
                    <div className="w-full bg-gray-700 h-24 flex justify-center items-center">
                        <h3 className="text-2xl text-gray-100 font-semibold">{title} <span className="font-normal underline">BOOKTID {product.name}</span></h3>
                    </div>
                    <div className="w-full h-56 px-12 py-4 flex justify-center items-center flex-col">
                        <CardElement
                            className="form-control w-92"
                        />

                        {errorMsg !== '' && <div className="w-2/3 text-center text-red-500">
                            {errorMsg}
                        </div>}
                        
                        <Button type="submit" className="my-3">Opgrader</Button> 

                       {showBackLink && <div onClick={() => setShowPaymentForm(false)} className="pt-2 hover:opacity-75 hover:underline text-secondary cursor-pointer">Vælg en anden plan</div>}
                        
                    </div>
                </Col>

                <Col className="pl-0 h-full">
                    <div className="w-full h-24 flex justify-center items-center">
                        <h3 className="text-2xl underline">Din ordre</h3>
                    </div>
                    <Row className="divide-x-2 h-full  divide-secondary divide-dotted">
                        <Col className="py-4 ml-8 pl-0 text-base" md={7}>
                            BOOKTID {product.name} Abonnement 
                            <br/>
                            <div className="text-sm text-muted">{product.unitAmount} &#215; {product.unitName}</div>         
                        </Col>
                        <Col className="py-4 ml-2 text-base">
                            {product.salesPrice} per måned
                        </Col>
                    </Row>
                </Col>
            </Row>        

            
        </Form>
    )
}
