import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Alumnes from './alumnes'
import Inscripciones from './inscripciones'
import Talleres from './talleres'
import Movimientos from './movimientos'
import { get_alumnes } from '../lib/alumnes'
import { get_inscripciones } from '../lib/inscripciones'
import { get_movimientos } from '../lib/movimientos'
import { get_talleres } from '../lib/talleres'

const serialize = (obj: any[]) => JSON.parse(JSON.stringify(obj))
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

  return (
    <div className="container">
      <Head>
        <title>Aluperán</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <div className='flex flex-row w-screen'>
        <div className='textura p-5 flex flex-col px-8 text-rye'>
          <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina('alumnes')}>Alumnes</p>
          <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina('talleres')}>Talleres</p>
          <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina('inscripciones')}>Inscripciones</p>
          <p className='text-lg my-2 cursor-pointer' onClick={() => setPagina('movimientos')}>Movimientos</p>
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

