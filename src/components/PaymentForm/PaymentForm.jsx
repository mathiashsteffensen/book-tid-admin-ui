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
    createSubscription
} from '../../requests'

export default function PaymentForm({product, setShowPaymentForm, customerId}) 
{
    const stripe = useStripe();
    const elements = useElements();

    const [errorMsg, setError] = useState('')

    function handlePaymentThatRequiresCustomerAction({
        subscription,
        invoice,
        priceId,
        paymentMethodId,
        isRetry,
      }) {
        if (subscription && subscription.status === 'active') {
          // Subscription is active, no customer actions required.
          return { subscription, priceId, paymentMethodId };
        }
      
        // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
        // If it's a retry, the payment intent will be on the invoice itself.
        let paymentIntent = invoice ? invoice.payment_intent : subscription.latest_invoice.payment_intent;
      
        if (
          paymentIntent.status === 'requires_action' ||
          (isRetry === true && paymentIntent.status === 'requires_payment_method')
        ) {
          return stripe
            .confirmCardPayment(paymentIntent.client_secret, {
              payment_method: paymentMethodId,
            })
            .then((result) => {
              if (result.error) {
                // Start code flow to handle updating the payment details.
                // Display error message in your UI.
                // The card was declined (i.e. insufficient funds, card has expired, etc).
                throw result;
              } else {
                if (result.paymentIntent.status === 'succeeded') {
                  // Show a success message to your customer.
                  // There's a risk of the customer closing the window before the callback.
                  // We recommend setting up webhook endpoints later in this guide.
                  return {
                    priceId: priceId,
                    subscription: subscription,
                    invoice: invoice,
                    paymentMethodId: paymentMethodId,
                  };
                }
              }
            })
            .catch((error) => 
            {
              setError(error.message);
            });
        } else {
          // No customer action needed.
          return { subscription, priceId, paymentMethodId };
        }
      }

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

        if (error) 
        {
            console.log('[error]', error);
            setError(error.message)
        } else 
        {
            setError('')
            console.log('[PaymentMethod]', paymentMethod);
            console.log(product.priceId)
            createSubscription(customerId, paymentMethod.id, product.priceId, product.unitAmount, localStorage.getItem('apiKey'))
            .then(handlePaymentThatRequiresCustomerAction)
            .then(res => console.log(res))
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
                        <h3 className="text-2xl text-gray-100 font-semibold">Opgrader til <span className="font-normal underline">BOOKTID {product.name}</span></h3>
                    </div>
                    <div className="w-full h-56 px-12 py-4 flex justify-center items-center flex-col">
                        {errorMsg !== '' && <div className="w-2/3 text-center text-red-500">
                            {errorMsg}
                        </div>}

                        <CardElement
                            className="form-control w-92"
                        />

                        <Button type="submit" className="my-3">Opgrader</Button> 

                        <div onClick={() => setShowPaymentForm(false)} className="pt-2 hover:opacity-75 hover:underline text-secondary cursor-pointer">Vælg en anden plan</div>
                        
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
