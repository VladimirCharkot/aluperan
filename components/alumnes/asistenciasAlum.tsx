import { Alumne, Asistencia } from "@/lib/api";
import { dias_ids } from "@/lib/utils";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { useBackend } from "../context/backend";
import { Enumerador } from "../general/display/enumerador";
import { MesSelector } from "../general/input/mes";

export default function AsistenciasAlum({ alumne }: {
  alumne: Alumne
}) {
  const { lkpTallerInscripcion, lkpInscripcionesAlumne, traerAsistencias, lkpAsistenciasAlumneTallerMes } = useBackend()

  const inscripciones = lkpInscripcionesAlumne(alumne)

  const [mes, setMes] = useState(new Date())
  const talleresAlumne = inscripciones.filter(i => i.activa).map(i => lkpTallerInscripcion(i)).filter(t => t !== null)
  const asistenciasTalleres = talleresAlumne.map(ta => [ta.nombre, lkpAsistenciasAlumneTallerMes(ta, alumne, mes)] as [string, Asistencia[]])
  const asistanciasDisplay = asistenciasTalleres.map(([taller, asistencias]) => describirAsistencias(taller, asistencias))

  // Traer asistencias de la DB al cambiar mes
  useEffect(() => { talleresAlumne.forEach(t => traerAsistencias(t._id, mes)) }, [mes])

  return (
    <div className="flex flex-col p-2">
      <div className="flex gap-4"><span>Asistencias de </span><MesSelector mes={mes} setMes={setMes} /></div>
      <Enumerador cabecera="" coleccion={asistanciasDisplay} nodata='Sin asistencias' />
    </div>
  )
}

function describirAsistencias(taller: string, asistencias: Asistencia[]) {
  if (asistencias.length === 0) return `${taller}: sin asistencias`
  return <span>{taller}: {asistencias.length} asistencias <span className="text-black/40">({asistencias
    .toSorted((d1, d2) => d1.fecha.getTime() - d2.fecha.getTime())
    .map(d => `${capitalize(dias_ids[d.fecha.getDay()])} ${d.fecha.toLocaleDateString('es-ES').slice(0, -5)} ${d.horario}`)
    .join(', ')
  })</span></span>
}
