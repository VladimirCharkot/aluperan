import clientPromise from "./mongodb";

export type RazonType = 'inscripcion' | 'otra'

export interface MovimientoType{
  fecha: Date,
  monto: number,
  razon: RazonType,
  detalle?: string
}

export const get_movimientos = async () => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const movimientos = await db
    .collection<MovimientoType>('movimientos')
    .find({})
    .toArray();

  return movimientos
}

export const post_movimiento = async (movimiento: MovimientoType) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test")
  console.log(movimiento)
  const r = await db.collection('movimientos').insertOne(movimiento)

  return r.insertedId
}