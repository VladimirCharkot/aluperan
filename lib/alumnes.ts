import clientPromise from "./mongodb";
import { Alumne, AlumnePost, AlumnePut } from "./api";
import { pick, isEmpty } from "lodash";
import { ObjectId } from "mongodb";

export const get_alumnes = async () => {
  const client = await clientPromise;
  const alumnes = await client.db("aluperan_test").collection('alumnes');

  const alums = await alumnes
    .aggregate([
      { $match: {$or: [{ activo: true }, { activo: undefined }]} },
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
  const r = await alumnes.insertOne({...alumne, activo: true})
  return {...alumne, _id: r.insertedId.toString(), activo: true, inscripciones: [], pagos: []}
}


export const put_alumne = async (update: AlumnePut) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  console.log(`Aplicando update...`)
  console.log(update)
  const r = await db.collection('alumnes').updateOne({ _id: new ObjectId(update._id) },
    {$set: pick(update, ['nombre', 'celular', 'email', 'activo'])})

  // Si se da de baja desactivamos también sus inscripciones
  if (update.activo == false){
    await db.collection('inscripciones').updateMany({ alumne: new ObjectId(update._id) },
    {$set: {activa: false, baja: new Date()}})
  }

  return r.acknowledged
}
