import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router"

import { verifyApiKey } from '../requests';

import { Form } from "../components/agnostic/Form/Form"
import { Button } from "../components/agnostic/Button"
import { Subtitle } from "../components/agnostic/Subtitle"
import { Alert } from "../components/agnostic/Alert"

import AltHeader from '../components/custom/Header/AltHeader';
import Footer from '../components/custom/Footer';

import { isClient, __PROD__ } from "../constants"

export default function Feedback({ valid, user }) {

    const router = useRouter()

    const {
        error, 
        success
    }: {
        error?: string,
        success?: string
    } = router.query

    const [userData, setUserData]: [{
            accountDeleted: boolean,
            name: string,
            email: string
        } | false, React.SetStateAction<any>] = useState(false)

    useEffect(() => {
        if (isClient()) {
            const sessionUser = sessionStorage.getItem("user")
            if (user) {
                setUserData({
                    accountDeleted: false,
                    name: user.firstName,
                    email: user.email
                })
            } else if (sessionUser) {
                setUserData(JSON.parse(sessionUser))
            } else setUserData(false)
        }
    }, [])
    

    return (
        <div className="w-screen h-screen bg-gray-900 bg-opaque items-center flex flex-col justify-center">
            <AltHeader showBackLink={Boolean(user)} />

            <main className="flex-grow flex justify-center items-center">
                { !success ? <Form encType="multipart/form-data" action={__PROD__ ? "https://api.booktid.net/feedback" : "http://localhost:4000/feedback"} method="POST" className="bg-gray-100 p-5 rounded shadow my-4">

                    <Form.Group className={userData ? "hidden" : ""}>
                        <Form.Label htmlFor="name" slider={false}>Navn:</Form.Label>
                        {/** @ts-ignore */}
                        <Form.Input defaultValue={userData ? userData.name : ""} autoComplete="name" id="name" name="name"/>
                    </Form.Group>

                    <Form.Group className={userData ? "hidden" : ""}>
                        <Form.Label htmlFor="email" slider={false}>E-Mail:</Form.Label>
                        {/** @ts-ignore */}
                        <Form.Input defaultValue={userData ? userData.email : ""}  autoComplete="email" id="email" name="email" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="text" slider={false}><Subtitle>Fortæl os hvad vi kan gøre bedre</Subtitle></Form.Label>
                        <Form.Input id="text" name="text" style={{maxWidth: "none", minHeight: "7rem", maxHeight: "25rem"}} className="w-92" textarea />
                    </Form.Group>

                    <Button className="mb-2" type="submit">Send</Button>

                    { error && <Alert variant="danger">{ error }</Alert> }

                    <Alert className="text-sm" variant="info" >Du kan også altid skrive til os på <a className="link" href="mailto:service@booktid.net">service@booktid.net</a></Alert>
                </Form> : <Alert className="text-gray-100" variant="success">
                        { success }
                    </Alert>}
            </main>

            <Footer />
        </div>
    );
}

export async function getServerSideProps({ req }) {
    const isValid = await verifyApiKey(req.cookies.apiKey).catch((err) => {
        console.log(err)
        return false
    });

    if (isValid) {
        return {
            props: {
                valid: false,
                user: isValid
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