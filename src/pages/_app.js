import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {verifyApiKey} from '../requests'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/index.css'
import Footer from '../components/Footer'
import Header from '../components/Header/Header'

function MyApp({ Component, pageProps }) {

  let router = useRouter()
  const [user, setUser] = useState(false)

  let verifyAPIKey = async () =>
  {
    let currentPath = router.pathname

    let isValid = await verifyApiKey(localStorage.getItem('apiKey')).catch(() => false)
    if (!isValid) 
    {
      if (currentPath !== '/login' && currentPath !== '/opret-bruger')
      {
        router.push('/login')
        localStorage.removeItem('apiKey')
      } 
    }

    if (isValid)
    {
      setUser(isValid)
      if (currentPath === '/') router.push('/kalender')
      if (currentPath === '/login' || currentPath === '/opret-bruger') router.push('/kalender')
    }
  }

  useEffect(() =>
  {
    verifyAPIKey()
  }, [])

  if (user)
  {
    return (
      <div>
        <Header subscriptionType={user.subscriptionType} firstName={user.firstName} />
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
