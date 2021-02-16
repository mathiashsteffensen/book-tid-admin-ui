import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { Button } from '../../components/agnostic/Button';
import { Form } from '../../components/agnostic/Form/Form';
import { Spinner } from '../../components/agnostic/Spinner';

import { login, verifyApiKey } from '../../requests';
import AltHeader from '../../components/custom/Header/AltHeader';
import Footer from '../../components/custom/Footer';

import CompleteIcon from '@material-ui/icons/CheckCircleOutline';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const [submitting, setSubmitting] = useState(false);

    const [complete, setComplete] = useState(false)

    let handleLogin = (e) => {
        setSubmitting(true);
        e.preventDefault();
        login(email, password)
            .then(() => setComplete(true))
            .catch((err) => setMessage(err.message))
            .finally(() => setSubmitting(false));
    };

    useEffect(() => {
        verifyApiKey(localStorage.getItem('apiKey'));
    }, []);

    return (
        <main className="w-screen h-screen bg-gray-900 bg-opaque items-center flex flex-col">
            <AltHeader />

            <div className="max-w-md flex justify-center items-center mx-6 h-full">
                <Form className="bg-gray-100 overflow-hidden rounded-lg shadow mx-auto">
                    <div className="w-full">
                        <div className="w-full bg-gray-700">
                            <h3 className="text-2xl text-gray-100 px-12 py-4 font-semibold">
                                Log ind
                            </h3>
                        </div>

                        <div className="md:px-12 px-4 py-4 flex justify-center items-center flex-col">
                            <Form.Group direction="row" controlId="login-email">
                                <Form.Input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    autoComplete="email"
                                    required
                                    placeholder=" "
                                    id="email"
                                />
                                <Form.Label htmlFor="email">E-Mail</Form.Label>
                            </Form.Group>

                            <Form.Group direction="row" controlId="login-password">
                                <Form.Input
                                    type="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                    required
                                    placeholder=" "
                                    id="password"
                                />
                                <Form.Label htmlFor="password">Adgangskode</Form.Label>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-full flex justify-center items-center"
                                onClick={handleLogin}
                            >
                                {submitting && (
                                    <Spinner variant="light" />
                                )}

                                {complete && (
                                    <CompleteIcon fontSize="large" />
                                )}

                                {(!submitting && !complete) && (
                                    'Log Ind'
                                )}
                            </Button>

                            {message !== '' ? (
                                <p
                                    style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginBottom: 0,
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    {message}
                                </p>
                            ) : null}

                            <div className="mt-2">
                                Har du ikke en bruger?{' '}
                                <Link href="/opret-bruger">
                                    <a>
                                        <span className="hover:text-blue-800 text-blue-700 underline">
                                            Opret dig her
                                        </span>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>

            <Footer />
        </main>
    );
}

export async function getServerSideProps({ req }) {
    const isValid = await verifyApiKey(req.cookies.apiKey).catch((err) =>
        console.log(err)
    );

    if (isValid) {
        return {
            redirect: {
                permanent: false,
                destination: '/kalender',
            },
        };
    } else {
        return {
            props: {
                valid: false,
            },
        };
    }
}
