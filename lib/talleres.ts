import clientPromise from "./mongodb";
import { Taller, TallerPost, TallerPut } from './api';
import { pick, isEmpty } from "lodash";
import { ObjectId } from "mongodb";

export const get_talleres = async () => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const talleres = await db
    .collection("talleres")
    .aggregate([
      {
        $lookup: {
          from: "inscripciones",
          localField: "_id",
          foreignField: "taller",
          as: "inscripciones",
          pipeline: [{ $match: { activa: true } }]
        }
      },
      {
        $unwind: {
          path: "$inscripciones",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "alumnes",
          localField: "inscripciones.alumne",
          foreignField: "_id",
          as: "inscripciones.alumne"
        }
      },
      {
        $unwind: {
          path: "$inscripciones.alumne",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          nombre: 1, horarios: 1, precios: 1, profe: 1, iniciado: 1, inscripciones: 1
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            nombre: "$nombre",
            horarios: "$horarios",
            precios: "$precios",
            profe: "$profe",
            iniciado: "$iniciado"
          },
          inscripciones: {
            $push: "$inscripciones"
          }
        }
      },
      {
        $project: {
          _id: "$_id._id",
          nombre: "$_id.nombre",
          horarios: "$_id.horarios",
          precios: "$_id.precios",
          profe: "$_id.profe",
          iniciado: "$_id.iniciado",
          inscripciones: 1
        }
      }
    ])
    .toArray() as Taller[];

  talleres.forEach(t => {
    // Filtramos inscripciones sin alumne (accidentes de DB)
    t.inscripciones = t.inscripciones.filter(i => i.alumne) 
    if (isEmpty(t.inscripciones[0])) {
      t.inscripciones = []
    }
  })

  return talleres
}


export const post_taller = async (taller: TallerPost) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  console.log(`Insertando taller:`)
  console.log({
    ...pick(taller, ['nombre', 'precios', 'profe', 'horarios', 'iniciado']),
    iniciado: taller.iniciado ?? new Date()
  })

  const r = await db.collection('talleres').insertOne({
    ...pick(taller, ['nombre', 'precios', 'profe', 'horarios', 'iniciado']),
    iniciado: taller.iniciado ?? new Date()
  })

  return { ...taller, _id: r.insertedId, inscripciones: [] }
}

export const put_taller = async (updates: TallerPut) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");
  const r = await db.collection('talleres').updateOne({ _id: new ObjectId(updates._id) }, { $set: pick(updates, ['nombre', 'precios', 'profe', 'horarios']) })
  return r.acknowledged
}