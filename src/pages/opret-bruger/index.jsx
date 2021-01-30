import React, { useState, useRef, useEffect } from 'react'

import {useRouter} from 'next/router'

import Link from 'next/link'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import CompleteIcon from '@material-ui/icons/CheckCircleOutline';

import {signup, verifyApiKey} from '../../requests'
import {createBookingDomain} from '../../utils'

import AltHeader from '../../components/Header/AltHeader'
import Footer from '../../components/Footer'

function PartOne({firstName, lastName, email, phoneNumber, password, handleNext})
{
    return (
        <div className="min-w-1/3-screen flex justify-center items-cetner flex-col">
            <h5 className="font-medium text-lg mb-2">Personlig Information:</h5>

            <Form.Row>
                <Form.Group as={Col} className="min-w-32" md={4}>
                    <Form.Label>Fornavn</Form.Label>
                    <Form.Control
                        autoComplete="given-name" 
                        value={firstName.value} 
                        onChange={(e) => firstName.update(e.target.value)}
                        required  
                    />
                    <Form.Control.Feedback type="invalid">Indtast venligst dit fornavn</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md={8}>
                    <Form.Label>Efternavn</Form.Label>
                    <Form.Control
                        autoComplete="family-name" 
                        value={lastName.value} 
                        onChange={(e) => lastName.update(e.target.value)}
                    />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md={8}>
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control
                        type="email"
                        autoComplete="email" 
                        value={email.value} 
                        onChange={(e) => email.update(e.target.value)}
                        required  
                    />
                    <Form.Control.Feedback type="invalid">Indtast venligst en gyldig E-Mail</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} className="min-w-32" md={4}>
                    <Form.Label>Telefonnummer</Form.Label>
                    <Form.Control
                        type="phonenumber"
                        autoComplete="tel" 
                        value={phoneNumber.value} 
                        onChange={(e) => phoneNumber.update(e.target.value)}
                        required  
                    />
                    <Form.Control.Feedback type="invalid">Indtast venligst et gyldigt telefonnummer</Form.Control.Feedback>
                </Form.Group>   
            </Form.Row>

            <Form.Group>
                <Form.Label>Adgangskode (8 tegn minimum)</Form.Label>
                <Form.Control
                    type="password"
                    autoComplete="password" 
                    value={password.value} 
                    onChange={(e) => password.update(e.target.value)}
                    required
                    minLength={8}  
                />
                <Form.Control.Feedback type="invalid">Indtast venligst en gyldig adgangskode</Form.Control.Feedback>
            </Form.Group>

            <Button 
                variant="primary"
                onClick={handleNext}
            >
                Næste
            </Button>
        </div>
    )
}

