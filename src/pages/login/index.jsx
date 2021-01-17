import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { login, verifyApiKey } from '../../requests';
import AltHeader from '../../components/Header/AltHeader';
import Footer from '../../components/Footer';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    let handleLogin = (e) => {
        e.preventDefault();
        login(email, password).catch((err) => setMessage(err.message));
    };

    useEffect(() => {
        verifyApiKey(localStorage.getItem('apiKey'));
    }, []);

    return (
        <main className="w-screen min-h-screen bg-gray-900 bg-opaque flex flex-col">
            <AltHeader />

            <div className="my-auto mx-6 lg:mx-80">
                <Form className="bg-gray-100 mb-12 overflow-hidden rounded shadow mx-auto">
                    <div className="w-full">
                        <div className="w-full bg-gray-700">
                            <h3 className="text-2xl text-gray-100 px-16 py-6 font-semibold">
                                Log ind
                            </h3>
                        </div>

                        <div className="px-16 py-4 flex justify-center items-center flex-col">
                            <Form.Group controlId="login-email">
                                <Form.Label>E-Mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    autoComplete="email"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="login-password">
                                <Form.Label>Adgangskode</Form.Label>
                                <Form.Control
                                    type="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                    required
                                />
                            </Form.Group>

                            <Button className="w-full" onClick={handleLogin}>
                                Log Ind
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
