import clientPromise from "./mongodb";
import { Taller, CrearTaller } from './api';
import { pick } from "lodash";

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
          nombre: 1, horarios: 1, precios: 1, profe: 1,
          'inscripciones.alumne': '$inscripciones.alumne.nombre',
          'inscripciones.iniciada': 1,
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            nombre: "$nombre",
            horarios: "$horarios",
            precios: "$precios",
            profe: "$profe"
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
          inscripciones: 1
        }
      }
    ])
    .toArray() as Taller[];

  return talleres
}


export const post_taller = async (taller: CrearTaller) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const query = { nombre: taller.nombre }
  const update = { $set: pick(taller, ['nombre', 'precios', 'profe', 'horarios']) }

  console.log(update)

  const r = await db.collection('talleres').updateOne(query, update, { upsert: true })

  return r.upsertedId
}

export const put_taller = post_taller