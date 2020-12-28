import React, { useState } from 'react'

import Link from 'next/link'

// Component library imports
import CardDeck from 'react-bootstrap/CardDeck'

// Stripe elements
import { Elements } from '@stripe/react-stripe-js/';
import { loadStripe } from '@stripe/stripe-js';

// Custom component imports
import ProductTemplate from '../../components/ProductTemplate/ProductTemplate';
import PaymentForm from '../../components/PaymentForm/PaymentForm';

// Icon imports
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

// HTTP Request imports
import { getProductsAndPrices, verifyApiKey } from '../../requests'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Upgrade = ({products, user}) => 
{
    console.log(user);
    const [showPaymentForm, setShowPaymentForm] = useState(false)

    const [selectedProduct, setSelectedProduct] = useState(null)

    const handleProductSelect = (product) =>
    {
        console.log(product)
        setSelectedProduct(product)
        setShowPaymentForm(true)
    }

    return (
        <Elements stripe={stripePromise}>
            <main className="w-screen min-h-screen bg-gray-900 bg-opaque flex flex-col just items-center">
                <header className="w-screen h-24 relative top-0 bg-gray-200 py-3 flex justify-center items-center">
                    <div className="absolute left-0">
                        <Link href="/kalender">
                            <a className="flex justify-center items-center">
                                <NavigateBeforeIcon className="text-secondary" style={{fontSize: '3rem'}} />
                                <h4 className="hidden md:block">Tilbage til min kalender</h4>
                            </a>
                        </Link> 
                    </div>

                    <div className="w-1/2 text-lg md:text-2xl">
                        <button onClick={() => window.location = 'https://booktid.net'}>
                            <h1>BOOKTID.NET</h1>
                        </button>
                        <h2 className="font-medium">ONLINE BOOKINGSYSTEM</h2>
                    </div>
                </header>

                <div className="relative mt-3 md:mt-0 top-0 sm:top-6 md:mx-32 mx-6">
                    {showPaymentForm 
                    ? <PaymentForm customerId={user.stripeCustomerID} setShowPaymentForm={setShowPaymentForm} product={selectedProduct} />
                    : <CardDeck>
                        <ProductTemplate
                            handleProductSelect={handleProductSelect} 
                            product={products.basic}
                        />
                        <ProductTemplate 
                            handleProductSelect={handleProductSelect} 
                            product={products.premium}
                        />
                    </CardDeck>
                    }
                </div>

                
            </main>
        </Elements>    
    )
}

export default Upgrade

export async function getServerSideProps({req})
{
    const apiKey = req.cookies.apiKey
    const isValid = await verifyApiKey(apiKey).catch(err => console.log(err))
    console.log(isValid);
    if (isValid)
    {
        const products = await getProductsAndPrices()
        products.basic = products.basic[0]
        products.premium = products.premium[0]

        return {
            props: {
                valid: false,
                user: isValid,
                products
            }
        }
    } else return {
        redirect: {
            permanent: false,
            destination: '/login'
        }
    }
}