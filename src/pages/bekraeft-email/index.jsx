import { useRouter } from 'next/router'
import Link from 'next/link'

import Main from '../../components/Main'
import AltHeader from '../../components/Header/AltHeader'
import Footer from '../../components/Footer'

import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

import { verifyApiKey, confirmEmail } from '../../requests';

import useAJAX from '../../hooks/useAJAX'

export default function ConfirmEmail({ user }) {

    const router = useRouter()

    const { data, loading, error } = useAJAX(confirmEmail, [router.query.key], {
        fakeTimeOut: 300
    }) 

    return (
        <>
            <AltHeader showBackLink={Boolean(user)} />
            <Main
                title="Bekræft E-Mail"
            >
                
                <div className="w-10/12 flex justify-center items-center">
                    { loading && <Spinner variant="primary" animation="border" /> }

                    { error && <Alert className="border-danger" variant="danger">{ error.message }</Alert> }

                    { (!loading && !error) && <Alert className="border-success" variant="success">
                        {data}
                        <br/>
                        {Boolean(user) ? <Link href="/kalender">
                            <a className="link">Tilbage til min kalender</a>
                        </Link> : <Link href="/login">
                            <a className="link">Login</a>
                        </Link>}
                    </Alert> }
                </div>

            </Main>

            <Footer />
        </> 
        
    )
} 

export async function getServerSideProps({ req }) {
    let apiKey = req.cookies.apiKey;

    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    return {
        props: {
            valid: false,
            user: isValid,
        },
    };
}