import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import 'dayjs/locale/da'
dayjs.locale('da')
import Link from 'next/link'

import AltHeader from '../../components/Header/AltHeader'
import Footer from '../../components/Footer'

import { 
    verifyApiKey,
    getMaxCalendars,
    getProfileSettings 
} from '../../requests'


export default function Thanks({productPurchased}) {
    console.log(productPurchased);
    return (
        <div className="w-screen h-screen flex flex-col">
            <AltHeader showBackLink />

            <main className="w-full h-full flex flex-col justify-center items-center">
                <div className="p-4 m-2 text-gray-100 bg-secondary text-center rounded-sm shadow-xs">
                    <p>Vi har modtaget din betaling for BOOKTID {productPurchased.name} Abonnement på {new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(productPurchased.paymentOf/100)}</p>
                    <p>Næste betaling vil blive opkrævet den {dayjs(productPurchased.nextPaymentAt).format('D. MMM YYYY')}</p>
                </div>

                <div className="p-4 m-2 text-gray-100 bg-secondary text-center text-lg rounded-sm shadow-xs">
                    <h1 className="text-xl">Tak for at du er kunde hos os!</h1>
                    <br />
                    <h2>Hvis du har spørgsmål så tøv ikke med at kontakte os på <a className="link-muted" href="mailto:service@booktid.net">service@booktid.net</a></h2>
                </div>

                <div>
                    <Link href="/kalender">
                        <a className="link p-4 m-2">
                            Tilbage til min kalender
                        </a>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export async function getServerSideProps({req})
{
    const apiKey = req.cookies.apiKey

    const isValid = await verifyApiKey(apiKey).catch(err => console.log(err))

    if (isValid && isValid.status === 'active' && isValid.invoiceStatus === 'paid' && isValid.subscriptionType !== 'free')
    {
        const abortController = axios.CancelToken.source()
        const profileSettings = await getProfileSettings(apiKey).catch(err => console.log(err))
        const productPurchased = {
            quantity: await getMaxCalendars(apiKey, abortController).catch(err => console.log(err)),
            name: isValid.subscriptionTypeName,
            unitName: 'Medarbejderkalender',
            paymentOf: profileSettings.lastMonthPaid,
            nextPaymentAt: profileSettings.currentPeriodEnd
        }

        console.log(profileSettings);

        return {
            props: {
                valid: false,
                user: isValid,
                productPurchased
            }
        }
    } else if (isValid)
    {
        return {
            redirect: {
                permanent: false,
                destination: '/profil'
            }
        }
    } else return {
        redirect: {
            permanent: false,
            destination: '/login'
        }
    }
}