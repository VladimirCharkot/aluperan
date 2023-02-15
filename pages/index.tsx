import { useContext, useState } from 'react'
import Head from 'next/head'
import Alumnes from '../components/alumnes'
import Inscripciones from '../components/inscripciones'
import Talleres from '../components/talleres'
import Movimientos from '../components/movimientos'
import { capitalize } from 'lodash';
import { serialize } from '../lib/utils'
import { get_alumnes } from '../lib/alumnes'
import { get_inscripciones } from '../lib/inscripciones'
import { AlmacenMovimientos } from '../lib/movimientos'
import { get_talleres } from '../lib/talleres'
import { Alumne, Inscripcion, Movimiento, Taller } from '../lib/api'
import { AppContext } from '../components/context'

export async function getServerSideProps() {
  const movimientos = await AlmacenMovimientos.build()
  return {
    props: {
      alums: serialize(await get_alumnes()),
      inscs: serialize(await get_inscripciones()),
      movs: serialize(await movimientos.get()),
      talls: serialize(await get_talleres())
    }
  }
}

export default function Home({ alums, inscs, talls, movs }: any) {
  const [pagina, setPagina] = useState('alumnes')
  const NavLink = ({ addr }: any) => <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina(addr)}>{capitalize(addr)}</p>

  const [alumnes, setAlumnes] = useState<Alumne[]>(alums)
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>(inscs)
  const [talleres, setTalleres] = useState<Taller[]>(talls)
  const [movimientos, setMovimientos] = useState<Movimiento[]>(movs)

  const ctx = {
    alumnes, setAlumnes,
    inscripciones, setInscripciones,
    talleres, setTalleres,
    movimientos, setMovimientos
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="container">
        <Head>
          <title>Aluperán</title>
          <link rel="icon" href="/favicon.png" />
          <link rel="stylesheet" href="/style.css" />
        </Head>
        <div className='flex flex-row w-screen'>
          <div className='textura p-5 flex flex-col px-8 text-rye'>
            <NavLink addr='alumnes' />
            <NavLink addr='talleres' />
            <NavLink addr='inscripciones' />
            <NavLink addr='movimientos' />
            <div className='alupe w-full h-32 mt-auto'></div>
          </div>
          {pagina == 'alumnes' && <Alumnes alumnes={alumnes} />}
          {pagina == 'talleres' && <Talleres talleres={talleres} />}
          {pagina == 'inscripciones' && <Inscripciones inscripcion={inscripciones} />}
          {pagina == 'movimientos' && <Movimientos movimientos={movimientos} />}
        </div>
      </div>
    </AppContext.Provider>
  )
}

