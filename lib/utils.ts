import {  endOfMonth, getDaysInMonth, isAfter, isBefore, isEqual, isFriday, isMonday, isSaturday, isSunday, isThursday, isTuesday, isWednesday, set, startOfMonth } from 'date-fns';
import { capitalize, flatten, range, some } from 'lodash';
import { DiaSemana, Horario, Taller } from './api';

export const serialize = (obj: any[]) => JSON.parse(JSON.stringify(obj))

export const dias = {
  'lun': 'Lunes',
  'mar': 'Martes',
  'mie': 'Miércoles',
  'jue': 'Jueves',
  'vie': 'Viernes',
  'sab': 'Sábado',
  'dom': 'Domingo'
}

export const diasAssert = {
  'lun': isMonday,
  'mar': isTuesday,
  'mie': isWednesday,
  'jue': isThursday,
  'vie': isFriday,
  'sab': isSaturday,
  'dom': isSunday
}

export const diasMesTaller = (t: Taller, mes: Date) => {
  const checks = t.horarios.map(h => diasAssert[h.dia])
  const daysInMonth = getDaysInMonth(mes)
  return range(daysInMonth).map(n => set(mes, {date: n + 1})).filter(d => some(checks.map(check => check(d))))
}

export const dias_ids: DiaSemana[] = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']

export const dias_semana = ['Clase suelta', 'Un día/semana', 'Dos días/semana', 'Tres días/semana', 'Cuatro días/semana', 'Cinco días/semana', 'Seis días/semana']

export const horarios = flatten(range(8, 20).map(h => [`${h}:00hs`, `${h}:30hs`]))

export const formatearHorarios = (hs: Horario[]) => hs.map(h => `${capitalize(h.dia)} ${h.hora}`).join(', ')
export const incluyeHorario = (hs: Horario[], h: Horario) => some(hs, hi => hi.dia == h.dia && hi.hora == h.hora)
export const eqHorario = (h1: Horario, h2: Horario) => h1.dia == h2.dia && h1.hora == h2.hora

export const nombres_meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export const format_curr = (amnt: number) => amnt >= 0 ? `$${amnt}` : `-$${Math.abs(amnt)}`

interface Periodo { desde: Date, hasta: Date }
export const isBetween = (d: Date, periodo: Periodo) => (isAfter(d, periodo.desde) && isBefore(d, periodo.hasta)) || isEqual(d, periodo.desde)
export const isInMonth = (d: Date, mes: Date) => isBetween(d, { desde: startOfMonth(mes), hasta: endOfMonth(mes) })


// export const balance_inscripcion = (inscripcion: Inscripcion) => {
//   const t0 = new Date(inscripcion.iniciada)
//   const primer_cobro = startOfMonth(addMonths(t0, 1))
//   const meses = differenceInMonths(new Date(), primer_cobro)

//   const tarifas_cobradas: MovimientoBase[] = eachMonthOfInterval({ start: new Date(inscripcion.iniciada), end: new Date() })
//     .map(m => {
//       const tarifa_correspondiente = findLast(inscripcion.tarifas, t => isBefore(new Date(t.iniciada), m))?.monto ?? findLast(inscripcion.tarifas)?.monto ?? 0;
//       const fecha = startOfMonth(m)
//       return {
//         monto: -tarifa_correspondiente,
//         fecha: fecha,
//         razon: 'inscripcion',
//         medio: '-',
//         detalle: 'Tarifa ' + nombres_meses[getMonth(fecha)]
//       }
//     })

//   const pagos_efectuados: MovimientoBase[] = lkpPagosInscripcion(inscripcion).map(p => ({
//     monto: p.monto,
//     fecha: new Date(p.fecha),
//     razon: 'inscripcion',
//     medio: 'efectivo',
//     detalle: `Pago ${nombres_meses[getMonth(new Date(p.fecha))]}`
//   })) ?? []

//   const movimientos = sortBy(concat(tarifas_cobradas, pagos_efectuados), 'fecha')

//   return movimientos
// }

