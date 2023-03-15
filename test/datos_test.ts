import { Alumne, Taller, Movimiento, MovimientoInscripcion, InscripcionPost, TallerPost, AlumnePost, Inscripcion } from '../lib/api';
import { post_alumne } from '../lib/alumnes';
import { post_taller } from '../lib/talleres';
import { AlmacenMovimientos } from '../lib/movimientos';
import { random, range, sample, uniqBy } from 'lodash';
import { post_inscripcion } from '../lib/inscripciones';
import { eachMonthOfInterval } from 'date-fns';
import clientPromise from '../lib/mongodb';

const talleres: TallerPost[] = [{
  nombre: 'Aro',
  profe: 'Mechita',
  horarios: [{
    dia: 'lun',
    hora: '18:00hs'
  }, {
    dia: 'jue',
    hora: '10:30hs'
  }],
  precios: [1200, 3500, 5000],
  iniciado: new Date(2022, 8)
}, {
  nombre: 'Tela',
  profe: 'Maga',
  horarios: [{
    dia: 'lun',
    hora: '20:00hs'
  }, {
    dia: 'mie',
    hora: '20:00hs'
  }, {
    dia: 'lun',
    hora: '10:30hs'
  }, {
    dia: 'mie',
    hora: '10:30hs'
  }, {
    dia: 'vie',
    hora: '19:00hs'
  }],
  precios: [1400, 4000, 6000, 7500, 9000, 10000],
  iniciado: new Date(2022, 6)
}, {
  nombre: 'Plasticidad en movimiento',
  profe: 'Sofía Naike',
  horarios: [{
    dia: 'mie',
    hora: '17:00hs'
  }],
  precios: [1500, 4500],
  iniciado: new Date(2022, 9)
}, {
  nombre: 'Acro dúo',
  profe: 'Pan y guineo',
  horarios: [{
    dia: 'mie',
    hora: '16:30hs'
  }],
  precios: [1200, 3500],
  iniciado: new Date(2022, 8)
}, {
  nombre: 'Trapecio',
  profe: 'Indra Jazmin',
  horarios: [{
    dia: 'mar',
    hora: '20:00hs'
  }, {
    dia: 'jue',
    hora: '20:00hs'
  },{
    dia: 'sab',
    hora: '12:00hs'
  }],
  precios: [1400, 4000, 5000, 6000],
  iniciado: new Date(2022, 6)
}]

const alumnes: AlumnePost[] = [{
  nombre: 'Macarena Olivos',
  celular: '1122447563',
  email: 'mac.oli.91@gmail.com'
}, {
  nombre: 'Elías Marqueiro',
  celular: '1125279965'
}, {
  nombre: 'Juana Cervio',
  email: 'juanix.xerxe@gmail.com'
}, {
  nombre: 'Camilo Sanquio',
  celular: '1122412135'
}, {
  nombre: 'Esteban Ramirez',
  email: 'este.ramaram@hotmail.com'
}, {
  nombre: 'Antonia Silvera',
  celular: '1122566397',
  email: 'antoneta@yahoo.com.ar'
}, {
  nombre: 'Eliana Sacarías',
  celular: '1120235453'
}, {
  nombre: 'Abril Estevez',
  email: 'bri.brist@gmail.com'
}, {
  nombre: 'Carla Porta',
  email: 'erase.quesera@gmail.com',
  celular: '1144556678'
}, {
  nombre: 'Fernando Miguelete',
  email: 'ferma.92@gmail.com'
}]

const fecha_random = (desde: Date) => {
  return new Date(desde.getTime() + Math.random() * ((new Date()).getTime() - desde.getTime()));
}

const carga = async () => {
  const movimientos = new AlmacenMovimientos(await clientPromise);
  console.log('Insertando talleres...')
  const talleres_insertados = await Promise.all(talleres.map(post_taller))
  console.log(talleres_insertados)
  console.log('Insertando alumnes...')
  const alumnes_insertados = await Promise.all(alumnes.map(post_alumne))
  console.log(alumnes_insertados)

  const inscripciones_al_azar = range(20).map(() => {
    const alumne = sample(alumnes_insertados)!
    const taller = sample(talleres_insertados)!
    const fecha = fecha_random(taller.iniciado)
    return {
      alumne: alumne._id.toString(),
      taller: taller._id.toString(),
      dias: random(taller.horarios.length - 1) + 1,
      iniciada: fecha
    }
  })

  const inscripciones_a_insertar = uniqBy(inscripciones_al_azar, i => i.alumne + i.taller)

  console.log('Insertando inscripciones...')
  const inscripciones_insertadas = await Promise.all(inscripciones_a_insertar.map(async (insc) => {
    return await post_inscripcion(insc)
  }))
  console.log(inscripciones_insertadas)

  console.log('Insertando movimientos...')
  const movimientos_insertados = await Promise.all(inscripciones_insertadas.map(
    i => Promise.all(
      eachMonthOfInterval({ start: i.iniciada, end: new Date() }).map(d => {
        console.log(`Generando movimiento del ${d.toLocaleDateString('es-ES')} para inscripción iniciada el ${i.iniciada.toLocaleDateString('es-ES')}`)
        if (Math.random() < 0.9){
          const f = new Date(d.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
          return movimientos.insertarPagoInscripcion({
            monto: i.tarifas[0].monto!,
            medio: sample(['tarjeta', 'efectivo', 'mercadopago'])!,
            fecha: f, // una semana de rango
            razon: 'inscripcion',
            inscripcion: i._id.toString(),
            mes: f,
            detalle: ''
          })
        }
      }))
  ))

  return { movimientos_insertados, inscripciones_insertadas, talleres_insertados, alumnes_insertados }

}

carga().then(r => {
  console.log('Datos cargados!')
  console.log('Alumnes:')
  console.log(r.alumnes_insertados)
  console.log('Talleres:')
  console.log(r.talleres_insertados)
  console.log('Inscripciones:')
  console.log(r.inscripciones_insertadas)
  console.log('Movimientos:')
  console.log(r.movimientos_insertados)
  process.exit()
})