import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import { Asistencia, AsistenciaMongo, AsistenciaPost } from "./api";
import { startOfMonth, endOfMonth, isAfter, isBefore, isEqual } from "date-fns";


export const get_asistencias = async (taller: string, mes?: Date) => {
  const client = await clientPromise;
  const db = client.db("aluperan");

  let asistencias: AsistenciaMongo[] = []
  if (taller) {
    console.log(`Buscando asistencias para taller ${taller}`)
    asistencias = await db
      .collection("asistencias")
      .find({ taller: new ObjectId(taller) })
      .toArray() as AsistenciaMongo[] 
  }

  if (mes) {
    const som = startOfMonth(mes)
    const eom = endOfMonth(mes)
    console.log(`Filtrando asistencias entre ${som} y ${eom} (fecha ${mes})`)
    return asistencias?.filter(a => {
      const f = new Date(a.fecha)
      return isEqual(f, som) || (isAfter(f, som) && isBefore(f, eom))
    })
  }

  return asistencias
}

export const post_asistencias = async (asistencias: AsistenciaPost[]) => {
  const client = await clientPromise;
  const db = client.db("aluperan");

  let insertadas: AsistenciaMongo[] = []
  for (const asistencia of asistencias) {
    const doc = {
      ...asistencia,
      alumne: new ObjectId(asistencia.alumne),
      taller: new ObjectId(asistencia.taller)
    }
    const r = await db.collection('asistencias').insertOne(doc)
    insertadas.push({ ...doc, _id: r.insertedId });
  }

  return insertadas
}