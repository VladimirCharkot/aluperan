import Head from "next/head"
import { useState } from "react"
import { Toaster } from "sonner"
import { AppContext } from "../components/context"
import { LoginContext } from "../components/loginContext"
import { Alumne, Asistencia, Inscripcion, Movimiento, Taller } from "../lib/api"
import Home from './home'
import Login from "./login"

const Index = () => {

  const [alumnes, setAlumnes] = useState<Alumne[]>([])
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [talleres, setTalleres] = useState<Taller[]>([])
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [endpointsLoaded, setEndpointsLoaded] = useState<string[]>([])
  const [ready, setReady] = useState<boolean>(false)
  const appCtx = {
    alumnes, setAlumnes,
    inscripciones, setInscripciones,
    talleres, setTalleres,
    movimientos, setMovimientos,
    asistencias, setAsistencias,
    ready, setReady, endpointsLoaded, setEndpointsLoaded
  }


  const [loggedIn, setLoggedIn] = useState(false);

  const loginCtx = { loggedIn, setLoggedIn }

  // useEffect(() => { if(loggedIn) router.push('/home')}, [loggedIn])

  return <LoginContext.Provider value={loginCtx}>
    <AppContext.Provider value={appCtx}>
      <Head>
        <title>Aluperán</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <Toaster duration={10000}/>
      {loggedIn && <Home />}
      {!loggedIn && <Login />}
    </AppContext.Provider>
  </LoginContext.Provider>

}

export default Index