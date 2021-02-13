import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/da';
dayjs.locale('da');
import Link from 'next/link';

import AltHeader from '../../components/custom/Header/AltHeader';
import Footer from '../../components/custom/Footer';

import { Card } from '../../components/agnostic/Card/Card'

import {
    verifyApiKey,
    getMaxCalendars,
    getProfileSettings,
} from '../../requests';

export default function Thanks({ productPurchased }) {
    console.log(productPurchased);
    return (
        <div className="w-screen h-screen flex flex-col">
            <AltHeader showBackLink />

            <main className="w-full h-full flex flex-col justify-center items-center">
                <Card>
                    <Card.Body>
                        <Card.Text>
                            Vi har modtaget din betaling for BOOKTID{' '}
                            {productPurchased.name} Abonnement på{' '}
                            {new Intl.NumberFormat('da-DK', {
                                style: 'currency',
                                currency: 'DKK',
                            }).format(productPurchased.paymentOf / 100)}
                        </Card.Text>

                        <Card.Text>
                            Næste betaling vil blive opkrævet den{' '}
                            {dayjs(productPurchased.nextPaymentAt).format(
                                'D. MMM YYYY'
                            )}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card className="mt-2">
                    <Card.Body>
                        <Card.Title>
                            Hvis du har spørgsmål så tøv ikke med at kontakte os på{' '}
                            <a
                                className="link"
                                href="mailto:service@booktid.net"
                            >
                                service@booktid.net
                            </a>
                        </Card.Title>
                    </Card.Body>
                </Card>

                <div className="p-4 mt-4">
                    <Link href="/kalender">
                        <a className="link">Tilbage til min kalender</a>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export async function getServerSideProps({ req }) {
    const apiKey = req.cookies.apiKey;

    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (
        isValid &&
        isValid.status === 'active' &&
        isValid.invoiceStatus === 'paid' &&
        isValid.subscriptionType !== 'free'
    ) {
        const abortController = axios.CancelToken.source();
        const profileSettings = await getProfileSettings(apiKey).catch((err) =>
            console.log(err)
        );
        const productPurchased = {
            quantity: await getMaxCalendars(
                apiKey,
                abortController
            ).catch((err) => console.log(err)),
            name: isValid.subscriptionTypeName,
            unitName: 'Medarbejderkalender',
            paymentOf: profileSettings.lastMonthPaid,
            nextPaymentAt: profileSettings.currentPeriodEnd,
        };

        console.log(profileSettings);

        return {
            props: {
                valid: false,
                user: isValid,
                productPurchased,
            },
        };
    } else if (isValid) {
        return {
            redirect: {
                permanent: false,
                destination: '/profil',
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
