// Agrega alumne y taller a todos los movimientos que tengan por razon "inscripcion"

import * as dotenv from 'dotenv'
dotenv.config({path: '.env.local'})

import { AlmacenMovimientos } from "../lib/db/movimientos";
import { AlmacenInscripciones } from "../lib/db/inscripciones";

const rectificar = async () => {
  const almacenMovimientos = await AlmacenMovimientos.build()
  const almacenInscripciones = await AlmacenInscripciones.build()

  console.log(`Trayendo movimientos...`)
  const movis = await almacenMovimientos.getAll()

  console.log(`Populando info...`)
  const updates_inscripciones = await Promise.all(movis.filter(m => m.razon == 'inscripcion').map(async m => {
    const insc = await almacenInscripciones.getOne({ _id: m.inscripcion })
    return { ...m, alumne: insc.alumne, taller: insc.taller }
  }))

  console.log(`Aplicando updates...`)
  await Promise.all(updates_inscripciones.map(upd => almacenMovimientos.update({ ...upd, _id: upd._id.toString() })))

}

// config({ path: '.env.local' })

console.log(`Conectando a ${process.env.DB_NAME}`)
rectificar().then(() => {
  console.log(`Listo! c:`)
  process.exit()
})

