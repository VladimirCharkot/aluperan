import { ObjectId } from "mongodb";
import { AsistenciaMongo, AsistenciaPost } from "../api";
import { startOfMonth, endOfMonth, isAfter, isBefore, isEqual } from "date-fns";
import { Almacen } from "./almacen";
import { isInMonth } from "../utils";

export class AlmacenAsistencias extends Almacen<AsistenciaMongo>{
  public static async build() { return new AlmacenAsistencias() }

  constructor() { super('asistencias') }

  async getForTaller(taller: string, mes?: Date) {

    let asistencias = await (await this.coleccion()).find({ taller: new ObjectId(taller) })
      .toArray() as AsistenciaMongo[]

    // Un poco subóptimo traer todas y después filtrar pero we
    if (mes) asistencias = asistencias.filter(a => isInMonth(new Date(a.fecha), mes))

    return asistencias
  }

  async createMany(asistencias: AsistenciaPost[]) {
    const asis = asistencias.map(a => ({ ...a, alumne: new ObjectId(a.alumne), taller: new ObjectId(a.taller) }))
    return await super.createMany(asis)
  }

}

export let almacenAsistencias: AlmacenAsistencias
AlmacenAsistencias.build().then(a => almacenAsistencias = a)
