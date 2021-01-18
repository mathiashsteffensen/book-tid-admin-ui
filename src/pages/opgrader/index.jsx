import React, { useState } from 'react';

// Component library imports
import CardDeck from 'react-bootstrap/CardDeck';

// Stripe elements
import { Elements } from '@stripe/react-stripe-js/';
import { loadStripe } from '@stripe/stripe-js';

// Custom component imports
import ProductTemplate from '../../components/ProductTemplate/ProductTemplate';
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import AltHeader from '../../components/Header/AltHeader';
import Footer from '../../components/Footer';

// Icon Imports
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import EmailIcon from '@material-ui/icons/Email';
import CheckIcon from '@material-ui/icons/Check';
import WebIcon from '@material-ui/icons/Web';
import TimelineIcon from '@material-ui/icons/Timeline';

// HTTP Request imports
import { getProductsAndPrices, verifyApiKey } from '../../requests';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const features = {
    premium: [
        {
            title: 'Ubegrænsede bookinger',
            Icon: CheckIcon,
            implemented: true,
        },
        {
            title: 'Modtag nemt online bookinger',
            Icon: EventAvailableIcon,
            implemented: true,
        },
        {
            title:
                'Sæt begrænsninger for hvor kort tid før der kan bookes, så er du altid forberedt',
            Icon: EventBusyIcon,
            implemented: true,
        },
        {
            title: 'Send E-Mail-Påmindelser automatisk',
            Icon: EmailIcon,
            implemented: true,
            description: 'Send bekræftelses E-Mails samt E-Mails når tider ændres eller aflyses'
        },
        {
            title: 'Få en personlig bookingside',
            Icon: WebIcon,
            implemented: true,
            description: `Hvis din forretning er "Frisør Eksempel" kan der bookes tid hos <span class="text-primary">frisoereksempel.booktid.net</span>`
        },
        {
            title: 'Se detaljeret statistik relateret til din forretning',
            Icon: TimelineIcon,
            implemented: false
        }
    ],
    basic: [
        {
            title: 'Op til 150 bookinger per måned',
            Icon: CheckIcon,
            implemented: true,
        },
        {
            title: 'Modtag nemt online bookinger',
            Icon: EventAvailableIcon,
            implemented: true,
        },
        {
            title:
                'Sæt begrænsninger for hvor kort tid før der kan bookes, så er du altid forberedt',
            Icon: EventBusyIcon,
            implemented: true,
        },
        {
            title: 'Send E-Mail påmindelser automatisk',
            Icon: EmailIcon,
            implemented: true,
        },
        {
            title: 'Få en personlig bookingside med din branding',
            Icon: WebIcon,
            implemented: true,
            description: `Hvis din forretning er "Frisør Eksempel" kan der bookes tid hos <span class="text-primary">frisoereksempel.booktid.net</span>`
        },
        {
            title: 'Se detaljeret statistik relateret til din forretning',
            Icon: TimelineIcon,
        }
    ],
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

                <div className="md:mx-32 pt-6 pb-20 mb-auto mx-6">
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
                                    product={products.basic}
                                    features={features.basic}
                                />
                                <ProductTemplate
                                    handleProductSelect={handleProductSelect}
                                    product={products.premium}
                                    features={features.premium}
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
    console.log(isValid);
    if (isValid) {
        const products = await getProductsAndPrices();
        products.basic = products.basic[0];
        products.premium = products.premium[0];

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
