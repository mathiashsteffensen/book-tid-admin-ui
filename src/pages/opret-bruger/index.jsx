import React, { useState, useRef } from 'react'

import Link from 'next/link'

import TextField from '@material-ui/core/TextField'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import {signup, verifyApiKey} from '../../requests'


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

function PartTwo({setPartOne, companyName, city, zip, street, number, submit})
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
                <Form.Control.Feedback type="invalid">Indtast venligst et virksomheds navn, dette bruges til at generere dit booking link</Form.Control.Feedback>
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

            <Button 
            variant="primary"
            onClick={submit}>
  
                Opret
            </Button>
            <span className="w-full h-8"></span>
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
    const [showPartOne, setShowPartOne] = useState(false)
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

    const handleSubmit = (e) =>
    {
        const form = formRef.current
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true);
        } else 
        {
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
            signup(data).catch((err) => setMessage(err))
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

    return (
        <main className="w-screen h-screen bg-gray-900 bg-opaque flex flex-col justify-start items-center">
            <header className="w-screen bg-gray-200 py-3 flex justify-center items-center">
                <div className="w-1/2 text-lg md:text-2xl">
                    <button onClick={() => window.location = 'https://booktid.net'}>
                        <h1>BOOKTID.NET</h1>
                    </button>
                    <h2 className="font-medium">ONLINE BOOKINGSYSTEM</h2>
                </div>
            </header>

            <Form ref={formRef} noValidate validated={validated} className="bg-gray-100 overflow-hidden rounded shadow mt-4">
                <div className="w-full bg-gray-700">
                    <h3 className="text-2xl text-gray-100 px-16 py-6 font-semibold">Opret en bruger</h3>
                </div>

                <div className="px-16 py-4 flex justify-center items-center flex-col">
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
                            submit={handleSubmit} />
                    }

                    {message !== '' ? <p style={{color: 'red', fontSize: '12px', marginBottom: 0, marginTop: '0.5rem'}}>{message}</p> : null}

                    <div className="mt-2">
                        Har du en bruger? <Link href="/login"><a><span className="hover:text-purple-700 text-blue-700 underline">Log ind her</span></a></Link> 
                    </div>
                </div>
            </Form>
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