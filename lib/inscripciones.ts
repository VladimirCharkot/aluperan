import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { AlumneType } from "./alumnes";
import { TallerType } from "./talleres";
import { last } from "lodash";
import internal from "stream";
import alumnes from "../pages/api/alumnes";

export interface TarifaType{
  iniciada: Date,
  monto: number
}

export interface PagoType{
  fecha: Date,
  monto: number
}

export interface InscripcionBase{
  activa?: boolean,
  titulo?: string,
  tarifas?: TarifaType[]  // how do i describe dict with Date keys
  iniciada: Date,
  baja?: Date,
  descuentos?: TarifaType[],
  pagos?: PagoType[],
}

export interface InscripcionPost extends InscripcionBase{
  alumne: string,
  taller: string
}

export interface InscripcionType extends InscripcionBase{
  _id: string,
  alumne: AlumneType,
  taller: TallerType
}

export const get_inscripciones = async () => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const inscripciones = await db
    .collection<InscripcionType>("inscripciones")
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
        $lookup: {
          from: "movimientos",
          localField: "_id",
          foreignField: "inscripcion",
          as: "pagos"
        }
      },
    ])
    .toArray();

  return inscripciones
}

export const post_inscripcion = async (inscripcion: InscripcionPost) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test")

  const alumne = await db.collection<AlumneType>("alumnes").findOne({_id: new ObjectId(inscripcion.alumne) as any})
  const taller = await db.collection<TallerType>("talleres").findOne({_id: new ObjectId(inscripcion.taller) as any})
  const titulo = alumne && taller ? `${alumne.nombre} - ${taller.nombre} (${taller.dias.join(', ')})` : `???`
  console.log(last(taller?.precios))
  const query = {titulo}
  const update = {$set : {...inscripcion,
    activa: inscripcion.activa === undefined || inscripcion.activa,
    iniciada: inscripcion.iniciada ? new Date(inscripcion.iniciada) : new Date(),
    alumne: new ObjectId(inscripcion.alumne),
    taller: new ObjectId(inscripcion.taller),
    tarifas: inscripcion.tarifas ? 
      inscripcion.tarifas.map(t => ({...t, iniciada: new Date(t.iniciada)})) 
      : [{monto: last(taller?.precios), iniciada: new Date()}],
    titulo
  }}

  const r = await db.collection('inscripciones').updateOne(query, update, {upsert: true})

  return r.upsertedId
}