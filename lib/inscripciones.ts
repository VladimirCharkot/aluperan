import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { Alumne, Taller, Inscripcion, InscripcionPut, InscripcionPost, InscripcionMongo } from "./api";
import { last, pick } from "lodash";

export const get_inscripciones = async (): Promise<Inscripcion[]> => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const inscripciones = await db
    .collection<InscripcionMongo>("inscripciones")
    .aggregate([
      {
        $lookup: {
          from: "talleres",
          localField: "taller",
          foreignField: "_id",
          as: "taller"
        }
      },
      {
        $lookup: {
          from: "alumnes",
          localField: "alumne",
          foreignField: "_id",
          as: "alumne"
        }
      },
      {
        $unwind: "$taller"
      },
      {
        $unwind: "$alumne"
      },
      {
        $addFields: { titulo: { $concat: ["$taller.nombre", " - ", "$alumne.nombre"] } }
      },
      {
        $lookup: {
          from: "movimientos",
          localField: "_id",
          foreignField: "inscripcion",
          as: "pagos"
        }
      }

    ])
    .toArray() as Inscripcion[];

  return inscripciones
}

export const post_inscripcion = async (inscripcion: InscripcionPost) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test")

  const alumne = await db.collection<Alumne>("alumnes").findOne({ _id: new ObjectId(inscripcion.alumne) as any })
  const taller = await db.collection<Taller>("talleres").findOne({ _id: new ObjectId(inscripcion.taller) as any })

  // if (!taller) return 'Error / No hay taller para esta inscripcion'
  // if (!alumne) return 'Error / No hay alumne para esta inscripcion'

  const insc = {
    activa: true,
    dias: inscripcion.dias,
    iniciada: inscripcion.iniciada ?? new Date(),
    alumne: new ObjectId(inscripcion.alumne),
    taller: new ObjectId(inscripcion.taller),
    tarifas: [{ monto: last(taller!.precios), iniciada: new Date() }]
  }

  const r = await db.collection('inscripciones').insertOne(insc)

  return {...insc, _id: r.insertedId, taller, alumne} 
}


export const put_inscripcion = async (update: InscripcionPut) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test")
  const ins = db.collection('inscripciones')

  const _id = new ObjectId(update._id)

  const r = await ins.updateOne({ _id: _id }, { $set: pick(update, ['activa', 'iniciada', 'dias']) })
  if (update.activa === false) { await ins.updateOne({ _id: _id }, { $set: { baja: new Date() } }) }
  if (update.tarifa) { return (await ins.updateOne({ _id: _id }, { $push: { tarifas: update.tarifa } })).upsertedId }
  return r.upsertedId
}