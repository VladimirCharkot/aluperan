// --- // --- // --- // --- // --- // --- // --- // --- // --- / --- //
//
// Para cada clase establecemos cómo se ve en Mongo, 
// cómo se ve en el frontend (sin sufijo), y cómo se ven
// sus operaciones post y update
// En Mongo, los ids son ObjectId, en el frontend son strings
//
// --- // --- // --- // --- // --- // --- // --- // --- // --- / --- //


import { ObjectId } from 'mongodb';

export type MongoId = string


// Alumne

export type AlumneBase = {
  nombre: string,
  celular?: string,
  email?: string
}

export type AlumneMongo = AlumneBase & { _id: ObjectId }
export type AlumnePut = Partial<AlumneBase> & { _id: MongoId }
export type AlumnePost = AlumneBase 
export type Alumne = AlumneBase & {
  _id: MongoId,
  inscripciones: Inscripcion[],
  pagos: Pago[]
}


// Inscripciones

export type InscripcionBase = {
  iniciada: Date,
  activa: boolean,
  tarifas: Tarifa[],
  baja?: Date,
  dias: number
}

export type InscripcionMongo = InscripcionBase & { _id: ObjectId, alumne: ObjectId, taller: ObjectId }

export type InscripcionPost = {
  tarifa_inicial?: Tarifa,      // Las tarifas son solo de referencia
  alumne: MongoId,
  taller: MongoId,
  dias: number,
  iniciada?: Date
}

export type InscripcionPut = {
  _id: MongoId,
  iniciada?: Date,
  activa?: boolean,
  dias?: number,
  tarifa?: Tarifa
}

export type Inscripcion = InscripcionBase & {
  _id: string,
  alumne: Alumne,
  taller: Taller
  pagos: Pago[],
  titulo?: string
}


// Movimientos

export type MovimientoBase = {
  monto: number,
  medio: MedioDePago
  fecha: Date,
  detalle: string
}

export type MovimientoGenerico = MovimientoBase & { razon: 'otra' }

export type MovimientoInscripcion = MovimientoBase & { razon: 'inscripcion', inscripcion: Inscripcion, mes: Date }
export type MovimientoClaseSuelta = MovimientoBase & { razon: 'clase suelta', alumne: Alumne, taller: Taller }
export type MovimientoLiquidacionProfe = MovimientoBase & { razon: 'liquidacion profe', taller: MongoId, mes: Date }

export type MovimientoInscripcionMongo = MovimientoBase & { razon: 'inscripcion', inscripcion: ObjectId, mes: Date }
export type MovimientoClaseSueltaMongo = MovimientoBase & { razon: 'clase suelta', alumne: ObjectId, taller: ObjectId }
export type MovimientoLiquidacionProfeMongo = MovimientoBase & { razon: 'liquidacion profe', taller: ObjectId, mes: Date }

export type MovimientoInscripcionPost = MovimientoBase & { razon: 'inscripcion', inscripcion: MongoId, mes: Date }
export type MovimientoClaseSueltaPost = MovimientoBase & { razon: 'clase suelta', alumne: MongoId, taller: MongoId }
export type MovimientoLiquidacionProfePost = MovimientoBase & { razon: 'liquidacion profe', taller: MongoId, mes: Date }

export type Movimiento = { _id: MongoId } & (MovimientoGenerico | MovimientoInscripcion | MovimientoClaseSuelta | MovimientoLiquidacionProfe)
export type MovimientoMongo = { _id: ObjectId } & (MovimientoGenerico | MovimientoInscripcionMongo | MovimientoClaseSueltaMongo | MovimientoLiquidacionProfeMongo)
export type MovimientoPost = MovimientoGenerico | MovimientoInscripcionPost | MovimientoClaseSueltaPost | MovimientoLiquidacionProfePost
export type MovimientoPut = { _id: MongoId, detalle: string }


// Taller

export type TallerBase = {
  nombre: string,
  profe: string
  horarios: Horario[],
  precios: number[]  // 0: clase suelta, 1: 1 día/sem, 2: 2 días/sem, etc,
  iniciado: Date
}

export type TallerMongo = TallerBase & { _id: ObjectId }
export type TallerPost = TallerBase
export type TallerPut = Partial<TallerBase> & { _id: MongoId }
export type Taller = TallerBase & { _id: string, inscripciones: Inscripcion[] }


// Asistencias

export type AsistenciaMongo = {
  _id: ObjectId,
  alumne: ObjectId,
  taller: ObjectId,
  fecha: Date,
  horario: string
}

export type Asistencia = {
  _id: MongoId,
  alumne: MongoId,
  taller: MongoId,
  fecha: Date,
  horario: string
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

