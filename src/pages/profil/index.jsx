import React, { useState } from 'react'

import Link from 'next/link'

import dayjs from 'dayjs'

import Main from '../../components/Main'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'

import EditIcon from '@material-ui/icons/Edit';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import {
    verifyApiKey, 
    getProfileSettings,
    getProduct,
    cancelSubscription
} from '../../requests'

export default function Profile({initProfileSettings, currentProduct, user}) 
{
    console.log(initProfileSettings);
    const [profileSettings, setProfileSettings] = useState({
        name: initProfileSettings.name,
        email: initProfileSettings.email,
        phoneNumber: initProfileSettings.phoneNumber,
        businessInfo: initProfileSettings.businessInfo
    })
    
    const [editing, setEditing] = useState(false)

    const handleSubscriptionCancellation = () =>
    {
        const confirmed = window.confirm('Er du sikker på at du vil aflyse dit abonnement? Din bruger vil blive sat på et gratis abonnement og eventuelt data fra premium features vil blive slettet.')
        if (confirmed) cancelSubscription(localStorage.getItem('apiKey')).then(window.location.reload).catch(err => console.log(err))
    }

    return (
        <Main
            title="Din Profil"
            CTAs={
                editing 
                ? <Button onClick={() => setEditing(false)} size="lg">Gem</Button> 
                : <Button title="Ændr i dine indstillinger" onClick={() => setEditing(true)} variant="outline-primary"><EditIcon /></Button>
            }
        >
            <Container fluid>
                <Row>
                    <Col sm={6}>
                        <Row>
                            <Col className="full-underline text-lg" md={12}>
                                Personlig Information
                            </Col>
                            
                            <Col className="mt-2" md={4}>
                                <Form.Group>
                                    <Form.Label>
                                        Fornavn
                                    </Form.Label>
                                    <Form.Control 
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings, 
                                            ...{
                                                name: {
                                                    firstName: e.target.value, 
                                                    lastName: profileSettings.name.lastName
                                                }
                                            }
                                        })} 
                                        readOnly={!editing} 
                                        value={profileSettings.name.firstName} 
                                    />
                                </Form.Group>
                            </Col>
                                    
                            <Col className="mt-2">
                                <Form.Group>
                                    <Form.Label>
                                        Efternavn
                                    </Form.Label>
                                    <Form.Control
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings, 
                                            ...{
                                                name: {
                                                    firstName: profileSettings.name.firstName, 
                                                    lastName: e.target.value
                                                }
                                            }
                                        })} 
                                        readOnly={!editing} 
                                        value={profileSettings.name.lastName} 
                                    />
                                </Form.Group>
                            </Col>  
                            
                        </Row>

                        <Row>
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label>
                                        E-Mail
                                    </Form.Label>
                                    <Form.Control
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings, 
                                            ...{
                                                email: e.target.value
                                            }
                                        })}  
                                        readOnly={!editing} 
                                        value={profileSettings.email} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>
                                        Telefonnummer
                                    </Form.Label>
                                    <Form.Control 
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings, 
                                            ...{
                                                phoneNumber: e.target.value
                                            }
                                        })} 
                                        type="tel" 
                                        readOnly={!editing} 
                                        value={profileSettings.phoneNumber} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col className="full-underline text-lg mt-4" md={12}>
                                Forretningsinformation
                            </Col>

                            <Col className="mt-2" md={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Navn
                                    </Form.Label>
                                    <Form.Control 
                                        onChange={(e) => setProfileSettings({
                                            ...profileSettings, 
                                            ...{
                                                businessInfo: {
                                                    name: e.target.value,
                                                    address: profileSettings.businessInfo.address
                                                }
                                            }
                                        })} 
                                        readOnly={!editing} 
                                        value={profileSettings.businessInfo.name} 
                                    />
                                </Form.Group>
                            </Col>

                            <Col className="mt-2" md={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Adresse
                                    </Form.Label>

                                    <Row>
                                        <Col md={9}>
                                            <Form.Group>
                                                <Form.Label>
                                                    By
                                                </Form.Label>
                                                <Form.Control 
                                                    onChange={(e) => setProfileSettings({
                                                        ...profileSettings, 
                                                        ...{
                                                            businessInfo: {
                                                                name: profileSettings.businessInfo.name,
                                                                address: {
                                                                    ...profileSettings.businessInfo.address,
                                                                    ...{
                                                                        city: e.target.value
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })} 
                                                    readOnly={!editing} 
                                                    value={profileSettings.businessInfo.address.city} 
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="full-underline text-lg" md={12}>
                                Abonnementsinformation
                            </Col>

                            <Col md={12} className="mt-2">
                                <div>BOOKTID {currentProduct.name} Abonnement</div>
                                <div className="text-sm">{initProfileSettings.maxNumberOfCalendars} &#215; {currentProduct.metadata.unit_name}</div>

                                {user.subscriptionType !== 'free' && <div className="text-sm text-muted mt-2">Sidste betaling var {new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(initProfileSettings.lastMonthPaid/100)}</div>}
                                
                                {(!user.cancelAtPeriodEnd && user.subscriptionType !== 'free') && <div>
                                    <div className="text-sm text-muted">Næste betaling på {new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(initProfileSettings.nextMonthPay/100)} forfalder {dayjs(initProfileSettings.currentPeriodEnd).format('DD/MM/YYYY')}</div>
                                    <br/>
                                    <div className="text-sm font-semibold flex justify-start items-center"> 
                                        <Button onClick={handleSubscriptionCancellation} size="sm" variant="outline-danger">
                                            Opsig abonnement <ArrowRightAltIcon className="ml-1" />
                                        </Button>
                                    </div>
                                </div>}
                                
                                <div className="mt-2">
                                    {user.cancelAtPeriodEnd && <Alert variant="danger">Du har opsagt dit abonnement gældende fra {dayjs(initProfileSettings.currentPeriodEnd).format('DD/MM/YYYY')}</Alert>}
                                    
                                    {(user.subscriptionType === 'free' && user.status === 'active') && (
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
                                    
                                    {(user.status !== 'active' && user.invoiceStatus === 'open' && user.subscriptionType !== 'free') && 
                                        <Alert variant="warning">
                                            Der skete en fejl med din betaling 
                                            <Link href="/ny-betalingsmetode">
                                                <a className="px-1 link">
                                                    klik her 
                                                </a>
                                            </Link>
                                            for at tilføje en ny betalingsmetode
                                        </Alert>
                                    }

                                    {(user.status !== 'active' && user.invoiceStatus === 'open' && user.subscriptionType === 'free') && 
                                        <div className="w-full">
                                            <Alert variant="warning">
                                                Der skete en fejl med din betaling da du forsøgte at opgradere
                                                <Link href="/ny-betalingsmetode">
                                                    <a className="px-1 link">
                                                        klik her 
                                                    </a>
                                                </Link>
                                                for at tilføje en ny betalingsmetode og fuldføre opgraderingen
                                            </Alert>

                                            <Alert variant="info">
                                                Vil du vælge en ny plan? 
                                                <Link href="/opgrader">
                                                    <a className="px-1 link">
                                                        klik her 
                                                    </a>
                                                </Link>
                                            </Alert>
                                        </div>
                                    } 
                                </div>
                                
                                
                            </Col>
                        </Row>
                    </Col>
                </Row> 
            </Container>
        </Main>
    )
}

export async function getServerSideProps({req}) 
{
    const apiKey = req.cookies.apiKey
    const isValid = await verifyApiKey(apiKey).catch(err => console.log(err))

    if (isValid)
    {
        const profileSettings = await getProfileSettings(apiKey).catch(err => console.log(err))
        
        const currentProduct = profileSettings.subscriptionType !== 'free' 
            ? await getProduct(profileSettings.subscriptionType, apiKey).catch(err => console.log(err)) 
            : {
                name: 'Free',
                unitName: 'Medarbejderkalender',
                metadata: {
                    unit_name: 'Medarbejderkalender'
                }
            }

        console.log(currentProduct);

        return {
            props: {
                valid: Boolean(isValid),
                user: isValid,
                initProfileSettings: profileSettings,
                currentProduct
            } 
        }
    } else return {
        redirect: {
            permanent: false,
            destination: '/login'
        }
    }
}