import { Alumne, AlumneDel, AlumneMongo, AlumnePost, AlumnePut } from "../api";
import { pick, isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { Almacen } from "./almacen";

export class AlmacenAlumnes extends Almacen<AlumneMongo> {

  public static async build() { return new AlmacenAlumnes() }

  constructor(){ super('alumnes') }

  async getAllJoined() {
    return await super.getAll()
  }

  async create(alum: AlumnePost) {
    const limpio = pick(alum, ['_id', 'nombre', 'celular', 'email'])
    return super.create({ ...limpio, activo: true })
  }

  async update(update: AlumnePut) {
    // Si desactivamos alumne, desactivamos también sus inscripciones
    const _id = new ObjectId(update._id)

    if (update.activo == false) {
      (await this.sibling('inscripciones')).updateMany({
        alumne: _id
      }, {
        $set: { activa: false, baja: new Date() }
      })
    }

    const limpio = pick(update, ['_id', 'nombre', 'celular', 'email', 'activo'])
    return super.update(limpio)
  }

}

export let almacenAlumnes: AlmacenAlumnes
AlmacenAlumnes.build().then(a => almacenAlumnes = a)


