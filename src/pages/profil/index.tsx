import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import dayjs from 'dayjs';

import Main from '../../components/custom/Main';

import { Button } from '../../components/agnostic/Button';
import { FlexContainer as Container } from '../../components/agnostic/FlexContainer';
import { Form } from '../../components/agnostic/Form/Form';
import { Alert } from '../../components/agnostic/Alert';
import { Row } from '../../components/agnostic/Row'
import { Col } from '../../components/agnostic/Col';
import { Spinner } from '../../components/agnostic/Spinner'

import EditIcon from '@material-ui/icons/Edit';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ArrowDownAltIcon from '@material-ui/icons/ArrowDownward';

import {
    verifyApiKey,
    getProfileSettings,
    getProduct,
    getProductsAndPrices,
    cancelSubscription,
    updateProfile
} from '../../requests';

import InlineUpgrade from '../../components/custom/InlineUpgrade/InlineUpgrade';

export default function Profile({ initProfileSettings, currentProduct, user }) {
    console.log(initProfileSettings);
    currentProduct.quantity = initProfileSettings.maxNumberOfCalendars;
    const [profileSettings, setProfileSettings]: [{
        name: {
            firstName: string,
            lastName: string
        },
        email: string,
        phoneNumber: string,
        businessInfo: {
            name: string,
            address: {
                city: string,
                postcode: string,
                street: string,
                number: string
            }
        }
    }, any] = useState({
        name: initProfileSettings.name,
        email: initProfileSettings.email,
        phoneNumber: initProfileSettings.phoneNumber,
        businessInfo: initProfileSettings.businessInfo,
    });

    const [editing, setEditing] = useState(false);

    const [changingSubscription, setChangingSubscription] = useState(false);

    const [products, setProducts]: [any, any] = useState({});

    const [productsReady, setProductsReady] = useState(false);

    const [saving, setSaving] = useState(false)
    
    const [saveInfo, setSaveInfo]: [boolean | string, any] = useState(false)

    const [saveError, setSaveError] = useState('')

    useEffect(() => {
        getProductsAndPrices().then((res) => {
            const products = res;
            products.premium = res.premium[0];
            setProducts(products);
            setProductsReady(true);
        });
    }, []);

    const handleSubscriptionCancellation = () => {
        const confirmed = window.confirm(
            'Er du sikker på at du vil aflyse dit abonnement? Din bruger vil blive sat på et gratis abonnement og eventuelt data fra premium features vil blive slettet.'
        );
        if (confirmed)
            cancelSubscription(localStorage.getItem('apiKey'))
                .then(window.location.reload)
                .catch((err) => console.log(err));
    };

    const handleSave = () => {
        setEditing(false)
        setSaving(true)
        setSaveError('')
        updateProfile(profileSettings, localStorage.getItem('apiKey'))
            .then(() => {
                if (initProfileSettings.email.toLowerCase() !== profileSettings.email.toLowerCase()) {
                    setSaveInfo("Du har forsøgt at ændre din email, vi har sendt en besked til din gamle email for at bekræfte ændringen")
                }
            })
            .catch((err) => setSaveError(err.message))
            .finally(() => setSaving(false))
    }

    return (
        <Main
            title="Din Profil"
            CTAs={
                <>
                    { editing && (
                        <Button onClick={handleSave} className="my-2">
                            Gem
                        </Button>
                    ) }
                    { (!editing && !saving) && (
                        <>
                            { saveError && (
                                <Alert variant="danger">
                                    {saveError}
                                </Alert>
                            )}

                            { saveInfo && (
                                <Alert variant="info">
                                    {saveInfo}
                                </Alert>
                            ) }
                            <Button
                                title="Ændr i dine indstillinger"
                                onClick={() => setEditing(true)}
                                variant="outline-primary"
                            >
                                <EditIcon />
                            </Button>
                        </>
                        
                    ) }
                    
                    { (!editing && saving) && (
                        <Button className="my-2">
                            <Spinner variant="light" />
                        </Button>
                    ) }
                </>
            }
        >
            <Container className="w-full">
                <Row spacing="1rem" className="w-full">
                    <Col sm={5}>
                        <Row>
                            <Col className="full-underline text-lg" md={12}>
                                Personlig Information
                            </Col>

                            <Col className="mt-2" md={4}>
                                <Form.Group>
                                    <Form.Label slider={false} >Fornavn</Form.Label>
                                    <Form.Control
                                        onChange={(e) =>
                                            setProfileSettings({
                                                ...profileSettings,
                                                ...{
                                                    name: {
                                                        firstName:
                                                            e.target.value,
                                                        lastName:
                                                            profileSettings.name
                                                                .lastName,
                                                    },
                                                },
                                            })
                                        }
                                        readOnly={!editing}
                                        value={profileSettings.name.firstName}
                                    />
                                </Form.Group>
                            </Col>

                            <Col className="mt-2" md={8}>
                                <Form.Group>
                                    <Form.Label slider={false}>Efternavn</Form.Label>
                                    <Form.Control
                                        onChange={(e) =>
                                            setProfileSettings({
                                                ...profileSettings,
                                                ...{
                                                    name: {
                                                        firstName:
                                                            profileSettings.name
                                                                .firstName,
                                                        lastName:
                                                            e.target.value,
                                                    },
                                                },
                                            })
                                        }
                                        readOnly={!editing}
                                        value={profileSettings.name.lastName}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label slider={false}>E-Mail</Form.Label>
                                    <Form.Control
                                        onChange={(e) =>
                                            setProfileSettings({
                                                ...profileSettings,
                                                ...{
                                                    email: e.target.value,
                                                },
                                            })
                                        }
                                        readOnly={!editing}
                                        value={profileSettings.email}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label slider={false}>Telefonnummer</Form.Label>
                                    <Form.Control
                                        onChange={(e) =>
                                            setProfileSettings({
                                                ...profileSettings,
                                                ...{
                                                    phoneNumber: e.target.value,
                                                },
                                            })
                                        }
                                        type="tel"
                                        readOnly={!editing}
                                        value={profileSettings.phoneNumber}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                className="full-underline text-lg mt-4"
                                md={12}
                            >
                                Forretningsinformation
                            </Col>

                            <Col className="mt-2" md={12}>
                                <Form.Group>
                                    <Form.Label slider={false}>Navn</Form.Label>
                                    <Form.Control
                                        onChange={(e) =>
                                            setProfileSettings({
                                                ...profileSettings,
                                                ...{
                                                    businessInfo: {
                                                        name: e.target.value,
                                                        address:
                                                            profileSettings
                                                                .businessInfo
                                                                .address,
                                                    },
                                                },
                                            })
                                        }
                                        readOnly={!editing}
                                        value={
                                            profileSettings.businessInfo.name
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col className="mt-2" md={12}>
                                <Form.Group>
                                    <Form.Label slider={false}>Adresse</Form.Label>

                                    <Row>
                                        <Col md={7}>
                                            <Form.Group>
                                                <Form.Label slider={false}>By</Form.Label>
                                                <Form.Control
                                                    onChange={(e) =>
                                                        setProfileSettings({
                                                            ...profileSettings,
                                                            ...{
                                                                businessInfo: {
                                                                    name:
                                                                        profileSettings
                                                                            .businessInfo
                                                                            .name,
                                                                    address: {
                                                                        ...profileSettings
                                                                            .businessInfo
                                                                            .address,
                                                                        ...{
                                                                            city:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        })
                                                    }
                                                    readOnly={!editing}
                                                    value={
                                                        profileSettings
                                                            .businessInfo
                                                            .address.city
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={5}>
                                            <Form.Group>
                                                <Form.Label slider={false}>Postnummer</Form.Label>
                                                <Form.Control
                                                    onChange={(e) =>
                                                        setProfileSettings({
                                                            ...profileSettings,
                                                            ...{
                                                                businessInfo: {
                                                                    name:
                                                                        profileSettings
                                                                            .businessInfo
                                                                            .name,
                                                                    address: {
                                                                        ...profileSettings
                                                                            .businessInfo
                                                                            .address,
                                                                        ...{
                                                                            postcode:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        })
                                                    }
                                                    readOnly={!editing}
                                                    value={
                                                        profileSettings
                                                            .businessInfo
                                                            .address.postcode
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={9}>
                                            <Form.Group>
                                                <Form.Label slider={false}>Vej</Form.Label>
                                                <Form.Control
                                                    onChange={(e) =>
                                                        setProfileSettings({
                                                            ...profileSettings,
                                                            ...{
                                                                businessInfo: {
                                                                    name:
                                                                        profileSettings
                                                                            .businessInfo
                                                                            .name,
                                                                    address: {
                                                                        ...profileSettings
                                                                            .businessInfo
                                                                            .address,
                                                                        ...{
                                                                            street:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        })
                                                    }
                                                    readOnly={!editing}
                                                    value={
                                                        profileSettings
                                                            .businessInfo
                                                            .address.street
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label slider={false}>Nummer</Form.Label>
                                                <Form.Control
                                                    onChange={(e) =>
                                                        setProfileSettings({
                                                            ...profileSettings,
                                                            ...{
                                                                businessInfo: {
                                                                    name:
                                                                        profileSettings
                                                                            .businessInfo
                                                                            .name,
                                                                    address: {
                                                                        ...profileSettings
                                                                            .businessInfo
                                                                            .address,
                                                                        ...{
                                                                            number:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        })
                                                    }
                                                    readOnly={!editing}
                                                    value={
                                                        profileSettings
                                                            .businessInfo
                                                            .address.number
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={7}>
                        <Row>
                            <Col className="full-underline text-lg" md={12}>
                                Abonnementsinformation
                            </Col>

                            <Col md={12} className="mt-2">
                                <div>
                                    BOOKTID {currentProduct.name} Abonnement
                                </div>
                                <div className="text-sm">
                                    {initProfileSettings.maxNumberOfCalendars}{' '}
                                    &#215; {currentProduct.metadata.unit_name}
                                </div>

                                {user.subscriptionType !== 'free' && (
                                    <div className="text-sm text-muted mt-2">
                                        Sidste betaling var{' '}
                                        {new Intl.NumberFormat('da-DK', {
                                            style: 'currency',
                                            currency: 'DKK',
                                        }).format(
                                            initProfileSettings.lastMonthPaid /
                                                100
                                        )}
                                    </div>
                                )}

                                {!user.cancelAtPeriodEnd &&
                                    user.subscriptionType !== 'free' && (
                                        <div>
                                            <div className="text-sm text-muted">
                                                Næste betaling på{' '}
                                                {new Intl.NumberFormat(
                                                    'da-DK',
                                                    {
                                                        style: 'currency',
                                                        currency: 'DKK',
                                                    }
                                                ).format(
                                                    initProfileSettings.nextMonthPay /
                                                        100
                                                )}{' '}
                                                forfalder{' '}
                                                {dayjs(
                                                    initProfileSettings.currentPeriodEnd
                                                ).format('DD/MM/YYYY')}
                                            </div>
                                            <br />

                                            {!user.cancelAtPeriodEnd &&
                                                user.subscriptionType !==
                                                    'free' &&
                                                user.status === 'active' &&
                                                user.invoiceStatus ===
                                                    'paid' && (
                                                    <div className="text-sm font-semibold flex justify-start items-center">
                                                        <Button
                                                            disabled={
                                                                !productsReady
                                                            }
                                                            onClick={() =>
                                                                setChangingSubscription(
                                                                    !changingSubscription
                                                                )
                                                            }
                                                            size="sm"
                                                            variant="outline-danger"
                                                        >
                                                            Ændr din plan{' '}
                                                            {!changingSubscription ? (
                                                                <ArrowRightAltIcon className="ml-1" />
                                                            ) : (
                                                                <ArrowDownAltIcon className="ml-1" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}

                                            {changingSubscription &&
                                                products !== {} && (
                                                    <InlineUpgrade
                                                        hide={() =>
                                                            setChangingSubscription(
                                                                false
                                                            )
                                                        }
                                                        periodEnd={
                                                            user.currentPeriodEnd
                                                        }
                                                        salesPrice={
                                                            initProfileSettings.nextMonthPay
                                                        }
                                                        quantity={
                                                            initProfileSettings.maxNumberOfCalendars
                                                        }
                                                        currentProduct={
                                                            currentProduct.name ===
                                                            'Basic'
                                                                ? products.basic
                                                                : products.premium
                                                        }
                                                        products={products}
                                                    />
                                                )}

                                            <br />
                                            {!changingSubscription && (
                                                <div className="text-sm font-semibold flex justify-start items-center">
                                                    <Button
                                                        onClick={
                                                            handleSubscriptionCancellation
                                                        }
                                                        size="sm"
                                                        variant="outline-danger"
                                                    >
                                                        Opsig abonnement{' '}
                                                        <ArrowRightAltIcon className="ml-1" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="mt-2">
                                    {user.cancelAtPeriodEnd && (
                                        <Alert variant="danger">
                                            Du har opsagt dit abonnement
                                            gældende fra{' '}
                                            {dayjs(
                                                initProfileSettings.currentPeriodEnd
                                            ).format('DD/MM/YYYY')}
                                        </Alert>
                                    )}

                                    {user.cancelAtPeriodEnd && (
                                        <div className="w-full"></div>
                                    )}

                                    {user.subscriptionType === 'free' &&
                                        user.status === 'active' && (
                                            <div className="w-full flex justify-center items-center py-3">
                                                <Link href="/opgrader">
                                                    <a>
                                                        <Button>
                                                            {'Opgrader til premium'.toUpperCase()}
                                                        </Button>
                                                    </a>
                                                </Link>
                                            </div>
                                        )}

                                    {user.status !== 'active' &&
                                        user.invoiceStatus === 'open' &&
                                        user.subscriptionType !== 'free' && (
                                            <Alert variant="warning">
                                                Der skete en fejl med din
                                                betaling
                                                <Link href="/ny-betalingsmetode">
                                                    <a className="px-1 link">
                                                        klik her
                                                    </a>
                                                </Link>
                                                for at tilføje en ny
                                                betalingsmetode
                                            </Alert>
                                        )}

                                    {user.status !== 'active' &&
                                        user.invoiceStatus === 'open' &&
                                        user.subscriptionType === 'free' && (
                                            <div className="w-full">
                                                <Alert variant="warning">
                                                    Der skete en fejl med din
                                                    betaling da du forsøgte at
                                                    opgradere
                                                    <Link href="/ny-betalingsmetode">
                                                        <a className="px-1 link">
                                                            klik her
                                                        </a>
                                                    </Link>
                                                    for at tilføje en ny
                                                    betalingsmetode og fuldføre
                                                    opgraderingen
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
                                        )}
                                </div>
                            </Col>
                        </Row>

                        <Row></Row>
                    </Col>
                </Row>
            </Container>
        </Main>
    );
}

export async function getServerSideProps({ req }) {
    const apiKey = req.cookies.apiKey;
    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (isValid) {
        const profileSettings = await getProfileSettings(apiKey).catch((err) =>
            console.log(err)
        );

        const currentProduct =
            profileSettings.subscriptionType !== 'free'
                ? await getProduct(
                      profileSettings.subscriptionType,
                      apiKey
                  ).catch((err) => console.log(err))
                : {
                      name: 'Free',
                      unitName: 'Medarbejderkalender',
                      metadata: {
                          unit_name: 'Medarbejderkalender',
                      },
                  };

        return {
            props: {
                valid: Boolean(isValid),
                user: isValid,
                initProfileSettings: profileSettings,
                currentProduct,
            },
        };
    } else
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
}
