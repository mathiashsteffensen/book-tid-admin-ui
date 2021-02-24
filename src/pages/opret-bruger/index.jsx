import React, { useState, useRef, useEffect } from 'react';

import { useRouter } from 'next/router';

import Link from 'next/link';

import { Form } from '../../components/agnostic/Form/Form';
import { Button } from '../../components/agnostic/Button';
import { Spinner } from '../../components/agnostic/Spinner';

import CompleteIcon from '@material-ui/icons/CheckCircleOutline';

import { signup, verifyApiKey } from '../../requests';
import { createBookingDomain } from '../../utils.tsx';

import AltHeader from '../../components/custom/Header/AltHeader';
import Footer from '../../components/custom/Footer';

function PartOne({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    handleNext,
}) {
    return (
        <div className="min-w-1/3-screen flex justify-center items-center flex-col">
            <h5 className="font-medium text-lg mb-2">Personlig Information:</h5>

            <Form.Row>
                <Form.Group className="min-w-32" md={4}>
                    <Form.Label slider={false}>Fornavn</Form.Label>
                    <Form.Control
                        autoComplete="given-name"
                        value={firstName.value}
                        onChange={(e) => firstName.update(e.target.value)}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Indtast venligst dit fornavn
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group md={8}>
                    <Form.Label slider={false}>Efternavn</Form.Label>
                    <Form.Control
                        autoComplete="family-name"
                        value={lastName.value}
                        onChange={(e) => lastName.update(e.target.value)}
                    />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group md={8}>
                    <Form.Label slider={false}>E-Mail</Form.Label>
                    <Form.Control
                        type="email"
                        autoComplete="email"
                        value={email.value}
                        onChange={(e) => email.update(e.target.value)}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Indtast venligst en gyldig E-Mail
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="min-w-32" md={4}>
                    <Form.Label slider={false}>Telefonnummer</Form.Label>
                    <Form.Control
                        type="phonenumber"
                        autoComplete="tel"
                        value={phoneNumber.value}
                        onChange={(e) => phoneNumber.update(e.target.value)}
                        pattern="\d+"
                    />
                     
                    <Form.Control.Feedback type="invalid">
                        Indtast venligst et gyldigt telefonnummer
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>

            <Form.Group>
                <Form.Label slider={false}>Adgangskode (8 tegn minimum)</Form.Label>
                <Form.Control
                    type="password"
                    autoComplete="password"
                    value={password.value}
                    onChange={(e) => password.update(e.target.value)}
                    required
                    minLength={8}
                />
                <Form.Control.Feedback type="invalid">
                    Indtast venligst en gyldig adgangskode
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" onClick={handleNext}>
                Næste
            </Button>
        </div>
    );
}

