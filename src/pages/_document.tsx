import {
    DocumentHeadTags,
    documentGetInitialProps,
    DocumentHeadTagsProps,
} from "@mui/material-nextjs/v15-pagesRouter"
import { Html, Head, Main, NextScript } from "next/document"

const Document = (props: DocumentHeadTagsProps) => (
    <Html lang="da">
        <Head>
            <link rel="preconnect" href="https://api.booktid.net" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />

            <link rel="dns-prefetch" href="https://api.booktid.net" />
            <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />

            <link rel="icon" href="icons/calendar/16x16.png" />

            <DocumentHeadTags {...props} />
        </Head>
        <body className="min-h-screen">
            <Main />
            <NextScript />
        </body>
    </Html>
)

export default Document

export const getInitialProps = documentGetInitialProps
