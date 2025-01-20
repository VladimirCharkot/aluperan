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
  ficha?: boolean,
  activo: boolean
}

export type AlumneMongo = AlumneBase & { _id: ObjectId }
// export type AlumneCable = AlumneBase & { _id: MongoId }
export type AlumnePut = Partial<AlumneBase> & { _id: MongoId }
export type AlumnePost = Omit<AlumneBase, 'activo'>
export type AlumneDel = { _id: MongoId }
export type Alumne = AlumneBase & { _id: MongoId, }


// Inscripciones

export type InscripcionBase = {
  iniciada: Date,
  activa: boolean,
  tarifas: Tarifa[],
  baja?: Date,
  horarios: Horario[]
}

export type InscripcionMongo = InscripcionBase & { _id: ObjectId, alumne: ObjectId, taller: ObjectId }

export type InscripcionPost = {
  tarifa_inicial?: Tarifa,      // Las tarifas son solo de referencia
  alumne: MongoId,
  taller: MongoId,
  horarios: Horario[],
  iniciada?: Date
}

export type InscripcionPut = {
  _id: MongoId,
  iniciada?: Date,
  activa?: boolean,
  horarios?: Horario[],
  tarifa?: Tarifa
}

export type Inscripcion = InscripcionBase & {
  _id: MongoId,
  alumne: MongoId,
  taller: MongoId
}


// Movimientos

export type MovimientoBase = {
  monto: number,
  medio: MedioDePago
  fecha: Date,
  detalle: string
}

export type MovimientoGenerico = MovimientoBase & { razon: 'otra' }

export type MovimientoInscripcion = MovimientoBase & { razon: 'inscripcion', alumne: MongoId, taller: MongoId, inscripcion: MongoId, mes: Date }
export type MovimientoClaseSuelta = MovimientoBase & { razon: 'clase suelta', alumne: MongoId, taller: MongoId, ocasion: Date }
export type MovimientoLiquidacionProfe = MovimientoBase & { razon: 'liquidacion profe', taller: MongoId, mes: Date }

export type MovimientoInscripcionMongo = MovimientoBase & { _id: ObjectId, razon: 'inscripcion', alumne: ObjectId, taller: ObjectId, inscripcion: ObjectId, mes: Date }
export type MovimientoClaseSueltaMongo = MovimientoBase & { _id: ObjectId, razon: 'clase suelta', alumne: ObjectId, taller: ObjectId, ocasion: Date }
export type MovimientoLiquidacionProfeMongo = MovimientoBase & { _id: ObjectId, razon: 'liquidacion profe', taller: ObjectId, mes: Date }

export type MovimientoInscripcionPost = Omit<MovimientoBase, 'detalle'> & { razon: 'inscripcion', inscripcion: MongoId, mes: Date }
export type MovimientoClaseSueltaPost = Omit<MovimientoBase, 'detalle'> & { razon: 'clase suelta', alumne: MongoId, ocasion: Date, taller: MongoId }
export type MovimientoLiquidacionProfePost = Omit<MovimientoBase, 'detalle'> & { razon: 'liquidacion profe', taller: MongoId, mes: Date }

export type Movimiento = { _id: MongoId } & (MovimientoGenerico | MovimientoInscripcion | MovimientoClaseSuelta | MovimientoLiquidacionProfe)
// export type MovimientoCable = { _id: MongoId } & (MovimientoGenerico | MovimientoInscripcionCable | MovimientoClaseSueltaCable | MovimientoLiquidacionProfeCable)
export type MovimientoMongo = { _id: ObjectId } & (MovimientoGenerico | MovimientoInscripcionMongo | MovimientoClaseSueltaMongo | MovimientoLiquidacionProfeMongo)
export type MovimientoPost = (MovimientoGenerico | MovimientoInscripcionPost | MovimientoClaseSueltaPost | MovimientoLiquidacionProfePost) & {detalle?: string}
export type MovimientoPut = { _id: MongoId, detalle?: string, alumne?: MongoId, taller?: MongoId }


// Taller

export type TallerBase = {
  nombre: string,
  profe: string
  horarios: Horario[],
  precios: number[]  // 0: clase suelta, 1: 1 día/sem, 2: 2 días/sem, etc,
  iniciado: Date,
  activo: boolean,
  porcentaje_profe?: number
}

export type TallerMongo = TallerBase & { _id: ObjectId }
export type TallerPost = Omit<TallerBase, 'activo'>
export type TallerPut = Partial<TallerBase> & { _id: MongoId }
// export type TallerCable = TallerBase & { _id: MongoId, inscripciones: MongoId[] }
export type Taller = TallerBase & {
  _id: string,
  // inscripciones: () => Inscripcion[], 
  // _inscripciones: MongoId[] 
}


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

export type AsistenciaPost = Omit<Asistencia, '_id'>


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

export type MedioDePago = 'efectivo' | 'mercadopago' | 'tarjeta' | 'transferencia' | 'otro' | 'no_informado' | '-'

