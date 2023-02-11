import { useState } from 'react'
import Head from 'next/head'
import Alumnes from '../components/alumnes'
import Inscripciones from './inscripciones'
import Talleres from '../components/talleres'
import Movimientos from './movimientos'
import { capitalize } from 'lodash';
import { serialize } from '../lib/utils'
import { get_alumnes } from '../lib/alumnes'
import { get_inscripciones } from '../lib/inscripciones'
import { get_movimientos } from '../lib/movimientos'
import { get_talleres } from '../lib/talleres'


export async function getServerSideProps() {
  return {
    props: {
      alumnes: serialize(await get_alumnes()),
      inscripciones: serialize(await get_inscripciones()),
      movimientos: serialize(await get_movimientos()),
      talleres: serialize(await get_talleres())
    }
  }
}

export default function Home({ alumnes, inscripciones, talleres, movimientos }: any) {
  const [pagina, setPagina] = useState('alumnes')
  const NavLink = ({addr}: any) => <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina(addr)}>{capitalize(addr)}</p> 

  return (
    <div className="container">
      <Head>
        <title>Aluperán</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <div className='flex flex-row w-screen'>
        <div className='textura p-5 flex flex-col px-8 text-rye'>
          <NavLink addr='alumnes'/>
          <NavLink addr='talleres'/>
          <NavLink addr='inscripciones'/>
          <NavLink addr='movimientos'/>
          <div className='alupe w-full h-32 mt-auto'></div>
        </div>
        {pagina == 'alumnes' && <Alumnes alumnes={alumnes} />}
        {pagina == 'talleres' && <Talleres talleres={talleres} />}
        {pagina == 'inscripciones' && <Inscripciones inscripcion={inscripciones} />}
        {pagina == 'movimientos' && <Movimientos movimientos={movimientos} />}
      </div>
    </div>
  )
}

