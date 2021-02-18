import React from 'react'

import { App } from '../../GlobalTypes'

import { FlexContainer } from '../../components/agnostic/FlexContainer'
import { Alert } from '../../components/agnostic/Alert'
import { Row } from '../../components/agnostic/Row';
import { Col } from '../../components/agnostic/Col';

import { AppCard } from '../../components/custom/AppCard'

import { verifyApiKey } from '../../requests';

import jsonAppList from '../../assets/app-list.json'



export default function AppStore( { user } ) {
    const appList: Array<App> = jsonAppList.map((app) => ({
        ...app,
        ...{
            activated: user.activatedApps.includes(app.id)
        }
    }))

    console.log(appList[0]);
    
    return (
        <div>
            <Alert className="sm:px-12" style={{margin: 0, borderRadius: 0}} variant="success">Apps til BOOKTID.NET</Alert>
            <FlexContainer>
                <Row className=" px-6 w-full sm:w-11/12">
                    {appList.map((app) => (
                        <Col key={app.name} md={4}>
                            <AppCard isActive={app.activated} app={app} />
                        </Col> 
                    ))}
                </Row>
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