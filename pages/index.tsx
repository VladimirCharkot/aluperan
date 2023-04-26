import Head from "next/head"
import Login from "./login"
import { LoginContext } from "../components/loginContext"
import { AppContext } from "../components/context"
import { useContext, useEffect, useState } from "react"
import Home from './home'
import { Alumne, Asistencia, Inscripcion, Movimiento, Taller } from "../lib/api"

const Index = () => {

  const [alumnes, setAlumnes] = useState<Alumne[]>([])
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [talleres, setTalleres] = useState<Taller[]>([])
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const appCtx = {
    alumnes, setAlumnes,
    inscripciones, setInscripciones,
    talleres, setTalleres,
    movimientos, setMovimientos,
    asistencias, setAsistencias
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
      {/* {loggedIn && <p className="flex align-center justify-center">Bienvenide c:</p>} */}
      {loggedIn && <Home />}
      {!loggedIn && <Login />}
    </AppContext.Provider>
  </LoginContext.Provider>

}

export default Index