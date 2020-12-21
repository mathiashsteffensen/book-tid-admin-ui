import React, { useState } from 'react'

import Link from 'next/link'

import { CardElement } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Form from 'react-bootstrap/Form'

import { getProductsAndPrices } from '../../requests'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG');

const Upgrade = () => 
{
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    return (
        <Elements stripe={stripePromise}>
            <main className="w-screen h-screen bg-gray-900 bg-opaque flex flex-col justify-center items-center">
                <header className="w-screen absolute top-0 bg-gray-200 py-3 flex justify-center items-center">
                    <div className="w-1/2 text-lg md:text-2xl">
                        <button onClick={() => window.location = 'https://booktid.net'}>
                            <h1>BOOKTID.NET</h1>
                        </button>
                        <h2 className="font-medium">ONLINE BOOKINGSYSTEM</h2>
                    </div>
                </header>

                {showPaymentForm && <Form className="bg-gray-100 overflow-hidden rounded shadow mt-4">
                    <div className="w-full bg-gray-700">
                        <h3 className="text-2xl text-gray-100 px-16 py-6 font-semibold">Opgrader til premium</h3>
                    </div>
                    <CardElement
                        className="form-control"
                    /> 
                </Form>}

                <div className="mt-2">
                    Har du ikke en bruger? <Link href="/opret-bruger"><a><span className="hover:text-purple-700 text-blue-700 underline">Opret dig her</span></a></Link> 
                </div>
            </main>
        </Elements>
    )
}

export default Upgrade

export async function getServerSideProps()
{
    const products = await getProductsAndPrices()
    console.log(products)
    return {
        props: {

        }
    }
}