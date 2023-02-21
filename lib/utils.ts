import { addMonths, differenceInMonths, endOfMonth, getMonth, isAfter, isBefore, startOfMonth } from 'date-fns';
import { flatten, range, findLast, concat, sortBy } from 'lodash';
import { Inscripcion, Movimiento, Taller } from './api';

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

export const dias_semana = ['Clase suelta', 'Un día/semana', 'Dos días/semana', 'Tres días/semana', 'Cuatro días/semana', 'Cinco días/semana', 'Seis días/semana']

export const horarios = flatten(range(8, 20).map(h => [`${h}:00hs`, `${h}:30hs`]))

export const nombres_meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export const format_curr = (amnt: number) => amnt >= 0 ? `$${amnt}` : `-$${Math.abs(amnt)}`

export const balance_inscripcion = (inscripcion: Inscripcion) => {
  const t0 = new Date(inscripcion.iniciada)
  const primer_cobro = startOfMonth(addMonths(t0, 1))
  const meses = differenceInMonths(new Date(), primer_cobro)

  const tarifas_cobradas: Movimiento[] = range(meses).map(m => {
    const tarifa_correspondiente = findLast(inscripcion.tarifas, t => isBefore(new Date(t.iniciada), addMonths(t0, m)))?.monto ?? 0;
    const fecha = startOfMonth(addMonths(primer_cobro, m))
    return {
      monto: -tarifa_correspondiente,
      fecha: fecha,
      razon: 'inscripcion',
      medio: '-',
      detalle: 'Tarifa ' + nombres_meses[getMonth(fecha)]
    }
  })

  const pagos_efectuados: Movimiento[] = inscripcion.pagos?.map(p => ({
    monto: p.monto,
    fecha: new Date(p.fecha),
    razon: 'inscripcion',
    medio: 'efectivo',
    detalle: `Pago ${nombres_meses[getMonth(new Date(p.fecha))]}`
  })) ?? []

  const movimientos = sortBy(concat(tarifas_cobradas, pagos_efectuados), 'fecha')

  return movimientos
}