function PartTwo({
    setPartOne,
    companyName,
    city,
    zip,
    street,
    number,
    submit,
    loading,
    complete,
    bookingDomain,
}) {
    return (
        <div className="flex justify-center items-cetner flex-col">
            <h5 className="font-medium text-xl">
                Information om din virksomhed:
            </h5>

            <Form.Group>
                <Form.Label slider={false}>Din virksomheds navn</Form.Label>
                <Form.Control
                    autoComplete="organization"
                    value={companyName.value}
                    className="w-full"
                    onChange={(e) => companyName.update(e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Indtast venligst et virksomheds navn, dette bruges til at
                    generere dit booking link (Kan ændres senere)
                </Form.Control.Feedback>
                <p className="text-sm text-gray-600">Dit booking link: <span className="underline">{bookingDomain}</span></p>
            </Form.Group>

            <h6 className="font-medium text-lg mt-1">Adresse:</h6>

            <Form.Row>
                <Form.Group md={8}>
                    <Form.Label slider={false}>By</Form.Label>
                    <Form.Control
                        autoComplete="address-level2"
                        value={city.value}
                        className="w-full"
                        onChange={(e) => city.update(e.target.value)}
                    />
                </Form.Group>

                <Form.Group md={4}>
                    <Form.Label slider={false}>Postnummer</Form.Label>
                    <Form.Control
                        autoComplete="postal-code"
                        value={zip.value}
                        className="w-full"
                        onChange={(e) => zip.update(e.target.value)}
                    />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group md={9}>
                    <Form.Label slider={false}>Vej</Form.Label>
                    <Form.Control
                        autoComplete="street-address"
                        value={street.value}
                        className="w-full"
                        onChange={(e) => street.update(e.target.value)}
                    />
                </Form.Group>

                <Form.Group md={3}>
                    <Form.Label slider={false}>Husnummer</Form.Label>
                    <Form.Control
                        autoComplete="on"
                        value={number.value}
                        className="w-full"
                        onChange={(e) => number.update(e.target.value)}
                    />
                </Form.Group>
            </Form.Row>

            {!loading && !complete && (
                <Button variant="primary" onClick={submit}>
                    Opret
                </Button>
            )}

            {!loading && complete && (
                <Button>
                    <CompleteIcon fontSize="large" color="white" />
                </Button>
            )}

            {loading && (
                <Button className="flex justify-center">
                    <Spinner role="status" variant="light">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Button>
            )}

            <span className="w-full h-4"></span>

            <Button variant="secondary" onClick={() => setPartOne(true)}>
                Tilbage
            </Button>
        </div>
    );
}

export default function SignUp() {
    const router = useRouter();

    const query = router.query

    const [showPartOne, setShowPartOne] = useState(true);
    const [message, setMessage] = useState('');

    // Part one state
    const [firstName, setFirstName] = useState(query.firstName || '');
    const [lastName, setLastName] = useState(query.lastName || '');
    const [email, setEmail] = useState(query.email || '');
    const [phoneNumber, setPhoneNumber] = useState(query.phoneNumber || '');
    const [password, setPassword] = useState('');

    // Part two state
    const [companyName, setCompanyName] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');

    const [validated, setValidated] = useState(false);
    const formRef = useRef(null);

    // Submit state
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    const handleSubmit = (e) => {
        const form = formRef.current;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true);
        } else {
            setLoading(true);
            setValidated(false);
            e.preventDefault();
            let data = {
                name: {
                    firstName: firstName,
                    lastName: lastName,
                },
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                businessInfo: {
                    name: companyName,
                    address: {
                        city: city,
                        postcode: zip,
                        street: street,
                        number: number,
                    },
                },
            };
            signup(data)
                .then(() => {
                    setComplete(true);
                    setTimeout(() => router.push('/login'), 75);
                })
                .catch((err) => {
                    console.log(err);
                    setMessage(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleNext = (e) => {
        const form = formRef.current;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true);
        } else {
            setShowPartOne(false);
            setValidated(false);
        }
    };

    const [bookingDomain, setBookingDomain] = useState('.booktid.net');

    useEffect(() => {
        setBookingDomain(createBookingDomain(companyName));
    }, [companyName]);

    return (
        <main className="w-screen md:h-screen bg-gray-900 bg-opaque flex flex-col justify-start items-center">
            <AltHeader />

            <div className="flex justify-center items-center mx-6 h-full">
                <Form
                    ref={formRef}
                    noValidate
                    validated={validated}
                    className="bg-gray-100 overflow rounded shadow mx-4 my-4 form"
                >
                    <div style={{
                            borderTopLeftRadius: '0.13rem',
                            borderTopRightRadius: '0.13rem',
                        }} className="w-full bg-primary">
                        <h3 className="text-2xl text-gray-100 px-12 py-4 font-semibold">
                            Opret en bruger
                        </h3>
                    </div>

                    <div className="px-4 md:px-12 py-2 pt-4 flex justify-center items-center flex-col">
                        {showPartOne ? (
                            <PartOne
                                firstName={{
                                    value: firstName,
                                    update: setFirstName,
                                }}
                                lastName={{ value: lastName, update: setLastName }}
                                email={{ value: email, update: setEmail }}
                                phoneNumber={{
                                    value: phoneNumber,
                                    update: setPhoneNumber,
                                }}
                                password={{ value: password, update: setPassword }}
                                handleNext={handleNext}
                            />
                        ) : (
                            <PartTwo
                                companyName={{
                                    value: companyName,
                                    update: setCompanyName,
                                }}
                                city={{ value: city, update: setCity }}
                                zip={{ value: zip, update: setZip }}
                                street={{ value: street, update: setStreet }}
                                number={{ value: number, update: setNumber }}
                                setPartOne={setShowPartOne}
                                submit={handleSubmit}
                                loading={loading}
                                complete={complete}
                                bookingDomain={bookingDomain}
                            />
                        )}

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
                            Har du en bruger?{' '}
                            <Link href="/login">
                                <a>
                                    <span className="hover:text-purple-700 text-blue-700 underline">
                                        Log ind her
                                    </span>
                                </a>
                            </Link>
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
console.log(req.url);

        return {
            props: {
                valid: false,
            },
        };
    }
}
