import clientPromise from "./mongodb";
import { Alumne, AlumnePost, AlumnePut } from "./api";
import { pick, isEmpty } from "lodash";
import { ObjectId } from "mongodb";

export const get_alumnes = async () => {
  const client = await clientPromise;
  const alumnes = await client.db("aluperan_test").collection('alumnes');

  const alums = await alumnes
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
        $unwind: {path: "$inscripciones", preserveNullAndEmptyArrays: true}
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
        $unwind: {path: "$inscripciones.taller", preserveNullAndEmptyArrays: true}
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

    alums.forEach(a => {
      if(isEmpty(a.inscripciones[0])){
        a.inscripciones = []
      }
    })

    return alums
}



export const post_alumne = async (alumne: AlumnePost): Promise<Alumne> => {
  const client = await clientPromise;
  const alumnes = await client.db("aluperan_test").collection('alumnes');
  const r = await alumnes.insertOne(alumne)
  return {...alumne, _id: r.insertedId.toString(), inscripciones: [], pagos: []}
}


export const put_alumne = async (update: AlumnePut) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const r = await db.collection('alumnes').updateOne({ _id: new ObjectId(update._id) },
    {$set: pick(update, ['nombre', 'celular', 'email'])})

  return r.acknowledged
}
