import { useContext, useEffect, useState } from 'react'
import Alumnes from '../components/alumnes'
import Inscripciones from '../components/inscripciones'
import Talleres from '../components/talleres'
import Movimientos from '../components/movimientos'
import { capitalize } from 'lodash';
import { LoginContext } from "../components/loginContext"
import Head from 'next/head'
import { useBackend } from '../components/context/backend'


export default function Home() {
  const [pagina, setPagina] = useState('alumnes')
  const NavLink = ({ addr }: any) => <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina(addr)}>{capitalize(addr)}</p>

  const { traerAlumnes, traerInscripciones, traerMovimientos, traerTalleres } = useBackend()

  useEffect(() => {
    traerAlumnes()
    traerInscripciones()
    traerMovimientos()
    traerTalleres()
  }, [])

  const { loggedIn, setLoggedIn } = useContext(LoginContext)
  useEffect(() => { console.log(`Login es: ${loggedIn}`) }, [])
  
  const logout = async () => {
    console.log(`Logout`)
    await fetch('/api/logout', { method: 'POST' })
    setLoggedIn(false)
  }

  return (
    <>
      <Head>
        <title>Aluperán</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <div className="invisible bg-gray-200 bg-indigo-200 bg-indigo-300 border-indigo-300 border-indigo-400 border-indigo-600  bg-red-200 border-red-300 border-red-400 bg-emerald-200 border-emerald-300 border-emerald-400"></div>
      <div className="container">

        {!loggedIn && <p className='p-5'>No autorizado</p>}
        {loggedIn &&
          <div className='flex flex-row w-screen'>
            <div className='textura p-5 flex flex-col px-8 text-rye'>
              <NavLink addr='alumnes' />
              <NavLink addr='talleres' />
              <NavLink addr='inscripciones' />
              <NavLink addr='movimientos' />
              <div className='alupe w-full h-32 mt-auto cursor-pointer' onClick={logout} />
            </div>
            {pagina == 'alumnes' && <Alumnes />}
            {pagina == 'talleres' && <Talleres />}
            {pagina == 'inscripciones' && <Inscripciones />}
            {pagina == 'movimientos' && <Movimientos />}
          </div>
        }
      </div>
      </>
  )


}

