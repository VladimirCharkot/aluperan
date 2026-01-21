import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import Alumnes from '../components/alumnes'
import Inscripciones from '../components/inscripciones'
import Talleres from '../components/talleres'
import Movimientos from '../components/movimientos'
import { capitalize } from 'lodash';
import { LoginContext } from "../components/loginContext"
import Head from 'next/head'
import { useBackend } from '../components/context/backend'
import { ModalCambiarPass } from '../components/general/modales/modalCambiarPass'
import { Icon } from '@iconify/react'


export default function Home() {
  const [pagina, setPagina] = useState('talleres')
  const NavLink = ({ addr, icon} : any) => <p className='flex items-center text-lg my-2 cursor-pointer hover:underline gap-2' onClick={() => setPagina(addr)}>{icon}{capitalize(addr)}</p>

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
      <div className="invisible bg-gray-200 border-indigo-300"></div>
      <div className="container">
        {cambiandoPass && <ModalCambiarPass cerrar={() => setCambiandoPass(false)}/>}
        {!loggedIn && <p className='p-5'>No autorizado</p>}
        {loggedIn && !ready && <div className='flex flex-row w-screen h-screen align-center justify-center'><p>Cargando...</p></div>}
        {loggedIn && ready &&
          <div className='flex flex-row w-screen'>
            <div className='textura p-5 flex flex-col px-10 text-rye'>
              <NavLink addr='talleres' icon={<Icon icon={"ri:shapes-line"}/>}/>
              <NavLink addr='alumnes' icon={<Icon icon={"radix-icons:people"}/>} />
              {/* <NavLink addr='inscripciones' /> */}
              <NavLink addr='movimientos' icon={<Icon icon={"clarity:form-line"}/>} />
              <hr className='border-black my-5' />
              <p className='flex items-center gap-2 text-lg my-2 cursor-pointer hover:underline' onClick={() => setCambiandoPass(true)}> <Icon icon={"carbon:password"}/>Cambiar Contraseña</p>
              <p className='flex items-center gap-2 text-lg my-2 cursor-pointer hover:underline' onClick={logout}><Icon icon={"solar:logout-2-outline"}/>Salir</p>
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

