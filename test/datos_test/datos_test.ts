import { TallerPost, AlumnePost, Inscripcion, AsistenciaPost, Taller, Alumne, MovimientoInscripcion, MovimientoGenerico, MovimientoLiquidacionProfe, MovimientoClaseSuelta } from '../../lib/api';
import { AlmacenMovimientos } from '../../lib/db/movimientos';
import { AlmacenTalleres } from '../../lib/db/talleres';
import { AlmacenAlumnes } from '../../lib/db/alumnes';
import { AlmacenInscripciones } from '../../lib/db/inscripciones';
import { AlmacenAsistencias } from '../../lib/db/asistencias';
import { find, flatten, fromPairs, random, range, sample, sampleSize, toPairs, uniqBy, values } from 'lodash';
import { addDays, eachDayOfInterval, eachMonthOfInterval, isSameMonth, startOfMonth } from 'date-fns';
import clientPromise from '../../lib/db/mongodb';
import { dias_ids, medios_de_pago } from '../../lib/utils';
import * as mock from './mock';
import { createDecipheriv } from 'crypto';

// Fecha random entre desde y ahora
// const fecha_random = (desde: Date) => {
//   return new Date(desde.getTime() + Math.random() * ((new Date()).getTime() - desde.getTime()));
// }

type AlumId = string
type InscId = string

