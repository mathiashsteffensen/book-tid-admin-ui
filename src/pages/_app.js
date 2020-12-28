import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {verifyApiKey} from '../requests'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/index.css'
import Footer from '../components/Footer'
import Header from '../components/Header/Header'

import Button from 'react-bootstrap/Button'

function MyApp({ Component, pageProps }) 
{
  if (pageProps.valid)
  {
    return (
      <div>
        {pageProps.user.subscriptionType === 'free' && (
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
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}

export default MyApp