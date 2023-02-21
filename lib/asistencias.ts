import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import { AsistenciaMongo } from "./api";


export const get_asistencias = async (taller?: string) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const asistencias = await db
    .collection("asistencias")
    .aggregate([...taller ? [{$match: {taller : new ObjectId(taller)}}] : [],
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

  return asistencias
}

export const post_asistencia = async (asistencia : AsistenciaMongo) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const r = await db.collection('alumnes').insertOne(asistencia)

  return r.insertedId
}