import React, { useState } from 'react'

// Component library imports
import CardDeck from 'react-bootstrap/CardDeck'

// Stripe elements
import { Elements } from '@stripe/react-stripe-js/';
import { loadStripe } from '@stripe/stripe-js';

// Custom component imports
import ProductTemplate from '../../components/ProductTemplate/ProductTemplate';
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import AltHeader from '../../components/Header/AltHeader';
import Footer from '../../components/Footer';

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
            <main className="w-screen min-h-screen bg-gray-900 bg-opaque flex flex-col">
                <AltHeader showBackLink/>

                <div className="md:mx-32 py-4 my-auto mx-6">
                    <div className="flex justify-center items-center">
                        {showPaymentForm 
                        ?   <PaymentForm title="Opgrader til" showBackLink customerId={user.stripeCustomerID} setShowPaymentForm={setShowPaymentForm} product={selectedProduct} />
                        :   <CardDeck>
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
                </div>

                <Footer />
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