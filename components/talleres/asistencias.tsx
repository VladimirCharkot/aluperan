import { Asistencia, Taller } from "../../lib/api"
import { getDaysInMonth, isSameDay } from "date-fns"
import { range, find } from "lodash"
import { useEffect } from "react"
import { useBackend } from "../context/backend"

interface GrillaAsistenciasProps {
  taller: Taller,
  asistencias: Asistencia[]
}

export const GrillaAsistencias = ({ taller, asistencias }: GrillaAsistenciasProps) => {
  const hoy = new Date()
  const mes = hoy.getMonth()
  const año = hoy.getFullYear()
  const daysInMonth = getDaysInMonth(hoy)

  const { lkpInscripcionesTaller, lkpAlumneInscripcion } = useBackend()

  return (<div className='grid items-center justify-items-center gap-y-1 my-4' style={{
    gridTemplateColumns: `1fr repeat(${daysInMonth}, minmax(0, 1fr))`
  }}>
    <div></div>
    {range(daysInMonth).map(n => <p className="text-xs">{n + 1}</p>)}
    {lkpInscripcionesTaller(taller).map(i => 
      <>
        <p className="text-xs">{lkpAlumneInscripcion(i).nombre}</p>
        {range(daysInMonth).map(n => <p className="text-xs">{
          find(asistencias, a => a.taller == taller._id && a.alumne == lkpAlumneInscripcion(i)._id && isSameDay(new Date(a.fecha), new Date(año, mes, n+1))) ? 
            '✓' : ''
        }</p>)}
      </>
    )}
  </div>)
}
// ✓