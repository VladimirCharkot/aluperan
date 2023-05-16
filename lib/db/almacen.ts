import clientPromise from "./mongodb";
import { ObjectId, Db, MongoClient, Collection } from "mongodb";
import { omit, pick } from 'lodash';
import { AlumneMongo, AsistenciaMongo, InscripcionMongo, Movimiento, MovimientoMongo, TallerMongo } from "../api";

type Metodo = 'get' | 'post' | 'put'

export class Almacen<MongoT> {
  private cliente: Promise<MongoClient>;

  constructor(private nombre_coleccion: string) {
    console.log(`Inicializando Almacen ${nombre_coleccion}`)
    this.cliente = clientPromise
  }

  async sibling(nombre_otra_coleccion: string){
    return (await this.cliente).db(process.env.DB_NAME).collection(nombre_otra_coleccion) 
  }

  async coleccion(): Promise<Collection> {
    return (await this.cliente).db(process.env.DB_NAME).collection(this.nombre_coleccion)
  }

  async aggregate(pipeline: any[]){
    return await (await this.coleccion()).aggregate(pipeline).toArray()
  }

  async getMany(busqueda: any){
    return await (await this.coleccion()).find(busqueda).toArray()
  }

  async getOne(busqueda: any): Promise<any> {
    return await (await this.coleccion()).findOne(busqueda)
  }

  async getAll() {
    return await (await this.coleccion()).find().toArray()
  }

  async update(update: any): Promise<any> {
    const r = await (await this.coleccion()).updateOne({_id: new ObjectId(update._id)}, { $set: omit(update, ['_id']) } )
    return await this.getOne({id: r.upsertedId})
  }

  async updateMany(updates: any[]){
    return updates.map(this.update)
  }

  async create(post: any) {
    const r = await (await this.coleccion()).insertOne(post)
    return (await this.getOne({ _id: r.insertedId }))
  }

  async createMany(posts: any[]){
    return await Promise.all(posts.map(p => this.create(p)))
  }

  async delete(del: any) {
    console.log(`Borrando ${del._id} de ${await this.coleccion()}`)
    const r = await (await this.coleccion()).deleteOne({ _id: new ObjectId(del._id) })
    return {ok: r.acknowledged}
  }

}




