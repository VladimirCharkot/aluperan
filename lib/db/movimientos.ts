import { Inscripcion, MovimientoInscripcionPost, MovimientoPost, MovimientoClaseSueltaPost, MovimientoLiquidacionProfePost, MovimientoPut, Alumne, MovimientoMongo } from "../api";
import clientPromise from "./mongodb";
import { ObjectId, Db, MongoClient } from "mongodb";
import { pick } from "lodash";
import { nombres_meses } from "../utils";
import { Almacen } from "./almacen";


// Intento de versión que hereda de Almacen que abstrae esperar la promesa 

export class AlmacenMovimientos extends Almacen<MovimientoMongo>{

  public static async build(){ return new AlmacenMovimientos() }

  constructor(){ super('movimientos') }

  async create(movimiento: MovimientoPost) {
    if (movimiento.razon == 'inscripcion') {  // Si es inscripcion la buscamos, y su alumne y taller
      return await this.insertarPagoInscripcion(movimiento)
    } else if (movimiento.razon == 'clase suelta') {
      return await this.insertarPagoClaseSuelta(movimiento)
    } else if (movimiento.razon == 'liquidacion profe') {
      return await this.insertarLiquidacionProfe(movimiento)
    } else {  // (movimiento.razon == 'otra')
      return await this.insertarGenerico(movimiento)
    }
  }

  async update(movimiento: MovimientoPut) {
    return super.update(movimiento)
  }

  async insertarPagoInscripcion(movimiento: MovimientoInscripcionPost) {
    const i = await (await this.sibling('inscripciones')).findOne({ _id: new ObjectId(movimiento.inscripcion) })
    if (!i) return { ok: false, mensaje: `Inconsistencia: Se intentó ingresar un pago para la inscripción ${movimiento.inscripcion}, que no existe` }

    const alumne = await (await this.sibling('alumnes')).findOne({ _id: i.alumne })
    if (!alumne) return { ok: false, mensaje: `Inconsistencia: No se encontró alumne ${i.alumne} de la inscripcion ${movimiento.inscripcion} al intentar insertar pago para la misma` }

    const taller = await (await this.sibling('talleres')).findOne({ _id: i.taller })
    if (!taller) return { ok: false, mensaje: `Inconsistencia: No se encontró taller ${i.taller} de la inscripcion ${movimiento.inscripcion} al intentar insertar pago para la misma` }

    const mes = new Date(movimiento.mes)

    const r = await super.create({
      ...movimiento,
      inscripcion: new ObjectId(movimiento.inscripcion),
      detalle: `Pago de inscripción de ${alumne.nombre} a ${taller.nombre} para el mes de ${nombres_meses[mes.getMonth()]}`
    })

    return {...r, inscripcion: i._id, taller: taller._id, alumne: alumne._id}
  }

  async insertarPagoClaseSuelta(movimiento: MovimientoClaseSueltaPost) {
    const alumne = await (await this.sibling('alumnes')).findOne({ _id: new ObjectId(movimiento.alumne) })
    const taller = await (await this.sibling('talleres')).findOne({ _id: new ObjectId(movimiento.taller) })

    if (!alumne) return { ok: false, mensaje: `Inconsistencia: Se intentó pagar clase suelta para alumne ${movimiento.alumne}, que no existe` }
    if (!taller) return { ok: false, mensaje: `Inconsistencia: Se intentó pagar clase suelta para taller ${movimiento.taller}, que no existe` }

    return await super.create({
      ...movimiento,
      fecha: new Date(movimiento.fecha),
      ocasion: movimiento.ocasion,
      detalle: `Pago de clase suelta de ${alumne.nombre} a ${taller.nombre} el día ${new Date(movimiento.ocasion).toLocaleDateString('es-ES')}` 
    })

  }

  async insertarLiquidacionProfe(movimiento: MovimientoLiquidacionProfePost) {
    const taller = await (await this.sibling('talleres')).findOne({ _id: new ObjectId(movimiento.taller) });
    if (!taller) return { ok: false, mensaje: `Inconsistencia: Se intentó liquidar a profe para taller ${movimiento.taller}, que no existe` }

    const mov = {
      ...movimiento,
      taller: new ObjectId(movimiento.taller),
      detalle: `Liquidación ${nombres_meses[new Date(movimiento.mes).getMonth()]} para ${taller!.nombre}`
    }

    return await super.create(mov)
  }

  async insertarGenerico(movimiento: MovimientoPost) {
    return await super.create(movimiento)
  }
}

export let almacenMovimientos: AlmacenMovimientos
AlmacenMovimientos.build().then(a => almacenMovimientos = a)