import React ,{useState} from 'react'
import Link from 'next/link'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import {login} from '../../requests'

export default function Login()
{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    let handleLogin = (e) =>
    {
        e.preventDefault()
        login(email, password).catch((err) => setMessage(err))
    }
    
    return (
        <main className="w-screen h-screen bg-opaque flex justify-center items-center">
            <form className="px-12 py-8 bg-gray-200 rounded-lg shadow-lg">
                <div className="w-full flex justify-center items-center flex-col">
                    <h3 className="text-2xl font-medium pb-8">Log ind</h3>

                    <TextField value={email} margin="normal" className="w-full" onChange={(e) => setEmail(e.target.value)} color="primary" id="outlined-basic" label="E-Mail" type="email" required variant="outlined"/>
                    
                    <TextField value={password} margin="normal" className="w-full" onChange={(e) => setPassword(e.target.value)} color="primary" id="outlined-basic" label="Kodeord" type="password" required variant="outlined"/>

                    <Button margin="normal" variant="contained" color="primary" onClick={handleLogin}>
                        Log Ind
                    </Button>
                    {message !== '' ? <p style={{color: 'red', fontSize: '12px', marginBottom: 0, marginTop: '0.5rem'}}>{message}</p> : null}
                    <Link href="/opret-bruger"><a>Har du ikke en bruger? <span className="hover:text-purple-700 text-blue-700 underline">Opret dig her</span></a></Link>
                </div>
            </form>
        </main>
        
    )
}