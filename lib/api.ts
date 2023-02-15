import { ObjectId } from 'mongodb';

// API

export type OperacionApi =
  { op: "alumne.crear", cmd: CrearAlumne } |
  { op: "taller.crear", cmd: CrearTaller } |
  { op: "inscripcion.crear", cmd: CrearInscripcion } |
  { op: "movimiento.crear", cmd: CrearMovimiento } |
  { op: "asistencia.crear", cmd: CrearAsistencia } 
  // { op: "alumne.crear", cmd: CrearAlumne } |
  // { op: "taller.crear", cmd: CrearTaller } |
  // { op: "inscripcion.crear", cmd: CrearInscripcion } |
  // { op: "movimiento.crear", cmd: CrearMovimiento } |
  // { op: "asistencia.crear", cmd: CrearAsistencia } 

export type CrearAlumne = {
  nombre: string,
  celular?: string,
  email?: string
}

export type EditarAlumne = {_id: string} & Partial<Omit<AlumneMongo, '_id'>>

export type CrearTaller = {
  nombre: string,
  profe: string,
  precios?: number[]  // 0: clase suelta, 1: 1 día/sem, 2: 2 días/sem, etc,
  horarios?: Horario[],
  inscripciones?: Inscripcion[]
}


export type CrearInscripcion = {
  alumne: MongoId,
  taller: MongoId,
  dias: number
}

export type EditarInscripcion = { _id: MongoId, activa?: boolean, iniciada?: Date, dias?: number, tarifa?: Tarifa }


export type CrearMovimiento = {
  monto: number,
  medio: MedioDePago
  detalle?: string,
  fecha?: Date,
} & ({
  razon: 'otra',
} | {
  razon: 'inscripcion'
  inscripcion: string,
})

export type CrearAsistencia = {
  alumne: MongoId,
  taller: MongoId,
  inscripcion: MongoId,
  fecha?: Date
}

type MongoId = string


// --- // -- // --- // --- // --- // --- // --- // --- // --- / --- //


// Alumne

export type AlumneMongo = {
  _id: ObjectId,
  nombre: string,
  celular?: string,
  email?: string,
  // inscripciones: ObjectId[],
  // pagos: ObjectId[]
}

export type Alumne = Omit<AlumneMongo, '_id' | 'inscripciones' | 'pagos'> & { 
  _id: string,
  inscripciones: Inscripcion[],
  pagos: Pago[]
}


// Inscripciones

export type InscripcionMongo = {
  _id: ObjectId,
  iniciada: Date,
  activa: boolean,
  alumne: ObjectId,
  taller: ObjectId,
  tarifas: Tarifa[],
  baja?: Date
}

export type Inscripcion = Omit<InscripcionMongo, '_id' | 'alumne' | 'taller'> & {
  _id: string,
  alumne: Alumne,
  taller: Taller
  titulo?: string,
  pagos?: Pago[],
}


// Movimientos

export type MovimientoMongo = {
  _id: ObjectId,
  monto: number,
  medio: MedioDePago
  fecha: Date,
  detalle: string,
} & ({
  razon: 'otra',
} | {
  razon: 'inscripcion',
  inscripcion: ObjectId,
  mes: Mes
} | {
  razon: 'clase suelta',
  alumne: ObjectId,
  taller: ObjectId
} | {
  razon: 'liquidacion profe',
  profe: string,
  mes: Mes
})

export type Movimiento = Omit<MovimientoMongo, 'inscripcion' | '_id'> & {inscripcion?: Inscripcion}


// Cobros

// export type CobroMongo = {
//   _id: ObjectId,
//   monto: number,
//   fecha: Date,
//   detalle: string,
//   inscripcion?: ObjectId
// }


// Taller

export type TallerMongo = {
  _id: ObjectId
  nombre: string,
  profe: string
  horarios: Horario[],
  precios: number[]  // 0: clase suelta, 1: 1 día/sem, 2: 2 días/sem, etc,
}

export type Taller = Omit<TallerMongo, '_id' | 'inscripciones'> & {
  _id: string,
  inscripciones: Inscripcion[]
}


// Asistencias

export type AsistenciaMongo = {
  _id: ObjectId,
  alumne: ObjectId,
  taller: ObjectId,
  fecha: Date
}

export type Asistencia = Omit<AsistenciaMongo, '_id' | 'alumne' | 'taller'> & {
  _id: string,
  alumne: Alumne,
  taller: Taller
}


// Ayudines 

export type DiaSemana = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'
export type Mes = 'enero' | 'febrero' | 'marzo' | 'abril' | 'mayo' | 'junio' | 'julio' | 'agosto' | 'septiembre' | 'octubre' | 'noviembre' | 'diciembre'

export interface Horario {
  dia: DiaSemana,
  hora: string
}

export interface Tarifa {
  iniciada: Date,
  monto: number
}

export interface Pago {
  fecha: Date,
  monto: number
}

export type RazonMovimiento = 'inscripcion' | 'otra' | 'clase suelta' | 'liquidacion profe'

export type MedioDePago = 'efectivo' | 'mercadopago' | 'tarjeta' | 'otro' | 'no_informado'

