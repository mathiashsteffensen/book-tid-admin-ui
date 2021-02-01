import React from 'react';

// NextJS utility imports
import { useRouter } from 'next/router';

// Stripe elements
import { Elements } from '@stripe/react-stripe-js/';
import { loadStripe } from '@stripe/stripe-js';

// Custom component imports
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import AltHeader from '../../components/Header/AltHeader';
import Footer from '../../components/Footer';

// HTTP Request imports
import { getLatestInvoice, getProduct, verifyApiKey } from '../../requests';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function NewPaymentMethod({
    latestInvoice,
    latestLineItems,
    product,
    user,
}) {
    console.log(latestLineItems);
    const router = useRouter();

    const setShowPaymentForm = (bool) => {
        if (!bool) router.push('/opgrader');
    };
    return (
        <Elements stripe={stripePromise}>
            <main className="w-screen min-h-screen bg-gray-900 bg-opaque flex flex-col">
                <AltHeader showBackLink />
                <div className="md:mx-32 my-auto mx-6">
                    <div className="flex justify-center items-center">
                        <PaymentForm
                            title="Ny betalingsmetode -"
                            customerId={user.stripeCustomerID}
                            product={{
                                name: product.name,
                                unitAmount: latestLineItems[0].quantity,
                                unitName: product.metadata.unit_name,
                                priceId: latestLineItems[0].price.id,
                                salesPrice: new Intl.NumberFormat('da-DK', {
                                    style: 'currency',
                                    currency: 'DKK',
                                }).format(
                                    (latestLineItems[0].amount +
                                        latestLineItems[1].amount) /
                                        100
                                ),
                            }}
                            isRetry
                            latestInvoice={latestInvoice}
                            setShowPaymentForm={setShowPaymentForm}
                            showBackLink={user.subscriptionType === 'free'}
                        />
                    </div>
                </div>
                <Footer className="z-10" />
            </main>
        </Elements>
    );
}

export async function getServerSideProps({ req }) {
    const apiKey = req.cookies.apiKey;

    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));
    console.log(isValid);

    if (isValid) {
        const latestInvoice = await getLatestInvoice(
            isValid.subscriptionID,
            apiKey
        ).catch((err) => console.log(err));

        const latestLineItems = latestInvoice.lines.data;

        const product = await getProduct(
            latestLineItems[0].plan.product,
            apiKey
        ).catch((err) => console.log(err));

        if (latestInvoice.status === 'void')
            return {
                redirect: {
                    permanent: false,
                    destination: '/opgrader',
                },
            };

        return {
            props: {
                valid: false,
                user: isValid,
                latestInvoice,
                latestLineItems,
                product,
            },
        };
    } else
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
}
