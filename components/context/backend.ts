import axios from 'axios';
import { find } from 'lodash';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

import { toast } from 'sonner';
import { AppContext } from '.';
import { Alumne, AlumnePost, Asistencia, Inscripcion, MongoId, Movimiento, MovimientoClaseSuelta, MovimientoInscripcion, MovimientoLiquidacionProfe, Taller } from '../../lib/api';
import { isInMonth } from '../../lib/utils';


export const endpoints = [
  '/api/alumnes/',
  '/api/talleres/',
  '/api/inscripciones/',
  '/api/movimientos/'
]


export const useBackend = () => {

  const {
    alumnes, setAlumnes,
    talleres, setTalleres,
    inscripciones, setInscripciones,
    movimientos, setMovimientos,
    asistencias, setAsistencias,
    ready, setReady
  } = useContext(AppContext);


  type Elem<T> = T & { _id: MongoId }                       // Todo elemento tiene Id
  type Coleccion<T> = Elem<T>[]                             // Toda coleccion es de Elems
  type Setter<T> = Dispatch<SetStateAction<Coleccion<T>>>   // Todo setter es de Colecciones
  type Updater<T> = (a: Elem<T>) => Partial<T>              // Todo updater tambien
  type ElemUpdater<T> = (_id: MongoId, upd: Updater<T>) => void

  type Hydrator<Dehydrated, Hydrated> = (arrival: Dehydrated, ...collections: any[]) => Hydrated


  const hydrateAlum: Hydrator<Alumne, Alumne> = a => a

  const hydrateInsc: Hydrator<Inscripcion, Inscripcion> = (i: Inscripcion) => ({
    ...i,
    iniciada: new Date(i.iniciada), baja: i.baja ? new Date(i.baja) : undefined
  })

  const hydrateTall: Hydrator<Taller, Taller> = (t: Taller) => ({
    ...t,
    iniciado: new Date(t.iniciado)
  })

  const hydrateMovi: Hydrator<Movimiento, Movimiento> = (m: Movimiento) =>
    m.razon == 'clase suelta' ? ({
      ...m,
      fecha: new Date(m.fecha),
      ocasion: new Date(m.ocasion)
    }) :
      m.razon == 'inscripcion' ? ({
        ...m,
        fecha: new Date(m.fecha),
        mes: new Date(m.mes)
      }) :
        m.razon == 'liquidacion profe' ? ({
          ...m,
          fecha: new Date(m.fecha),
          mes: new Date(m.mes),
        }) :
          {
            ...m, fecha: new Date(m.fecha)
          }

  const hydrateAsis = (a: Asistencia) => ({ ...a, fecha: new Date(a.fecha) })



  // *****************************
  // ** Wrappers para useState: **
  // *****************************


  // Recibe un setter y devuelve una función que agrega un elemento a la coleccion
  const addMember = <T>(setter: Setter<T>, hydrate: Hydrator<any, Elem<T>> = t => t) =>
    (elem: Elem<T>) => {
      // console.log(`Agregando a su colección:`)
      // console.log(hydrate(elem))
      setter(col => [...col, hydrate(elem)])
    }

  const addAlum = addMember(setAlumnes, hydrateAlum)
  const addTaller = addMember(setTalleres, hydrateTall)
  const addInscripcion = addMember(setInscripciones, hydrateInsc)
  const addMovimiento = addMember(setMovimientos, hydrateMovi)

  // Recibe una coleccion y un setter y devuelve una función
  // que recibe un _id y un updater y updatea el miembro de la coleccion con ese _id
  const updateMember = <T>(coleccion: Coleccion<T>, setter: Setter<T>) =>
    (_id: string, updater: Updater<T>) => {
      // console.log(`Buscando...`)
      // console.log(_id);
      const elem = find(coleccion, e => e._id == _id)!   // Warning
      // console.log(`Aplicando update...`)
      // console.log(updater(elem))
      const updated = { ...elem, ...updater(elem) }
      const resto = coleccion.filter(e => e._id != _id)
      // console.log(`El objeto queda:`)
      // console.log(updated)
      setter([...resto, updated])
    }

  const upsertMembers = <T>(prev: Coleccion<T>, incoming: Coleccion<T>): Coleccion<T> => {
    const newMap = new Map(prev.map(item => [item._id, item]));
    
    incoming.forEach(item => {
      newMap.set(item._id, item); // Sobreescribe si ID existe, agrega si no
    });

    return Array.from(newMap.values());
  };

  const updateAlum = updateMember(alumnes, setAlumnes)
  const updateTaller = updateMember(talleres, setTalleres)
  const updateInscripcion = updateMember(inscripciones, setInscripciones)
  const updateMovimiento = updateMember(movimientos, setMovimientos)

  const deleteMember = <T>(coleccion: Coleccion<T>, setter: Setter<T>) =>
    (_id: string) => {
      {
        // console.log(`Filtrando...`)
        // console.log(_id)
        setter(coleccion.filter(e => e._id != _id))
      }
    }

  const deleteMovimiento = deleteMember(movimientos, setMovimientos)


  // **********************************
  // ** Wrappers para backend calls: **
  // **********************************

  const traerElems = <T>(endpoint: string) =>
    async () => {
      try {
        console.log('-------------------')
        console.log(`GET ${endpoint}:`)
        const r = await axios.get<T[]>(endpoint)
        console.log(r.data)
        console.log('-------------------')
        return r.data
      } catch (err: any) { 
        toast.error('Error al traer datos!', { description: err.response.data.message })
      }
    }

  const crearElem = <TPost, TRet>(endpoint: string, adder: (elem: Elem<TRet>) => void) =>
    async (elem: TPost) => {
      try {
        console.log('-------------------')
        console.log(`POST ${endpoint}:`)
        console.log(elem)
        const r = await axios.post(endpoint, elem)
        console.log(r.data)
        console.log('-------------------')
        if (r.status == 200) { adder(r.data) }

      } catch (err: any) {
        toast.error('Error al crear!', { description: err.response.data.message })
      }
    }

  const editarElem = <T>(endpoint: string, updater: ElemUpdater<T>) =>
    async (edit: Elem<Partial<T>>) => {
      try {
        console.log('-------------------')
        console.log(`PUT ${endpoint}:`)
        console.log(edit)
        const r = await axios.put(endpoint, edit)
        console.log(r.data)
        console.log('-------------------')
        if (r.status == 200) { updater(edit._id, a => ({ ...a, ...edit })) }
      } catch (err: any) {
        toast.error('Error al editar!', { description: err.response.data.message })
      }
    }

  const eliminarElem = <T>(endpoint: string, deleter: (_id: string) => void) =>
    async (elem: Elem<T>) => {
      try {
        console.log('-------------------')
        console.log(`DELETE ${endpoint}:`)
        console.log(elem)
        const r = await axios.delete(endpoint, { data: { _id: elem._id } })
        console.log(r.data)
        console.log('-------------------')
        if (r.status == 200) { deleter(elem._id) }
      } catch (err: any) {
        toast.error('Error al eliminar!', { description: err.response.data.message })
      }
    }


  // Alumnes
  const alumnes_endpoint = '/api/alumnes/'
  const traerAlumnes = traerElems<Alumne>(alumnes_endpoint)
  const crearAlumne = crearElem<AlumnePost, Alumne>(alumnes_endpoint, addAlum)
  const editarAlumne = editarElem(alumnes_endpoint, updateAlum)

  // Talleres

  const talleres_endpoint = '/api/talleres/'
  const traerTalleres = traerElems<Taller>(talleres_endpoint)
  const crearTaller = crearElem(talleres_endpoint, addTaller)
  const editarTaller = editarElem(talleres_endpoint, updateTaller)

  // Inscripciones

  const inscripciones_endpoint = '/api/inscripciones/'
  const traerInscripciones = traerElems<Inscripcion>(inscripciones_endpoint)
  const crearInscripcion = crearElem(inscripciones_endpoint, addInscripcion)
  const editarInscripcion = editarElem(inscripciones_endpoint, updateInscripcion)

  // Movimientos

  const movimientos_endpoint = '/api/movimientos/'
  const traerMovimientos = traerElems<Movimiento>(movimientos_endpoint)
  const crearMovimiento = crearElem(movimientos_endpoint, addMovimiento)
  const editarMovimiento = editarElem(movimientos_endpoint, updateMovimiento)
  const eliminarMovimiento = eliminarElem(movimientos_endpoint, deleteMovimiento)

  // Asistencias

  const asistencias_endpoint = '/api/asistencias/'
  const traerAsistencias = async (taller: MongoId, mes: Date) => {
    const r = await axios.get(asistencias_endpoint, { params: { taller, mes } })
    const asists = r.data.map(hydrateAsis)
    if (r.status == 200) setAsistencias(asts => upsertMembers(asts, asists))
  }
  const crearAsistencias = async (asistencias: Omit<Asistencia, '_id'>[]) => {
    const r = await axios.post(asistencias_endpoint, asistencias)
    const asists = r.data.map(hydrateAsis)
    if (r.status == 200) setAsistencias(asts => upsertMembers(asts, asists))
  }

  const lkpMember = <T>(coleccion: Coleccion<T>) =>
    (_id: MongoId) => find(coleccion, e => e._id == _id)!
  const lkpMembers = <T>(coleccion: Coleccion<T>, accesor: (e: T) => string) =>
    (_id: MongoId) => coleccion.filter(e => accesor(e) == _id)

  const lkpInscripcionesAlumne = (a: Alumne) => lkpMembers(inscripciones, i => i.alumne)(a._id)
  const lkpInscripcionesActivasAlumne = (a: Alumne) => lkpInscripcionesAlumne(a).filter(i => i.activa)
  const lkpPagosAlumne = (a: Alumne) => lkpMembers(movimientos as any[], m => m.alumne)(a._id) as Movimiento[]
  const lkpTalleresAlumne = (a: Alumne) => lkpInscripcionesAlumne(a).filter(i => i.activa).map(i => lkpTallerInscripcion(i))//.filter(t => t.activo)

  const lkpAlumneInscripcion = (i: Inscripcion) => lkpMember(alumnes)(i.alumne)
  const lkpTallerInscripcion = (i: Inscripcion) => lkpMember(talleres)(i.taller)
  const lkpPagosInscripcion = (i: Inscripcion) => lkpMembers(movimientos as any[], m => m.inscripcion)(i._id) as Movimiento[]

  const lkpInscripcionesTaller = (t: Taller) => lkpMembers(inscripciones, i => i.taller)(t._id)
  const lkpAlumnesTaller = (t: Taller) => lkpInscripcionesTaller(t).filter(i => i.activa).map(i => lkpAlumneInscripcion(i))

  const lkpMovimientosTaller = (t: Taller) => lkpMembers(movimientos as any[], m => m.taller)(t._id) as Movimiento[]
  const lkpPagosTaller = (t: Taller) => lkpMovimientosTaller(t).filter(p => p.razon == "clase suelta" || p.razon == "inscripcion") as (MovimientoClaseSuelta | MovimientoInscripcion)[]
  const lkpLiquidacionesTaller = (t: Taller) => lkpMovimientosTaller(t).filter(p => p.razon == "liquidacion profe") as MovimientoLiquidacionProfe[]

  const lkpAsistenciasAlumneTallerMes = (ta: Taller, al: Alumne, mes: Date) => asistencias.filter(a => a.alumne == al._id && a.taller == ta._id && isInMonth(a.fecha, mes))
  const lkpInscripcionAlumneTaller = (a: Alumne, t: Taller) => find(lkpInscripcionesActivasAlumne(a), i => i.taller == t._id)!

  const lkpAlumne = lkpMember(alumnes)
  const lkpTaller = lkpMember(talleres)
  const lkpInscripcion = lkpMember(inscripciones)
  const lkpMovimiento = lkpMember(movimientos)
  const lkpAsistencia = lkpMember(asistencias)



  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (loaded) {
      console.log(`R e a d y ~ !`)
      // console.log(`Colecciones resultantes:`)
      // console.log(alumnes)
      // console.log(talleres)
      // console.log(inscripciones)
      // console.log(movimientos)
      setReady(true)
      //@ts-ignore
      window.alumnes = alumnes
      //@ts-ignore
      window.talleres = talleres
      //@ts-ignore
      window.inscripciones = inscripciones
      //@ts-ignore
      window.movimientos = movimientos
      //@ts-ignore
      window.asistencias = asistencias
    }
  }, [loaded])



  const pullBackend = async () => {

    console.log(`Trayendo alumnes...`)
    const raw_alumnes = await traerAlumnes()
    console.log(`Trayendo talleres...`)
    const raw_talleres = await traerTalleres()
    console.log(`Trayendo inscripciones...`)
    const raw_inscripciones = await traerInscripciones()
    console.log(`Trayendo movimientos...`)
    const raw_movimientos = await traerMovimientos()

    if (!raw_alumnes || !raw_talleres || !raw_inscripciones || !raw_movimientos) { console.error(`Error de red... alguna de las colecciones no llegó`); return; }

    setAlumnes(raw_alumnes.map(hydrateAlum))
    setTalleres(raw_talleres.map(hydrateTall))
    setInscripciones(raw_inscripciones.map(hydrateInsc))
    setMovimientos(raw_movimientos.map(hydrateMovi))

    setLoaded(true)
  }

  return {
    pullBackend, ready,
    alumnes, traerAlumnes, crearAlumne, editarAlumne,
    talleres, traerTalleres, crearTaller, editarTaller,
    inscripciones, traerInscripciones, crearInscripcion, editarInscripcion,
    movimientos, traerMovimientos, crearMovimiento, editarMovimiento, eliminarMovimiento,
    asistencias, traerAsistencias, crearAsistencias,
    lkpInscripcionesAlumne,
    lkpPagosAlumne,
    lkpAlumneInscripcion,
    lkpTallerInscripcion,
    lkpPagosInscripcion,
    lkpInscripcionesTaller,
    lkpAlumne,
    lkpTaller,
    lkpInscripcion,
    lkpMovimiento,
    lkpMovimientosTaller,
    lkpPagosTaller,
    lkpLiquidacionesTaller,
    lkpAsistenciasAlumneTallerMes,
    lkpTalleresAlumne,
    lkpAlumnesTaller,
    lkpInscripcionAlumneTaller,
    lkpInscripcionesActivasAlumne
  }

}
