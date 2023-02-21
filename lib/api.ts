import { ObjectId } from 'mongodb';

// API

export type OperacionApi =
  { op: "alumne.crear", cmd: AlumnePost } |
  { op: "taller.crear", cmd: TallerPost } |
  { op: "inscripcion.crear", cmd: InscripcionPost } |
  { op: "movimiento.crear", cmd: MovimientoPost } 
  // { op: "asistencia.crear", cmd: CrearAsistencia } 
  // { op: "alumne.crear", cmd: CrearAlumne } |
  // { op: "taller.crear", cmd: CrearTaller } |
  // { op: "inscripcion.crear", cmd: CrearInscripcion } |
  // { op: "movimiento.crear", cmd: CrearMovimiento } |
  // { op: "asistencia.crear", cmd: CrearAsistencia } 

export type EditarAlumne = {_id: string} & Partial<Omit<AlumneMongo, '_id'>>

export type EditarInscripcion = { _id: MongoId, activa?: boolean, iniciada?: Date, dias?: number, tarifa?: Tarifa }

// export type CrearAsistencia = {
//   alumne: MongoId,
//   taller: MongoId,
//   inscripcion: MongoId,
//   fecha?: Date
// }

export type MongoId = string


// --- // -- // --- // --- // --- // --- // --- // --- // --- / --- //


// Alumne

export type AlumneMongo = {
  _id: ObjectId,
  nombre: string,
  celular?: string,
  email?: string
}

export type AlumnePost = Omit<AlumneMongo, '_id'>

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
  baja?: Date,
  dias: number
}

export type InscripcionPost = Omit<InscripcionMongo, '_id' | 'iniciada' | 'activa' | 'tarifas' | 'baja' | 'alumne' | 'taller'> & {
  tarifa_inicial?: Tarifa,
  alumne: MongoId,
  taller: MongoId,
  dias: number,
  iniciada?: Date
}

export type Inscripcion = Omit<InscripcionMongo, '_id' | 'alumne' | 'taller'> & {
  _id: string,
  alumne: Alumne,
  taller: Taller
  titulo?: string,
  pagos: Pago[],
  dias: number
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
  mes: Date
} | {
  razon: 'clase suelta',
  alumne: ObjectId,
  taller: ObjectId
} | {
  razon: 'liquidacion profe',
  taller: ObjectId,
  mes: Date
})

export type MovimientoPost = Omit<MovimientoMongo, '_id' | 'fecha'>

export type MovimientoBase = Omit<MovimientoMongo, 'detalle' | '_id'>
export type MovimientoGenerico = MovimientoBase & { detalle: string }
export type MovimientoInscripcion = MovimientoBase & { inscripcion: string }
export type MovimientoClaseSuelta = MovimientoBase & { alumne: MongoId, taller: MongoId }
export type MovimientoLiquidacionProfe = MovimientoBase & { taller: MongoId, mes: Date }
export type Movimiento = (MovimientoGenerico | MovimientoInscripcion | MovimientoClaseSuelta | MovimientoLiquidacionProfe) & {detalle: string}

// Taller

export type TallerMongo = {
  _id: ObjectId
  nombre: string,
  profe: string
  horarios: Horario[],
  precios: number[]  // 0: clase suelta, 1: 1 día/sem, 2: 2 días/sem, etc,
  iniciado: Date
}

export type TallerPost = Omit<TallerMongo, '_id'>
export type TallerPut = Partial<TallerMongo> & {_id: MongoId}

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
  monto: number,
  medio: MedioDePago
}

export type RazonMovimiento = 'inscripcion' | 'otra' | 'clase suelta' | 'liquidacion profe'

export type MedioDePago = 'efectivo' | 'mercadopago' | 'tarjeta' | 'otro' | 'no_informado' | '-'

