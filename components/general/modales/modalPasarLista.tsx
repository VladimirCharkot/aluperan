import { useEffect, useState } from "react";
import { some, sortBy, uniq } from "lodash";

import { Modal } from "../display/modal"
import { PError } from "../display/perror";
import { P } from "../display/p";
import { FlexR } from "../display/flexR";

import { Boton } from "../input/boton";
import { Check } from "../input/checkbox";
import { Select } from "../input/select";

import { dias, dias_ids } from "../../../lib/utils";
import { Taller, Asistencia } from "../../../lib/api";
import { useBackend } from "../../context/backend";
import { DatePick } from "../input/date";
import { Icon } from "@iconify/react";

interface ModalPasarListaProps {
  taller: Taller,
  cerrar: () => void
}

export const ModalPasarLista = ({ taller, cerrar }: ModalPasarListaProps) => {
  const [verTodos, setVerTodos] = useState(false)
  const toggleVerTodos = () => setVerTodos(!verTodos)

  const [hoy, setHoy] = useState(true)
  const [fecha, setFecha] = useState(new Date())
  const dia = dias_ids[fecha.getDay()]

  const { lkpInscripcionesTaller, lkpAlumneInscripcion, crearAsistencias } = useBackend()


  // const nombres_alumnes_taller = sortBy(uniq(lkpInscripcionesTaller(taller).map(i => lkpAlumneInscripcion(i))), a => a.nombre)

  const toggleAsistencia = (_id: string) => {
    if (asistencias.includes(_id)) setAsistencias(asistencias.filter(id => id != _id))
    else setAsistencias([...asistencias, _id])
  }

  const horarios = sortBy(taller.horarios.filter(h => h.dia == dia), h => h.hora)
  const horarios_opciones = horarios.map(h => ({ v: h.hora, txt: h.hora }))
  const [horario, setHorario] = useState(horarios.length == 0 ? '' : horarios[0].hora)
  const [asistencias, setAsistencias] = useState<string[]>([])

  const texto_fecha = hoy ?
    `Hoy ${dias[dia].toLowerCase()}` :   // "hoy martes"
    (horarios.length >= 1 ?
      `El ${dias[horarios[0].dia]} ${fecha.toLocaleDateString('es-ES')} ${horario}` :     // "el jueves 14:00hs"
      `El ${dias[dia]} ${fecha.toLocaleDateString('es-ES')}`) // "el lunes 13/02/23"


  useEffect(() => {
    setHorario(horarios.length == 0 ? '' : horarios[0].hora)
  }, [fecha])

  const post_asistencias = () => {
    const data: Omit<Asistencia, '_id'>[] = asistencias.map(a => ({
      alumne: a,
      taller: taller._id,
      horario: horario,
      fecha: fecha
    }))
    console.log(`Posteando...`)
    console.log(data)
    crearAsistencias(data).then(cerrar)
  }


  const inscripciones = lkpInscripcionesTaller(taller).filter(i => i.activa)
  const inscripcionesEsteHorario = inscripciones.filter(i => some(i.horarios, h => h.dia == dia && h.hora == horario))
  const inscripcionesOtrosHorarios = inscripciones.filter(i => !some(i.horarios, h => h.dia == dia && h.hora == horario))


  return (<Modal cerrar={cerrar}>
    <h2 className="font-bold text-2xl p-2 rounded-xl">Asistencias <span className="font-extrabold">{taller.nombre}</span></h2>
    <div className="flex flex-col items-center m-4">
      <div className=" w-full mb-4">
        <FlexR>
          <div className="flex items-baseline gap-4">
            <p className="text-lg font-extrabold">Fecha:</p>
            <div className="flex flex-col gap-1">
              <p className="flex gap-2 items-center">Hoy <Check checked={hoy} onClick={() => setHoy(!hoy)} />
              </p>
              {!hoy && <DatePick fecha={fecha} setFecha={setFecha} shiftHoras={3} />}
            </div>
          </div>
        </FlexR>


        <FlexR>
          <div className="flex items-baseline gap-4">
            <p className="text-lg font-extrabold">Horario:</p>
            {horarios.length == 0 && <PError>No hay horarios de este taller para este día</PError>}
            {horarios.length == 1 && <P>{dias[horarios[0].dia]} {horarios[0].hora}</P>}
            {horarios.length > 1 && <Select opts={horarios_opciones} onChange={e => { setHorario(e.target.value) }} />}
          </div>
        </FlexR>

        <hr className="my-2" />

        <div className="flex flex-col gap-2 my-4">
          <p className="font-bold">{texto_fecha} asistieron:</p>
          {inscripcionesEsteHorario.map(i => {
            const a = lkpAlumneInscripcion(i)
            return (<FlexR key={i._id}>
              <p className="flex gap-2">
                <Check checked={asistencias.includes(a._id)} onClick={() => toggleAsistencia(a._id)} />
                {a.nombre}
              </p>
            </FlexR>)
          })}
        </div>


        {verTodos && <div className="text-slate-500">
          {/* <p className="font-bold"> (No inscritos)</p> */}
          {inscripcionesOtrosHorarios.map(i => {
            const a = lkpAlumneInscripcion(i)
            return (<FlexR key={i._id}>
              <p className="flex gap-2 ">

                <Check checked={asistencias.includes(a._id)} onClick={() => toggleAsistencia(a._id)} />
                {a.nombre}</p>
            </FlexR>)
          })}
        </div>}

        <Boton texto="Ver todos" color="indigo" onClick={toggleVerTodos} />
      </div>
      <Boton texto="Aceptar" color="emerald" onClick={post_asistencias} />
    </div>
  </Modal>)
}