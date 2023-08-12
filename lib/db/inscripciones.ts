import { ObjectId } from "mongodb";
import { InscripcionPut, InscripcionPost, InscripcionMongo } from "../api";
import { pick, find } from "lodash";
import { Almacen } from "./almacen";
import { almacenAlumnes } from "./alumnes";
import { almacenTalleres } from "./talleres";


export class AlmacenInscripciones extends Almacen<InscripcionMongo>{
  public static async build() { return new AlmacenInscripciones() }

  constructor(){ super('inscripciones') }

  async getAllJoined() {
    return await super.getAll()
  }

  async create(inscripcion: InscripcionPost) {
    const id_alumne = new ObjectId(inscripcion.alumne)
    const id_taller = new ObjectId(inscripcion.taller)
    const alumne = almacenAlumnes.getOne({ _id: id_alumne })
    const taller = almacenTalleres.getOne({ _id: id_taller })

    if (!alumne) return { ok: false, mensaje: `Intentando crear inscripcion para alumne ${inscripcion.alumne}, que no existe` }
    if (!taller) return { ok: false, mensaje: `Intentando crear inscripcion para taller ${inscripcion.taller}, que no existe` }

    const insc = {
      activa: true,
      horarios: inscripcion.horarios ?? [],
      iniciada: inscripcion.iniciada ?? new Date(),
      alumne: id_alumne,
      taller: id_taller,
      // tarifas: [{ monto: last(taller!.precios), iniciada: new Date() }]
    }

    return super.create(insc)

  }

  async update(update: InscripcionPut) {
    const _id = new ObjectId(update._id)
    let r = await super.update({_id, ...pick(update, ['activa', 'iniciada', 'horarios'])})
    if (update.activa === false) { r = await super.update({ _id, baja: new Date() }) }
    // if (update.tarifa) { return (await ins.updateOne({ _id: _id }, { $push: { tarifas: update.tarifa } })).upsertedId }
    return r
  }

  async purgar(){
    // Ineficiente, mejorar con pipeline
    // Inscripciones que apuntan a un taller o alumne que ya no existe
    const all_inscripciones = await this.getAllJoined()
    const all_talleres = await almacenTalleres.getAllJoined()
    const all_alumnes = await almacenAlumnes.getAllJoined()

    const defectuosas = (await all_inscripciones).filter(i => 
      !find(all_alumnes, a => i.alumne.equals(a._id)) || !find(all_talleres, t => i.taller.equals(t._id))
    )

    defectuosas.forEach(async i => {
      if(!find(all_alumnes, a => i.alumne.equals(a._id)))
        console.log(`Inscripcion defectuosa ${i._id}, no existe alumne ${i.alumne}, borrando...`)
      if(!find(all_talleres, t => i.taller.equals(t._id)))
        console.log(`Inscripcion defectuosa ${i._id}, no existe taller ${i.taller}, borrando...`)
      if(await this.delete(i)) console.log('...ok')
    })
  }

}

export let almacenInscripciones: AlmacenInscripciones
AlmacenInscripciones.build().then(a => almacenInscripciones = a)
