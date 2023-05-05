import { ObjectId } from "mongodb";
import { AsistenciaMongo, AsistenciaPost } from "../api";
import { startOfMonth, endOfMonth, isAfter, isBefore, isEqual } from "date-fns";
import { Almacen } from "./almacen";

export class AlmacenAsistencias extends Almacen<AsistenciaMongo>{
  public static async build() { return new AlmacenAsistencias() }

  constructor(){ super('asistencias') }

  async getForTaller(taller: string, mes?: Date) {

    let asistencias = await (await this.coleccion()).find({ taller: new ObjectId(taller) })
      .toArray() as AsistenciaMongo[]

    if (mes) {
      const som = startOfMonth(mes)
      const eom = endOfMonth(mes)
      asistencias = asistencias.filter(a => isEqual(a.fecha, som) || (isAfter(a.fecha, som) && isBefore(a.fecha, eom)))
    }

    return asistencias
  }

  async create(asistencias: AsistenciaPost[]){
    return super.createMany(asistencias.map(a => ({...a, alumne: new ObjectId(a.alumne), taller: new ObjectId(a.taller)})))
  }

}

export let almacenAsistencias: AlmacenAsistencias
AlmacenAsistencias.build().then(a => almacenAsistencias = a)
