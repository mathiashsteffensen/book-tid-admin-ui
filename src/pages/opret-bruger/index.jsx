import React, { useState } from 'react'

import Link from 'next/link'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import {signup} from '../../requests'

function PartOne({setPartOne, firstName, lastName, email, phoneNumber, password})
{
    return (
        <div className="w-78 flex justify-center items-cetner flex-col">
            <h5 className="font-medium text-md">Personlig Information:</h5>

            <TextField size="small" autoComplete="given-name" value={firstName.value} margin="normal" className="w-full" onChange={(e) => firstName.update(e.target.value)} color="primary" id="outlined-basic" label="Fornavn" type="text" required variant="outlined"/>
                    
            <TextField size="small" autoComplete="family-name" value={lastName.value} margin="normal" className="w-full" onChange={(e) => lastName.update(e.target.value)} color="primary" id="outlined-basic" label="Efternavn" type="text" variant="outlined"/>

            <TextField size="small" autoComplete="email" value={email.value} margin="normal" className="w-full" onChange={(e) => email.update(e.target.value)} color="primary" id="outlined-basic" label="E-Mail" type="email" required variant="outlined"/>
                    
            <TextField size="small" autoComplete="tel" value={phoneNumber.value} margin="normal" className="w-full" onChange={(e) => phoneNumber.update(e.target.value)} color="primary" id="outlined-basic" label="Telefonnummer" type="phonenumber" required variant="outlined"/>
            
            <TextField size="small" autoComplete="new-password" value={password.value} margin="normal" className="w-full" onChange={(e) => password.update(e.target.value)} color="primary" id="outlined-basic" label="Kodeord" type="password" required variant="outlined"/>

            <Button margin="normal" variant="contained" color="primary" onClick={() => setPartOne(false)}>
                Næste
            </Button>
        </div>
    )
}

function PartTwo({setPartOne, companyName, city, zip, street, number, submit})
{
    return (
        <div className="w-78 flex justify-center items-cetner flex-col">
            <h5 className="font-medium text-md">Information om din virksomhed:</h5>

            <TextField size="small" autoComplete="organization" value={companyName.value} margin="normal" className="w-full" onChange={(e) => companyName.update(e.target.value)} color="primary" id="outlined-basic" label="Din virksomheds navn" type="text" required variant="outlined"/>

            <h6 className="font-medium text-sm mb-0 mt-4">Adresse:</h6>

            <TextField size="small" autoComplete="address-level2" value={city.value} margin="normal" className="w-full" onChange={(e) => city.update(e.target.value)} color="primary" id="outlined-basic" label="By" type="text" variant="outlined"/>

            <TextField size="small" autoComplete="postal-code" value={zip.value} margin="normal" className="w-full" onChange={(e) => zip.update(e.target.value)} color="primary" id="outlined-basic" label="Postnummer" min="1000" max="9999" type="number" variant="outlined"/>
                    
            <TextField size="small" autoComplete="street-addres" value={street.value} margin="normal" className="w-full" onChange={(e) => street.update(e.target.value)} color="primary" id="outlined-basic" label="Vej" type="text" variant="outlined"/>
            
            <TextField size="small" autoComplete="on" value={number.value} margin="normal" className="w-full" onChange={(e) => number.update(e.target.value)} color="primary" id="outlined-basic" label="Nummer" type="number" variant="outlined"/>

            <Button margin="normal" variant="contained" color="primary" onClick={submit}>
                Opret
            </Button>
            <span className="w-full h-8"></span>
            <Button margin="normal" variant="contained" color="secondary" onClick={() => setPartOne(true)}>
                Tilbage
            </Button>
        </div>
    )
}

export default function SignUp() 
{
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

    const handleSubmit = (e) =>
    {
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

    return (
        <main className="w-screen h-screen bg-opaque flex justify-center items-center">
            <form className="px-12 py-4 bg-gray-100 rounded-lg shadow-lg">
                <div className="w-full flex justify-center items-center flex-col">
                    <h3 className="text-2xl font-medium pb-4">Opret en bruger</h3>

                    {showPartOne 
                    ? 
                        <PartOne 
                            firstName={{value: firstName, update: setFirstName}} 
                            lastName={{value: lastName, update: setLastName}}
                            email={{value: email, update: setEmail}}
                            phoneNumber={{value: phoneNumber, update: setPhoneNumber}} 
                            password={{value: password, update: setPassword}} 
                            setPartOne={setShowPartOne} /> 
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
                    <Link href="/login"><a>Har du en bruger? <span className="hover:text-purple-700 text-blue-700 underline">Log ind her</span></a></Link>
                </div>
            </form>
        </main>
    )
}

