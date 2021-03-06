import React, { useState } from 'react';

// Component library imports
import {CardGroup as CardDeck} from '../../components/agnostic/CardGroup';

// Stripe elements
import { Elements } from '@stripe/react-stripe-js/';
import { loadStripe } from '@stripe/stripe-js';

// Custom component imports
import ProductTemplate from '../../components/custom/ProductTemplate/ProductTemplate';
import PaymentForm from '../../components/custom/PaymentForm/PaymentForm';
import AltHeader from '../../components/custom/Header/AltHeader';
import Footer from '../../components/custom/Footer';

// Icon Imports
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import EmailIcon from '@material-ui/icons/Email';
import CheckIcon from '@material-ui/icons/Check';
import WebIcon from '@material-ui/icons/Web';
import TimelineIcon from '@material-ui/icons/Timeline';
import PhoneIcon from '@material-ui/icons/PhonelinkRing';

// HTTP Request imports
import { getProductsAndPrices, verifyApiKey } from '../../requests';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const features = {
    premium: [
        {
            title: 'Modtag nemt online bookinger',
            Icon: EventAvailableIcon,
            implemented: true,
        },
        {
            title: 'Ubegrænsede bookinger',
            Icon: CheckIcon,
            implemented: true,
        },
        {
            title: 'Få en personlig bookingside',
            Icon: WebIcon,
            implemented: true,
            description: `Konverter visninger til salg.`,
        },
        {
            title:
                'Sæt begrænsninger for hvor kort tid før der kan bookes, så du altid er forbered.',
            Icon: EventBusyIcon,
            implemented: true,
        },
        {
            title: 'Send E-Mail bekræftelser til dine kunder automatisk',
            Icon: EmailIcon,
            implemented: true,
            description:
                'Send bekræftelses E-Mails samt E-Mails når tider ændres eller aflyses.',
        },
        {
            title: 'Send SMS Påmindelser automatisk, og gratis',
            Icon: PhoneIcon,
            implemented: true,
            description:
                'Hver sikker på at dine kunder dukker op til deres aftaler, og undgå tabt omsætning.',
        },
    ]
};

const Upgrade = ({ products, user }) => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setShowPaymentForm(true);
    };

    return (
        <Elements stripe={stripePromise}>
            <main className="w-screen min-h-screen bg-gray-900 bg-opaque flex flex-col">
                <AltHeader showBackLink />

                <div className="md:mx-32 pt-6 pb-20 my-auto mx-6">
                    <div className="flex justify-center items-center">
                        {showPaymentForm ? (
                            <PaymentForm
                                title="Opgrader til"
                                showBackLink
                                customerId={user.stripeCustomerID}
                                setShowPaymentForm={setShowPaymentForm}
                                product={selectedProduct}
                            />
                        ) : (
                            <CardDeck>
                                <ProductTemplate
                                    handleProductSelect={handleProductSelect}
                                    product={products.premium}
                                    features={features.premium}
                                    showFeatures={false}
                                />
                            </CardDeck>
                        )}
                    </div>
                </div>
                <Footer />
            </main>
        </Elements>
    );
};

export default Upgrade;

export async function getServerSideProps({ req }) {
    const apiKey = req.cookies.apiKey;
    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (isValid) {
        const products = await getProductsAndPrices();
        products.premium = products.premium[0];

        if (isValid.subscriptionType !== 'free')
            return {
                redirect: {
                    permanent: false,
                    destination: '/profil',
                },
            };

        return {
            props: {
                valid: false,
                user: isValid,
                products,
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