const carga = async () => {
  const client = await clientPromise

  client.db('aluperan_test').collection('alumnes').drop()
  client.db('aluperan_test').collection('asistencias').drop()
  client.db('aluperan_test').collection('inscripciones').drop()
  client.db('aluperan_test').collection('movimientos').drop()
  client.db('aluperan_test').collection('talleres').drop()

  const movimientos = new AlmacenMovimientos();
  const talleres = new AlmacenTalleres();
  const alumnes = new AlmacenAlumnes();
  const inscripciones = new AlmacenInscripciones();
  const asistencias = new AlmacenAsistencias();


  console.log("===================================")
  console.log('Insertando talleres...')
  const talleres_insertados = await Promise.all(mock.talleres.map(talleres.create)) as Taller[]
  console.log(talleres_insertados)


  console.log("===================================")
  console.log('Insertando alumnes...')
  const alumnes_insertados = await Promise.all(mock.alumnes.map(alumnes.create)) as Alumne[]
  console.log(alumnes_insertados)


  console.log("===================================")
  console.log('Creando inscripciones...')
  const inscripciones_insertadas = fromPairs(await Promise.all(alumnes_insertados.map(async a => {
    const talleres_a_inscriibir_alumne = sampleSize(talleres_insertados, random(mock.inscripcionesPorAlum))
    const inscripciones_alumne = await Promise.all(talleres_a_inscriibir_alumne.map(t => inscripciones.create({
      alumne: a._id,
      taller: t._id,
      horarios: sampleSize(t.horarios, t.horarios.length),
      iniciada: sample(eachDayOfInterval({ start: t.iniciado, end: new Date() }))
    }))) as Inscripcion[]
    return [a._id, inscripciones_alumne]
  }))) as Record<AlumId, Inscripcion[]>
  console.log(inscripciones_insertadas)


  console.log("===================================")
  console.log('Creando pagos de inscripciones...')
  const pagos_inscripciones_insertados = fromPairs(await Promise.all(toPairs(inscripciones_insertadas).map(async ([id_alumne, inscripciones_alumne]) => {
    const pagos_alumne = fromPairs(await Promise.all(inscripciones_alumne.map(i => [i._id, pagarHistoricoInscripcion(i)]))) as Record<string, MovimientoInscripcion[]>
    return [id_alumne, pagos_alumne]
  }))) as Record<AlumId, Record<InscId, MovimientoInscripcion[]>>
  
  const pagarHistoricoInscripcion = async (i: Inscripcion) => {
    return await Promise.all( eachMonthOfInterval({ start: i.iniciada, end: new Date() }).map(mes => pagarInscripcion(i, mes))) as MovimientoInscripcion[]
  }
  
  const pagarInscripcion = async (i: Inscripcion, mes: Date) => {
    if (Math.random() < 0.05) return null
    const t = find(talleres_insertados, t => t._id == i.taller)!
    const f = startOfMonth(mes)
    return await movimientos.create({
      razon: 'inscripcion',
      inscripcion: i._id,
      mes: f,
      monto: t.precios[i.horarios.length + 1],
      medio: sample(medios_de_pago)!,
      fecha: addDays(f, random(1, 10))
    }) as MovimientoInscripcion
  }
  console.log(pagos_inscripciones_insertados)


  console.log("===================================") 
  console.log('Creando pagos de clases sueltas...') 
  const pagos_sueltas_insertados = await Promise.all(range(20).map(async () => {
    const alum = sample(alumnes_insertados)!
    const taller = sample(talleres_insertados)!
    const ocasion = sample(eachDayOfInterval({start: taller.iniciado, end: new Date()}))!
    return pagarSuelta(taller, alum, ocasion)
  }))
  
  const pagarSuelta = async (t: Taller, a: Alumne, ocasion: Date) => {
    if (Math.random() < 0.05) return null
    return await movimientos.create({
      razon: 'clase suelta',
      taller: t._id,
      alumne: a._id,
      ocasion: ocasion,
      monto: t.precios[0],
      medio: sample(medios_de_pago)!,
      fecha: ocasion
    }) as MovimientoClaseSuelta
  }
  console.log(pagos_sueltas_insertados)


  console.log("===================================") 
  console.log('Creando liquidaciones...')
  const liquidarTallerEntero = (t: Taller) => {
    return Promise.all(eachMonthOfInterval({start: t.iniciado, end: new Date()}).map(mes => liquidarTallerMes(t, mes)))
  }
  const liquidarTallerMes = (t: Taller, mes: Date) => {
    const pagos_inscripciones_mes = flatten(flatten(values(pagos_inscripciones_insertados).map((d => values(d))))).filter(p => p.taller == t._id && isSameMonth(mes, p.mes))
    const pagos_sueltas_mes = pagos_sueltas_insertados.filter(p => p !== null) as MovimientoClaseSuelta[]
    const monto_inscripciones = pagos_inscripciones_mes.reduce((total, p) => total + p.monto, 0)
    const monto_sueltas = pagos_sueltas_mes.reduce((total, p) => total + p.monto, 0)
    return movimientos.create({
      razon: 'liquidacion profe',
      taller: t._id,
      monto: (monto_inscripciones + monto_sueltas) * 0.6,
      medio: sample(medios_de_pago)!,
      fecha: addDays(mes, random(1,10)),
      mes: mes
    }) as Promise<MovimientoLiquidacionProfe>
  }
  const liquidaciones_insertadas = Promise.all(talleres_insertados.map(liquidarTallerEntero))
  console.log(liquidaciones_insertadas)
  
  

  console.log("===================================") 
  console.log('Creando gastos...')  
  const crearGasto = async () => {
    return await movimientos.create({
      razon: 'otra',
      monto: random(1, 100) * 100,  // Entre $100 y $10000
      medio: sample(medios_de_pago)!,
      fecha: sample(eachDayOfInterval({start: mock.apertura, end: new Date()}))!,
      detalle: sample(mock.motivosDeGasto)!
    }) as MovimientoGenerico
  }
  const gastos_insertados = await Promise.all(range(20).map(crearGasto)) 
  console.log(gastos_insertados)



  console.log("===================================")
  console.log('Insertando asistencias...')

  const asistencias_insertadas = flatten(values(inscripciones_insertadas)).map(i => {

    const t = find(talleres_insertados, t => t._id == i.taller)!

    eachDayOfInterval({ start: i.iniciada, end: new Date() }).map(d => {

      const diaSemana = dias_ids[d.getDay()]
      const h = find(t.horarios, h => h.dia == diaSemana)

      if (h && Math.random() < 0.9) {
        asistencias.create({
          alumne: i.alumne,
          taller: i.taller,
          fecha: d,
          horario: h.hora
        })
      }

    })

  }).filter(a => a !== undefined)


  return { inscripciones_insertadas, talleres_insertados, alumnes_insertados, asistencias_insertadas, pagos_inscripciones_insertados, pagos_sueltas_insertados, liquidaciones_insertadas, gastos_insertados }

}

carga().then(r => {
  console.log('Datos cargados!')
  console.log('Alumnes:')
  console.log(r.alumnes_insertados)
  console.log('Talleres:')
  console.log(r.talleres_insertados)
  console.log('Inscripciones:')
  console.log(r.inscripciones_insertadas)
  console.log('Pagos inscripciones:')
  console.log(r.pagos_inscripciones_insertados)
  console.log('Pagos sueltas:')
  console.log(r.pagos_sueltas_insertados)
  console.log('Liquidaciones:')
  console.log(r.liquidaciones_insertadas)
  console.log('Asistencias:')
  console.log(r.asistencias_insertadas)
  process.exit()
})