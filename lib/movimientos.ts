import { Inscripcion, Movimiento, MovimientoMongo } from "./api";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import { pick } from "lodash";



export const get_movimientos = async () => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const movimientos = await db
    .collection<Movimiento>('movimientos')
    .find({})
    .toArray();

  return movimientos
}

export const post_movimiento = async (movimiento: MovimientoMongo) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test")

  if (movimiento.razon == 'inscripcion') {  // Si es inscripcion la buscamos, y su alumne y taller
    const i = await db.collection<Inscripcion>('inscripciones')
      .findOne({_id: new ObjectId(movimiento.inscripcion) as any})

    if(!i) return 'ERROR - Inscripcion inextistente'
    
    const alumne = await db.collection('alumnes')
      .findOne({_id: i.alumne})

    const taller = await db.collection('talleres')
      .findOne({_id: i.taller}) 

    if (!alumne || !taller) return 'ERROR - Inscripcion errónea'

    const r = await db.collection('movimientos').insertOne({
      ...movimiento,
      inscripcion: new ObjectId(movimiento.inscripcion),
      detalle: `Pago de ${alumne.nombre} - ${taller.nombre}`
    })

    return r.insertedId

  }else if(movimiento.razon == 'clase suelta'){
    const alumne = await db.collection('alumnes')
      .findOne({_id: movimiento.alumne})
    
    if (!alumne) return 'ERROR - Alumne inexistente'

    const r = await db.collection('movimientos').insertOne({
      fecha: movimiento.fecha,
      monto: movimiento.monto,
      razon: movimiento.razon,
      alumne: new ObjectId(movimiento.alumne),
      detalle: `Pago de ${alumne.nombre} por clase suelta`
    }) 

  }else{
    const r = await db.collection('movimientos').insertOne(pick(movimiento,['razon', 'fecha', 'monto', 'detalle']))
    return r.insertedId
  }

}

export const put_movimiento = async (movimiento: {_id: string, detalle: string}) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test")
  const r = await db.collection('movimientos').updateOne({_id: new ObjectId(movimiento._id)}, pick(movimiento, ['detalle']))
  return r.upsertedId
}