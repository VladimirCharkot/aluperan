import { ChangeEventHandler } from "react"
import { range, flatten } from "lodash"

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

export const horarios = flatten(range(8, 20).map(h => [`${h}:00hs`, `${h}:15hs`, `${h}:30hs`, `${h}:45hs`]))
