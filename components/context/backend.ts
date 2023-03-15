import { Dispatch, SetStateAction, useContext } from 'react';
import axios from 'axios';
import { find, uniqBy } from 'lodash';

import { Alumne, AlumnePost, Asistencia, AsistenciaMongo, Inscripcion, MongoId, Movimiento } from '../../lib/api';
import { AppContext } from '.';

export const useBackend = () => {

  const {
    alumnes, setAlumnes,
    talleres, setTalleres,
    inscripciones, setInscripciones,
    movimientos, setMovimientos,
    asistencias, setAsistencias
  } = useContext(AppContext);

  type Elem<T> = T & { _id: string }                        // Todo elemento tiene Id
  type Coleccion<T> = Elem<T>[]                             // Toda coleccion es de Elems
  type Setter<T> = Dispatch<SetStateAction<Coleccion<T>>>   // Todo setter es de Colecciones
  type Updater<T> = (a: Elem<T>) => Partial<T>              // Todo updater tambien
  type ElemUpdater<T> = (_id: string, upd: Updater<T>) => void

  // Recibe un setter y devuelve una función que agrega un elemento a la coleccion
  const addMember = <T>(setter: Setter<T>) => 
    (elem: Elem<T>) => {
      console.log(`Agregando:`)
      console.log(elem)
      setter(col => [...col, elem])
    }

  const addAlum = addMember(setAlumnes)
  const addTaller = addMember(setTalleres)
  const addInscripcion = addMember(setInscripciones)
  const addMovimiento = addMember(setMovimientos)

  // Recibe una coleccion y un setter y devuelve una función
  // que recibe un _id y un updater y updatea el miembro de la coleccion con ese _id
  const updateMember = <T>(coleccion: Coleccion<T>, setter: Setter<T>) => 
    (_id: string, updater: Updater<T>) => {
      console.log(`Buscando...`)
      console.log(_id);
      const elem = find(coleccion, e => e._id == _id)!   // Warning
      console.log(`Aplicando update...`)
      console.log(updater(elem))
      const updated = { ...elem, ...updater(elem) }
      const resto = coleccion.filter(e => e._id != _id)
      console.log(`El objeto queda:`)
      console.log(updated)
      setter([...resto, updated])
    }

  const updateAlum = updateMember(alumnes, setAlumnes)
  const updateTaller = updateMember(talleres, setTalleres)
  const updateInscripcion = updateMember(inscripciones, setInscripciones)
  const updateMovimiento = updateMember(movimientos, setMovimientos)


  const traerElems = <T>(endpoint: string, setter: Dispatch<SetStateAction<T[]>>) => 
    async () => {
      console.log('-------------------')
      console.log(`GET ${endpoint}:`)
      const r = await axios.get<T[]>(endpoint)
      console.log(r.data)
      console.log('-------------------')
      if (r.status == 200) { setter(r.data) } 
      // else flash msg
    }

  const crearElem = <TPost, TRet>(endpoint: string, adder: (elem: Elem<TRet>) => void) => 
    async (elem: TPost) => {
      console.log('-------------------')
      console.log(`POST ${endpoint}:`)
      console.log(elem)
      const r = await axios.post(endpoint, elem)
      console.log(r.data)
      console.log('-------------------')
      if (r.status == 200) { adder(r.data) }
      // else flash msg 
    }

  const editarElem = <T>(endpoint: string, updater: ElemUpdater<T>) => 
    async (edit: Elem<Partial<T>>, upd: Updater<T> = e => e) => {
      console.log('-------------------')
      console.log(`PUT ${endpoint}:`)
      console.log(edit)
      const r = await axios.put(endpoint, edit)
      console.log(r.data)
      console.log('-------------------')
      if(r.status == 200){ updater(edit._id, upd) } 
      // else flash msg
    }


  // Alumnes
  const alumnes_endpoint = '/api/alumnes/'
  const traerAlumnes = traerElems(alumnes_endpoint, setAlumnes)
  const crearAlumne = crearElem<AlumnePost, Alumne>(alumnes_endpoint, addAlum)
  const editarAlumne = editarElem(alumnes_endpoint, updateAlum)

  // Talleres

  const talleres_endpoint = '/api/talleres/'
  const traerTalleres = traerElems(talleres_endpoint, setTalleres)
  const crearTaller = crearElem(talleres_endpoint, addTaller)
  const editarTaller = editarElem(talleres_endpoint, updateTaller)

  // Inscripciones

  const inscripciones_endpoint = '/api/inscripciones/'
  const traerInscripciones = traerElems(inscripciones_endpoint, setInscripciones)
  const crearInscripcion = crearElem(inscripciones_endpoint, (insc: Inscripcion) => {
    addInscripcion(insc)
    updateAlum(insc.alumne._id, a => ({inscripciones: [...a.inscripciones, insc]}))
    updateTaller(insc.taller._id, t => ({inscripciones: [...t.inscripciones, insc]}))
  })
  const editarInscripcion = editarElem(inscripciones_endpoint, updateInscripcion)

  // Movimientos

  const movimientos_endpoint = '/api/movimientos/'
  const traerMovimientos = traerElems(movimientos_endpoint, setMovimientos)
  const crearMovimiento = crearElem(movimientos_endpoint, (mov: Movimiento) => {
    addMovimiento(mov)
    if(mov.razon == "inscripcion" && mov.inscripcion){
      updateInscripcion(mov.inscripcion._id, i => ({pagos: [...i.pagos, mov]}))
      updateAlum(mov.inscripcion.alumne._id, a => ({pagos: [...a.pagos, mov]}))
    }
  })
  const editarMovimiento = editarElem(movimientos_endpoint, updateMovimiento)

  // Asistencias

  const asistencias_endpoint = '/api/asistencias/'
  const traerAsistencias = async (taller: MongoId, mes: Date) => {
    const r = await axios.get(asistencias_endpoint, {params: {taller, mes}})
    if (r.status == 200) setAsistencias(asts => [...asts, ...r.data])
  }
  const crearAsistencias = async (asistencias: Omit<Asistencia, '_id'>[]) => {
    const r = await axios.post(asistencias_endpoint, asistencias)
    if (r.status == 200) setAsistencias(asts => [...asts, ...r.data])
  }

  return {
    alumnes, traerAlumnes, crearAlumne, editarAlumne,
    talleres, traerTalleres, crearTaller, editarTaller,
    inscripciones, traerInscripciones, crearInscripcion, editarInscripcion,
    movimientos, traerMovimientos, crearMovimiento, editarMovimiento,
    asistencias, traerAsistencias, crearAsistencias
  }

}
