import React from 'react'

import Main from '../../components/custom/Main'

import { verifyApiKey } from '../../requests'

export default function FAQ() {
    return (
        <Main
            title="Ofte stillede spørgsmål"
        >

            <div className="w-full flex justify-center items-center flex-col text-sm">
                <p>Kan du ikke finde svar? Kontakt os via mail på <a className="link" href="mailto:service@booktid.net">service@booktid.net</a> og vi vil vende tilbage hurtigst muligt.</p>
                <p>(Vi svarer typisk inden for 24 timer)</p>
            </div>

        </Main>
    )
}

export async function getServerSideProps({ req }) {
    let apiKey = req.cookies.apiKey;

    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (isValid) {

        return {
            props: {
                valid: Boolean(isValid),
                user: isValid
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