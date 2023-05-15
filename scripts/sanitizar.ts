import * as dotenv from 'dotenv'
import { filter, find, groupBy, flow, toPairs, fromPairs, capitalize, sortBy } from 'lodash/fp'
dotenv.config({path: '.env.local'})

import { nombres_meses } from '../lib/utils'
import { AlmacenMovimientos } from '../lib/db/movimientos'
import { AlmacenAlumnes } from '../lib/db/alumnes'
import { AlumneMongo, MovimientoInscripcionMongo, MovimientoMongo, TallerMongo } from '../lib/api'
import { AlmacenTalleres } from '../lib/db/talleres'

const encontrarPagosInscripcionesDuplicados = async () => {

  const alums = (await (await AlmacenAlumnes.build()).getAll()) as AlumneMongo[]
  const talls = (await (await AlmacenTalleres.build()).getAll()) as TallerMongo[]
  const movis = (await (await AlmacenMovimientos.build()).getAll()) as MovimientoMongo[]

  const filtInscripciones = filter((m: MovimientoMongo) => m.razon == "inscripcion")
  const getAlumne = (id: string) => find((a: AlumneMongo) => a._id.toString() == id)(alums)
  const getTaller = (id: string) => find((a: TallerMongo) => a._id.toString() == id)(talls)
  const grpMesAlumTaller = groupBy((m: MovimientoInscripcionMongo) => `${capitalize(nombres_meses[new Date(m.mes).getMonth()])} ${getAlumne(m.alumne.toString())?.nombre} ${getTaller(m.taller.toString())?.nombre}`)
  const planchar = (d: Record<string, MovimientoInscripcionMongo[]>) => fromPairs((toPairs(d).map(([k, ps]) => [k, ps.map(p => `${p._id.toString()}`)])))
  const ordenar = (d: Record<string, string[]>) => fromPairs(sortBy(([k, v]: [string, string[]][]) => k)(toPairs(d)))
  
  return flow([filtInscripciones, grpMesAlumTaller, planchar, ordenar])(movis)
}

encontrarPagosInscripcionesDuplicados().then(console.log)
