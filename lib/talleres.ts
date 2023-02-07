import { AlumneType } from "./alumnes";
import { InscripcionType } from "./inscripciones";
import clientPromise from "./mongodb";
import { ObjectId } from 'mongodb';
import { find } from "lodash";

type DiaSemana = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'

export interface TallerPost{
  nombre: string,
  dias: DiaSemana[],
  precios: number[]  // 0: clase suelta, 1: 1 día/sem, 2: 2 días/sem, etc,
  profe: string,
  inscripciones?: InscripcionType[]
}

export interface TallerType extends TallerPost{
  _id: string
}

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
          as: "inscripciones"
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
          nombre: 1, dias: 1, precios: 1, profe: 1, 
          'inscripciones.alumne': '$inscripciones.alumne.nombre',
          'inscripciones.iniciada': 1,
          _id: 0
        }
      },
      {
        $group: {
          _id: {
            nombre: "$nombre",
            dias: "$dias",
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
          _id: 0,
          nombre: "$_id.nombre",
          dias: "$_id.dias",
          precios: "$_id.precios",
          profe: "$_id.profe",
          inscripciones: 1
        }
      }
    ])
    .toArray() as TallerType[];

  return talleres
}


export const post_taller = async (taller: TallerPost) => {
  const client = await clientPromise;
  const db = client.db("aluperan_test");

  const query = {nombre: taller.nombre}
  const update = {$set : taller}

  const r = await db.collection('talleres').updateOne(query, update, {upsert: true})

  return r.upsertedId
}