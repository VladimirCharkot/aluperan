import { Inscripcion, MovimientoInscripcionPost, MovimientoPost, MovimientoClaseSueltaPost, MovimientoLiquidacionProfePost, MovimientoPut, Alumne } from "./api";
import clientPromise from "./mongodb";
import { ObjectId, Db, MongoClient } from "mongodb";
import { pick } from "lodash";
import { nombres_meses } from "../lib/utils";

// pick(movimiento, ['razon', 'fecha', 'monto', 'detalle'])

export class AlmacenMovimientos {
  private db: Db;

  public static async build() {
    const client = await clientPromise
    return new AlmacenMovimientos(client);
  }

  constructor(private client: MongoClient) {
    this.db = this.client.db("aluperan")
  }

  async get() {
    const movimientos = await this
      .db!.collection('movimientos')
      .find({})
      .toArray();

    return movimientos
  }

  async post(movimiento: MovimientoPost) {
    if (movimiento.razon == 'inscripcion') {  // Si es inscripcion la buscamos, y su alumne y taller
      return this.insertarPagoInscripcion(movimiento)
    } else if (movimiento.razon == 'clase suelta') {
      return this.insertarPagoClaseSuelta(movimiento)
    } else if (movimiento.razon == 'liquidacion profe') {
      return this.insertarLiquidacionProfe(movimiento)
    } else if (movimiento.razon == 'otra') {
      return this.insertarGenerico(movimiento)
    }
  }

  async put(movimiento: MovimientoPut) {
    const r = await this.db.collection('movimientos').updateOne({ _id: new ObjectId(movimiento._id) }, pick(movimiento, ['detalle']))
    return r.upsertedId
  }

  async insertarPagoInscripcion(movimiento: MovimientoInscripcionPost) {
    const i = await this.db.collection<Inscripcion>('inscripciones')
      .findOne({ _id: new ObjectId(movimiento.inscripcion) as any })

    const alumne = await this.db.collection('alumnes')
      .findOne({ _id: i!.alumne })

    const taller = await this.db.collection('talleres')
      .findOne({ _id: i!.taller })

    const r = await this.db.collection('movimientos').insertOne({
      ...movimiento,
      inscripcion: new ObjectId(movimiento.inscripcion),
      detalle: `Pago de ${alumne!.nombre} - ${taller!.nombre}`
    })

    i!.alumne = alumne! as unknown as Alumne

    return { ...movimiento, _id: r.insertedId, inscripcion: i }
  }

  async insertarPagoClaseSuelta(movimiento: MovimientoClaseSueltaPost) {
    const alumne = await this.db.collection('alumnes')
      .findOne({ _id: movimiento.alumne })

    const taller = await this.db.collection('talleres')
      .findOne({ _id: movimiento.taller })

    if (!alumne || !taller) return 'ERROR - Alumne o taller erróneos'

    const r = await this.db.collection('movimientos').insertOne({
      ...movimiento,
      detalle: `Pago de ${alumne.nombre} por clase suelta de ${taller.nombre}`
    })

    return { ...movimiento, _id: r.insertedId, alumne, taller }

  }

  async insertarLiquidacionProfe(movimiento: MovimientoLiquidacionProfePost) {
    const taller = await this.db.collection('talleres').findOne({_id: new ObjectId(movimiento.taller)});
    const mov = {
      ...movimiento,
      taller: new ObjectId(movimiento.taller),
      detalle: `Liquidación ${nombres_meses[new Date(movimiento.mes).getMonth()]} para ${taller!.nombre}`
    }
    const r = await this.db.collection('movimientos').insertOne(mov)
    return { ...mov, _id: r.insertedId }
  }

  async insertarGenerico(movimiento: MovimientoPost) {
    const r = await this.db.collection('movimientos').insertOne(movimiento)
    return { ...movimiento, _id: r.insertedId }
  }

}




