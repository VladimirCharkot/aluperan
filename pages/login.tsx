import React, { FormEventHandler, useContext, useEffect, useState } from 'react'
import { LoginContext } from '../components/loginContext'
import { Boton } from '../components/general/input/boton'

export default function Login() {

  const { setLoggedIn } = useContext(LoginContext)
  const [pass, setPass] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { console.log(`Login`) }, [])

  const handleSend: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    login()
  }

  const login = async () => {
    console.log(`Intentando Login password ${pass}`)

    const body = {
      password: pass
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
      <div className="login flex flex-col items-start justify-center h-screen bg-indigo-200">
        <form className='p-16 bg-white/50 border-2 border-indigo-500 rounded-xl items-center flex flex-col m-70' onSubmit={handleSend}>
          <h1 className='text-3xl text-indigo-500'>¡Bienvenide!</h1>
          <p className='m-6'>Ingresa con tu password</p>
          <input className="border-2 border-indigo-500 rounded bg-indigo-300 p-2 mb-6" type="password" name="password" onChange={e => setPass(e.target.value)}/>
          <Boton addons='bg-indigo-300 border-indigo-600' texto="Login" onClick={login} color="indigo" />
          <p className='text-red-400 p-2 text-sm'>{errorMsg}</p>
          <p className='text-emerald-400 p-2 text-sm'>{successMsg}</p>
        </form>
      </div>
      <style jsx>{`
        .login{
          background-image: url(/alupe2.png);
          background-size: 50%;
          background-repeat: no-repeat;
          background-blend-mode: overlay;
          background-position: bottom right;
        }
      `} </style>
    </>
  )
}
