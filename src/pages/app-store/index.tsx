import React, { useState } from 'react'
import Link from 'next/link';

import { App } from '../../GlobalTypes'

import { FlexContainer } from '../../components/agnostic/FlexContainer'
import { Alert } from '../../components/agnostic/Alert'
import { Row } from '../../components/agnostic/Row';
import { Col } from '../../components/agnostic/Col';

import { AppCard } from '../../components/custom/AppCard'
import { AppSettings } from '../../components/custom/AppSettings'

import { verifyApiKey } from '../../requests';

import jsonAppList from '../../assets/app-list.json'


export default function AppStore( { user } ) {
    const appList: Array<App> = jsonAppList.map((app) => ({
        ...app,
        ...{
            activated: user.activatedApps.includes(app.id)
        }
    }))

    const [showAppSettings, setShowAppSettings] = useState(false)

    const [appToShow, setAppToShow] = useState(appList[0])

    const handleShowAppSettings = (app: App) => {
        setAppToShow(app)
        setShowAppSettings(true)
    }
    
    return (
        <div>
            <Alert className="sm:px-12 text-xl" style={{margin: 0, borderRadius: 0}} variant="success">Apps til BOOKTID.NET</Alert>
            { user.subscriptionTypeName !== 'Premium' && <FlexContainer>
                <Alert variant="warning" >
                    <Link href="/opgrader"><a className="link">Opgrader til premium</a></Link> for at gøre brug af BOOKTID.NETs apps        
                </Alert>
            </FlexContainer>}
            <FlexContainer>
                { !showAppSettings ? <Row className=" px-6 w-full sm:w-11/12">
                    {appList.map((app) => (
                        <Col key={app.name} md={4}>
                            <AppCard disabled={user.subscriptionTypeName !== 'Premium'} showSettings={handleShowAppSettings} isActive={app.activated} app={app} />
                        </Col> 
                    ))}
                </Row> : (
                    <AppSettings back={() => setShowAppSettings(false)} app={appToShow} />
                )}
            </FlexContainer>
        </div>
    )
}

export async function getServerSideProps({ req }) {
    let apiKey = req.cookies.apiKey;

    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (isValid) {
        return {
            props: {
                valid: Boolean(isValid),
                user: isValid,
                apiKey,
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