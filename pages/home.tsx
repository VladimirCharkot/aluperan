import { useContext, useEffect, useState } from 'react'
import Alumnes from '../components/alumnes'
import Inscripciones from '../components/inscripciones'
import Talleres from '../components/talleres'
import Movimientos from '../components/movimientos'
import { capitalize } from 'lodash';
import { LoginContext } from "../components/loginContext"
import Head from 'next/head'
import { useBackend } from '../components/context/backend'
import { ModalCambiarPass } from '../components/general/modales/modalCambiarPass'


export default function Home() {
  const [pagina, setPagina] = useState('talleres')
  const NavLink = ({ addr }: any) => <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina(addr)}>{capitalize(addr)}</p>

  const { pullBackend, ready } = useBackend()
  const [cambiandoPass, setCambiandoPass] = useState(false)

  // Traer datos del backend
  useEffect(() => { pullBackend() }, [])

  const { loggedIn, setLoggedIn } = useContext(LoginContext)
  
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
        {cambiandoPass && <ModalCambiarPass cerrar={() => setCambiandoPass(false)}/>}
        {!loggedIn && <p className='p-5'>No autorizado</p>}
        {loggedIn && !ready && <div className='flex flex-row w-screen h-screen align-center justify-center'><p>Cargando...</p></div>}
        {loggedIn && ready &&
          <div className='flex flex-row w-screen'>
            <div className='textura p-5 flex flex-col px-8 text-rye'>
              <NavLink addr='talleres' />
              <NavLink addr='alumnes' />
              {/* <NavLink addr='inscripciones' /> */}
              <NavLink addr='movimientos' />
              <hr className='border-black my-5' />
              <p className='text-lg my-2 cursor-pointer' onClick={() => setCambiandoPass(true)}>Cambiar Pass</p>
              <p className='text-lg my-2 cursor-pointer' onClick={logout}>Salir</p>
              <div className='alupe w-full h-32 mt-auto cursor-pointer'/>
            </div>
            {ready && pagina == 'alumnes' && <Alumnes />}
            {ready && pagina == 'talleres' && <Talleres />}
            {/* {ready && pagina == 'inscripciones' && <Inscripciones />} */}
            {ready && pagina == 'movimientos' && <Movimientos />}
          </div>
        }
      </div>
      </>
  )


}