function PartTwo({setPartOne, companyName, city, zip, street, number, submit, loading, complete, bookingDomain})
{
    return (
        <div className="flex justify-center items-cetner flex-col">
            <h5 className="font-medium text-lg mb-2">Information om din virksomhed:</h5>

            <Form.Group>
                <Form.Label>Din virksomheds navn</Form.Label>
                <Form.Control
                    autoComplete="organization" 
                    value={companyName.value} 
                    className="w-full" 
                    onChange={(e) => companyName.update(e.target.value)}
                    required 
                />
                <Form.Control.Feedback type="invalid">Indtast venligst et virksomheds navn, dette bruges til at generere dit booking link (Kan ændres senere)</Form.Control.Feedback>
                <p className="text-muted">{bookingDomain}</p>
            </Form.Group>

            <h6 className="font-medium text-lg my-2">Adresse:</h6>

            <Form.Row>
                <Form.Group as={Col} md={8}>
                    <Form.Label>By</Form.Label>
                    <Form.Control
                        autoComplete="address-level2" 
                        value={city.value} 
                        className="w-full" 
                        onChange={(e) => city.update(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group as={Col} md={4}>
                    <Form.Label>Postnummer</Form.Label>
                    <Form.Control
                        autoComplete="postal-code" 
                        value={zip.value} 
                        className="w-full" 
                        onChange={(e) => zip.update(e.target.value)} 
                    />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md={9}>
                    <Form.Label>Vej</Form.Label>
                    <Form.Control
                        autoComplete="street-address" 
                        value={street.value} 
                        className="w-full" 
                        onChange={(e) => street.update(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group as={Col} md={3}>
                    <Form.Label>Husnummer</Form.Label>
                    <Form.Control
                        autoComplete="on" 
                        value={number.value} 
                        className="w-full" 
                        onChange={(e) => number.update(e.target.value)} 
                    />
                </Form.Group>
            </Form.Row>

            {(!loading && !complete) && <Button 
                variant="primary"
                onClick={submit}
            >
  
                Opret
            </Button>}

            {(!loading && complete) && <Button>
                <CompleteIcon size="lg" color="white" />
            </Button>}

            {loading && <Button>
                <Spinner role="status" animation="border">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Button>}

            <span className="w-full h-4"></span>

            <Button 
                variant="secondary"
                onClick={() => setPartOne(true)}
            >
                Tilbage
            </Button>
        </div>
    )
}

export default function SignUp() 
{
    const router = useRouter()

    const [showPartOne, setShowPartOne] = useState(true)
    const [message, setMessage] = useState('')

    // Part one state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')

    // Part two state
    const [companyName, setCompanyName] = useState('')
    const [city, setCity] = useState('')
    const [zip, setZip] = useState('')
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')

    const [validated, setValidated] = useState(false)
    const formRef = useRef(null)

    // Submit state
    const [loading, setLoading] = useState(false)
    const [complete, setComplete] = useState(false)

    const handleSubmit = (e) =>
    {
        const form = formRef.current
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true);
        } else 
        {
            setLoading(true)
            setValidated(false)
            e.preventDefault()
            let data = {
                name: {
                    firstName: firstName,
                    lastName: lastName
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
                        number: number
                    }
                },
            }
            signup(data)
            .then(() => 
            {
                setComplete(true)
                setTimeout(() => router.push('/login'), 75)
            })
            .catch((err) => {
                console.log(err);
                setMessage(err)
            })
            .finally(() => 
            {
                setLoading(false)
                
            })
        }
        
    }

    const handleNext = (e) =>
    {
        const form = formRef.current
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true);
        } else 
        {
            setShowPartOne(false)
            setValidated(false)
        }
      
        
    }

    const [bookingDomain, setBookingDomain] = useState('.booktid.net')

    useEffect(() =>
    {
        setBookingDomain(createBookingDomain(companyName))
    }, [companyName])

    return (
        <main className="w-screen min-h-screen pb-16 bg-gray-900 bg-opaque flex flex-col justify-start items-center">
            <AltHeader />

            <Form ref={formRef} noValidate validated={validated} className="bg-gray-100 overflow-hidden rounded shadow mx-4 my-4">
                <div className="w-full bg-gray-700">
                    <h3 className="text-2xl text-gray-100 px-16 py-6 font-semibold">Opret en bruger</h3>
                </div>

                <div className="px-4 md:px-16 py-4 flex justify-center items-center flex-col">
                    {showPartOne 
                    ? 
                        <PartOne 
                            firstName={{value: firstName, update: setFirstName}} 
                            lastName={{value: lastName, update: setLastName}}
                            email={{value: email, update: setEmail}}
                            phoneNumber={{value: phoneNumber, update: setPhoneNumber}} 
                            password={{value: password, update: setPassword}} 
                            handleNext={handleNext} 
                        /> 
                    : 
                        <PartTwo 
                            companyName={{value: companyName, update: setCompanyName}}  
                            city={{value: city, update: setCity}}
                            zip={{value: zip, update: setZip}}
                            street={{value: street, update: setStreet}} 
                            number={{value: number, update: setNumber}} 
                            setPartOne={setShowPartOne}
                            submit={handleSubmit} 
                            loading={loading}
                            complete={complete}
                            bookingDomain={bookingDomain}
                        />
                            
                    }

                    {message !== '' ? <p style={{color: 'red', fontSize: '12px', marginBottom: 0, marginTop: '0.5rem'}}>{message}</p> : null}

                    <div className="mt-2">
                        Har du en bruger? <Link href="/login"><a><span className="hover:text-purple-700 text-blue-700 underline">Log ind her</span></a></Link> 
                    </div>
                </div>
            </Form>

            <Footer />
        </main>
    )
}

export async function getServerSideProps({req})
{

    const isValid = await verifyApiKey(req.cookies.apiKey).catch(err => console.log(err))

    if (isValid)
    {
        return {
            redirect: {
                permanent: false,
                destination: '/kalender'
            }
        }
    } else
    {


        return {
            props: {
                valid: false
            }
        }
    }
}