import Link from 'next/link';
import Head from 'next/head';
import { Provider } from 'react-redux'
import { useStore } from '../redux/store'

import { FormProvider } from '../components/custom/forms/FormProvider'

import '../../styles/sass/index.scss'
import '../../styles/index.css';
import Footer from '../components/custom/Footer';
import Header from '../components/custom/Header/Header';
import EmailConfirmationBanner from '../components/custom/EmailConfirmationBanner'

import { Button } from '../components/agnostic/Button';

function MyApp({ Component, pageProps }) {
    const { user } = pageProps;
    const reduxStore = useStore({
        form: {
            isOpen: false,
            props: {}
        }
    })

    if (typeof window !== 'undefined') {
        window.$crisp=[];
        window.CRISP_WEBSITE_ID=process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    }
    
    if (pageProps.valid) {
        return (
            <div>
                {((user.subscriptionType === 'free' &&
                    user.status === 'active' && user.emailConfirmed) ||
                    (user.subscriptionType === 'free' &&
                        user.invoiceStatus === 'void' && user.emailConfirmed)) && (
                    <div className="w-full bg-gray-100 flex justify-center items-center py-3">
                        <Link href="/opgrader">
                            <a>
                                <Button>
                                    {'Opgrader til premium'.toUpperCase()}
                                </Button>
                            </a>
                        </Link>
                    </div>
                )}

                { !user.emailConfirmed && (
                    <EmailConfirmationBanner email={user.email} />
                ) }

                {user.invoiceStatus === 'open' && user.status !== 'active' && (
                    <div className="w-full bg-gray-100 flex justify-center items-center py-3">
                        <p>
                            Der skete en fejl med din betaling
                            <Link href="/ny-betalingsmetode">
                                <a className="px-1 link">klik her</a>
                            </Link>
                            for at tilføje en ny betalingsmetode
                        </p>
                    </div>
                )}

                <Head>
                    <link rel="preconnect" href="https://api.booktid.net" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />

                    <link rel="dns-prefetch" href="https://api.booktid.net" />
                    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    
                    <link rel="icon" href="icons/calendar/16x16.png" />
                    <title>BOOKTID.NET | Admin</title>
                    <meta name="description" content={`
                        Administration for BOOKTID.NET brugere
                    `}></meta>
                    <script src="https://client.crisp.chat/l.js" async defer></script>
                    {`<!-- Global site tag (gtag.js) - Google Analytics`}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C9HFB5GCLJ"></script>
                    <script>
                        {`window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());

                      gtag('config', 'G-C9HFB5GCLJ');`}
                    </script>
                </Head>
                <Provider store={reduxStore} >
                    <FormProvider>
                        <Header />
                        <Component {...pageProps} />
                        <Footer /> 
                    </FormProvider>
                </Provider>
                
            </div>
        );
    }

    return (
        <div>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <link rel="icon" href="icons/calendar/16x16.png" />
                <title>BOOKTID.NET | Admin</title>
                <meta name="description" content={`
                    Administration for BOOKTID.NET brugere
                `}></meta>
                {`<!-- Global site tag (gtag.js) - Google Analytics`}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C9HFB5GCLJ"></script>
                    <script>
                        {`window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());

                      gtag('config', 'G-C9HFB5GCLJ');`}
                    </script>
            </Head>
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp;
