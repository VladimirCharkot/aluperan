import { useEffect, useState } from "react";
import { sortBy, uniq } from "lodash";

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

interface ModalPasarListaProps {
  taller: Taller,
  cerrar: () => void
}

export const ModalPasarLista = ({ taller, cerrar }: ModalPasarListaProps) => {
  const [hoy, setHoy] = useState(true)
  const { lkpInscripcionesTaller, lkpAlumneInscripcion } = useBackend()

  const nombres_alumnes_taller = sortBy(uniq(lkpInscripcionesTaller(taller).map(i => lkpAlumneInscripcion(i))), a => a.nombre)
  const toggleAsistencia = (_id: string) => {
    if (asistencias.includes(_id)) setAsistencias(asistencias.filter(id => id != _id))
    else setAsistencias([...asistencias, _id])
  }

  const [fecha, setFecha] = useState(new Date())
  const dia = dias_ids[fecha.getDay()]
  const horarios = taller.horarios.filter(h => h.dia == dia)
  const horarios_opciones = horarios.map(h => ({ v: h.hora, txt: h.hora }))
  const [horario, setHorario] = useState(horarios.length == 0 ? '' : horarios[0].hora)
  const [asistencias, setAsistencias] = useState<string[]>([])

  const texto_fecha = hoy ?
    `Hoy ${dias[dias_ids[fecha.getDay()]].toLowerCase()}` :   // "hoy martes"
    (horarios.length >= 1 ?
      `El ${dias[horarios[0].dia]} ${horarios[0].hora}` :     // "el jueves 14:00hs"
      `El ${dias[dias_ids[fecha.getDay()]]} ${fecha.toLocaleDateString('es-ES')}`) // "el lunes 13/02/23"


  useEffect(() => {
    setHorario(horarios.length == 0 ? '' : horarios[0].hora)
  }, [fecha])


  const { crearAsistencias } = useBackend();

  const post_asistencias = () => {
    const data: Omit<Asistencia, '_id'>[] = asistencias.map(a => ({
      alumne: a,
      taller: taller._id,
      horario: horario,
      fecha: fecha
    }))
    crearAsistencias(data).then(cerrar)
  }

  return (<Modal cerrar={cerrar}>
    <h2 className="text-lg">Asistencias {taller.nombre}</h2>
    <hr />

    <FlexR>
      <P>Fecha:</P>
      <P>Hoy</P>
      <Check checked={hoy} onClick={() => setHoy(!hoy)} />
    </FlexR>

    {!hoy && <DatePick fecha={fecha} setFecha={setFecha} shiftHoras={3} />}

    <hr />

    <FlexR>
      <P>Horario:</P>
      {horarios.length == 0 && <PError>No hay horarios de este taller para este día</PError>}
      {horarios.length == 1 && <P>{dias[horarios[0].dia]} {horarios[0].hora}</P>}
      {horarios.length > 1 && <Select opts={horarios_opciones} onChange={e => { setHorario(e.target.value) }} />}
    </FlexR>
    <hr />

    <P>{texto_fecha} asistieron:</P>
    <div>
      {nombres_alumnes_taller.map(a =>
        <FlexR key={a._id}>
          <Check checked={asistencias.includes(a._id)} onClick={() => toggleAsistencia(a._id)} />
          <P>{a.nombre}</P>
        </FlexR>)
      }
    </div>

    <Boton texto="Listo" color="emerald" onClick={post_asistencias} />

  </Modal>)
}