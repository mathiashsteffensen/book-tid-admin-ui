import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {verifyApiKey} from '../requests'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/index.css'
import Footer from '../components/Footer'
import Header from '../components/Header/Header'

function MyApp({ Component, pageProps }) 
{
  if (pageProps.valid)
  {
    return (
      <div>
        <Header />
        <Component {...pageProps} />

      </div>
    )
  }

  return (
    <div>
      <Component {...pageProps} />

    </div>
  )
}

export default MyApp