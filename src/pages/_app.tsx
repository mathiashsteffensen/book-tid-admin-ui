import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import Head from "next/head"
import { Provider } from "react-redux"

import "src/styles/sass/index.scss"
import "src/styles/index.css"
import { ReduxModalStack, ReduxToastStack } from "src/components/custom"
import { QueryContextProvider } from "src/hooks"
import { State, useStore } from "src/redux/store"

const theme = createTheme({
    palette: {
        mode: "dark",
        common: {
            black: "#111113",
            white: "#EEEEF0",
        },
        background: {
            default: "#0C111C",
            paper: "#19191B",
        },
        grey: {
            50: "#EEEEF0",
            100: "#B2B3BD",
            200: "#797B86",
            300: "#6C6E79",
            400: "#5F606A",
            500: "#393A40",
            600: "#303136",
            700: "#222325",
            800: "#19191B",
            900: "#111113",
            A100: "#F9F9FB",
            A200: "#EFF0F3",
            A400: "#E0E1E6",
            A700: "#80828D",
        },
        primary: {
            50: "#D5E2FF",
            100: "#93B4FF",
            200: "#3F5CB0",
            300: "#405EB2",
            400: "#3D63DD",
            500: "#375098",
            600: "#243974",
            700: "#172448",
            800: "#111725",
            900: "#0C111C",
            A100: "#395BC7",
            A200: "#3657C3",
            A400: "#87A5EF",
            A700: "#EDF2FE",
        },
        error: {
            50: "#fed2e1",
            100: "#ff949d",
            500: "#ec5a72",
            200: "#b3445a",
            300: "#883447",
            400: "#6f2539",
            600: "#5e1a2e",
            700: "#3a141e",
            800: "#1e1517",
            900: "#191113",
            A100: "#5e1a2e",
            A200: "#883447",
            A400: "#ec5a72",
            A700: "#fed2e1",
        },
    },
})

const initialState: State = {
    modal: {
        stack: [],
    },
    toast: {
        stack: [],
    },
}

const App = ({ Component, pageProps, ...props }) => {
    const reduxStore = useStore(initialState)

    return (
        <>
            <AppCacheProvider {...props}>
                <Head>
                    <title>BOOKTID.NET | Admin</title>
                    <meta
                        name="description"
                        content="Administration for BOOKTID.NET brugere"
                    ></meta>
                </Head>
                <ThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme />

                    <style>
                        {`
                            body {
                                color: ${theme.palette.common.white};
                                background: ${theme.palette.primary[800]};
                                background: linear-gradient(
                                    170deg, ${theme.palette.primary[800]} 0%,
                                    ${theme.palette.primary[900]} 20%,
                                    ${theme.palette.common.black} 70%
                                );
                            }
                        `}
                    </style>
                    <Provider store={reduxStore}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <QueryContextProvider>
                                <Component {...pageProps} />

                                <ReduxModalStack />
                                <ReduxToastStack />
                            </QueryContextProvider>
                        </LocalizationProvider>
                    </Provider>
                </ThemeProvider>
            </AppCacheProvider>
        </>
    )
}

export default App
