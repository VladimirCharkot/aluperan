import React, { FormEventHandler, useContext, useEffect, useState } from 'react'
import { LoginContext } from '../components/loginContext'

export default function Login() {

  const { setLoggedIn } = useContext(LoginContext)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { console.log(`Login`) }, [])

  const handleSend: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    console.log(`Intentando Login password ${e.currentTarget.password.value}`)

    const body = {
      password: e.currentTarget.password.value,
    }

    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const { isLoggedIn } = await r.json()

      setLoggedIn(isLoggedIn)

      if (!isLoggedIn) setErrorMsg('Contraseña incorrecta')
      if (isLoggedIn) setSuccessMsg('Bienvenide! c:')

    }catch(e){
      setLoggedIn(false)
      setErrorMsg((e as Error).message)
    }

  }

  return (
    <>

      <div className="login flex items-center justify-center h-screen bg-indigo-200">
        <form onSubmit={handleSend}>
          <input className="border p-2" type="password" name="password" />
          <p className='text-red-400 p-2 text-sm'>{errorMsg}</p>
          <p className='text-emerald-400 p-2 text-sm'>{successMsg}</p>
        </form>
      </div>
      <style jsx>{`
        .login{
          background-image: url(/alupe.png);
          background-size: 50%;
          background-repeat: no-repeat;
          background-blend-mode: overlay;
          background-position: bottom right;
        }
      `} </style>
    </>
  )
}
