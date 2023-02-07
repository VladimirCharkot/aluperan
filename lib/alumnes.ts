import clientPromise from "./mongodb";
import { TallerType } from "./talleres";
import { InscripcionType, PagoType } from './inscripciones';

export interface AlumneBase{
  nombre: string
}

export interface AlumneType extends AlumneBase{
  _id: string,
  inscripciones: InscripcionType[],
  pagos: PagoType[]
}

export const get_alumnes = async () => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const talleres = await db
    .collection<TallerType>("talleres")
    .find({})

  const alumnes = await db
    .collection("alumnes")
    .aggregate([
      {
        $lookup: {
          from: "inscripciones",
          localField: "inscripciones",
          foreignField: "_id",
          as: "inscripciones"
        }
      }
    ])
    .toArray()

  return alumnes
}

export const post_alumne = async (alumne: AlumneBase) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const query = {nombre: alumne.nombre}
  const update = {$set : {...alumne, inscripciones: [], pagos: []}}

  const r = await db.collection('alumnes').updateOne(query, update, {upsert: true})

  return r.upsertedId
}