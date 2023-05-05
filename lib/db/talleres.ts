import { Taller, TallerMongo, TallerPost, TallerPut } from '../api';
import { pick, isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { Almacen } from "./almacen";


export class AlmacenTalleres extends Almacen<TallerMongo>{
  public static async build() { return new AlmacenTalleres() }

  constructor() { super('talleres') }

  async getAllJoined() {
    return await super.getAll()
  }

  async create(taller: TallerPost){
    return await super.create({
      ...pick(taller, ['nombre', 'precios', 'profe', 'horarios', 'iniciado']),
      iniciado: taller.iniciado ?? new Date(),
      activo: true,
      inscripciones: []
    }) 
  }

  async update(updates: TallerPut){

    const _id = new ObjectId(updates._id)
    const r = super.update({_id, ...pick(updates, ['nombre', 'precios', 'profe', 'horarios', 'activo'])})

    // Si se da de baja desactivamos también sus inscripciones
    if (updates.activo == false) {
      (await this.sibling('inscripciones')).updateMany({ taller: new ObjectId(updates._id) }, { $set: { activa: false, baja: new Date() } })
    }
  }
}

export let almacenTalleres: AlmacenTalleres
AlmacenTalleres.build().then(a => almacenTalleres = a)

