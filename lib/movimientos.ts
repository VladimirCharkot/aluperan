import { Inscripcion, Mes, Movimiento, MovimientoMongo } from "./api";
import clientPromise from "./mongodb";
import { ObjectId, Db, MongoClient, Collection, Document } from "mongodb";
import { pick } from "lodash";
import { es } from "date-fns/locale";

// pick(movimiento, ['razon', 'fecha', 'monto', 'detalle'])


type MovimientoInscripcion = Movimiento & { inscripcion: string }
type MovimientoClaseSuelta = Movimiento & { alumne: ObjectId, taller: ObjectId }
type MovimientoLiquidacionProfe = Movimiento & { profe: string, mes: Mes }

export class AlmacenMovimientos{
  private db: Db;

  public static async build(){
    const client = await clientPromise
    return new AlmacenMovimientos(client);
  }
  
  constructor(private client: MongoClient) {
    this.db = this.client.db("aluperan_test")
   }

  async get() {
    const movimientos = await this
      .db!.collection('movimientos')
      .find({})
      .toArray();

    return movimientos
  }

  async post(movimiento: Movimiento) {
    if (movimiento.razon == 'inscripcion') {  // Si es inscripcion la buscamos, y su alumne y taller
      return this.insertarPagoInscripcion(movimiento as MovimientoInscripcion)
    } else if (movimiento.razon == 'clase suelta') {
      return this.insertarPagoClaseSuelta(movimiento as MovimientoClaseSuelta)
    } else if (movimiento.razon == 'liquidacion profe'){
      return this.insertarLiquidacionProfe(movimiento as MovimientoLiquidacionProfe)
    } else if (movimiento.razon == 'otra'){
      return this.insertarGenerico(movimiento)
    }
  }

  async put(movimiento: { _id: string, detalle: string }){
    const r = await this.db.collection('movimientos').updateOne({ _id: new ObjectId(movimiento._id) }, pick(movimiento, ['detalle']))
    return r.upsertedId
  }

  async insertarPagoInscripcion(movimiento: MovimientoInscripcion) {
    const i = await this.db.collection<Inscripcion>('inscripciones')
      .findOne({ _id: new ObjectId(movimiento.inscripcion) as any })

    if (!i) return 'ERROR - Inscripcion inextistente'

    const alumne = await this.db.collection('alumnes')
      .findOne({ _id: i.alumne })

    const taller = await this.db.collection('talleres')
      .findOne({ _id: i.taller })

    if (!alumne || !taller) return 'ERROR - Inscripcion errónea'

    const r = await this.db.collection('movimientos').insertOne({
      ...movimiento,
      inscripcion: new ObjectId(movimiento.inscripcion),
      detalle: `Pago de ${alumne.nombre} - ${taller.nombre}`
    })

    return r.acknowledged
  }

  async insertarPagoClaseSuelta(movimiento: MovimientoClaseSuelta) {
    const alumne = await this.db.collection('alumnes')
      .findOne({ _id: movimiento.alumne })

    const taller = await this.db.collection('talleres')
      .findOne({ _id: movimiento.taller })

    if (!alumne || !taller) return 'ERROR - Alumne o taller erróneos' 

    const r = await this.db.collection('movimientos').insertOne({
      ...movimiento,
      detalle: `Pago de ${alumne.nombre} por clase suelta de ${taller.nombre}`
    })

    return r.acknowledged

  }

  async insertarLiquidacionProfe(movimiento: MovimientoLiquidacionProfe){
    const r = await this.db.collection('movimientos').insertOne({
      ...movimiento,
      detalle: `Liquidación ${movimiento.mes} para ${movimiento.profe}`
    }) 
    return r.acknowledged
  }

  async insertarGenerico(movimiento: Movimiento){
    const r = await this.db.collection('movimientos').insertOne(movimiento)
    return r.acknowledged
  }

}




