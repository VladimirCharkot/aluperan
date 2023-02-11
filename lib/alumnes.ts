import clientPromise from "./mongodb";
import { AlumneMongo, Alumne, CrearAlumne, EditarAlumne } from "./api";
import { pick } from "lodash";
import { pipeline } from "stream";

export const get_alumnes = async () => {
  const client = await clientPromise;
  const alumnes = await client.db("aluperan_test").collection('alumnes');

  return await alumnes
    .aggregate([
      {
        $lookup: {
          from: "inscripciones",
          localField: "_id",
          foreignField: "alumne",
          as: "inscripciones",
          pipeline: [{ $match: { activa: true } }]
        }
      },
      {
        $unwind: "$inscripciones"
      },
      {
        $lookup: {
          from: "talleres",
          localField: "inscripciones.taller",
          foreignField: "_id",
          as: "inscripciones.taller"
        }
      },
      {
        $unwind: "$inscripciones.taller"
      },
      {
        $addFields: { "inscripciones.titulo": { $concat: ["$inscripciones.taller.nombre"] } }
      },
      {
        $lookup: {
          from: "movimientos",
          localField: "inscripciones._id",
          foreignField: "inscripcion",
          as: "pagos"
        }
      },
      {
        $group: {
          _id: "$_id",
          nombre: { $first: "$nombre" },
          celular: { $first: "$celular" },
          email: { $first: "$email" },
          pagos: { $first: "$pagos" },
          inscripciones: {
            $push: "$inscripciones"
          }
        }
      }
    ])
    .toArray() as Alumne[];
}



export const post_alumne = async (alumne: CrearAlumne) => {
  const client = await clientPromise;
  const alumnes = await client.db("aluperan_test").collection('alumnes');
  const r = await alumnes.insertOne(pick(alumne, ['nombre', 'celular', 'email']))
  return r.insertedId
}


export const put_alumne = async (update: EditarAlumne) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const r = await db.collection('alumnes').updateOne({ _id: update._id },
    pick(update, ['nombre', 'celular', 'email']))

  return r.acknowledged
}
