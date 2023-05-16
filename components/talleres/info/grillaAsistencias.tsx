import { Asistencia, Taller } from "../../../lib/api"
import { getDaysInMonth, isSameDay, set } from "date-fns"
import { range, find, some, capitalize } from "lodash"
import { useBackend } from "../../context/backend"
import { diasMesHorario, diasMesTaller, dias_ids } from "../../../lib/utils"
import { P } from "../../general/display/p"

interface GrillaAsistenciasProps {
  taller: Taller,
  mes: Date
}

const Ps = ({ children }: any) => <p className="text-xs">{children}</p>

export const GrillaAsistencias = ({ taller, mes }: GrillaAsistenciasProps) => {
  const { lkpInscripcionesTaller, lkpAlumneInscripcion, lkpAsistenciasAlumneTallerMes } = useBackend()

  // const dias = diasMesTaller(taller, mes)
  const inscripciones = lkpInscripcionesTaller(taller).filter(i => i.activa)
  console.log(taller.nombre)
  return (

    taller.horarios.map(h => {
      const dias = diasMesHorario(h, mes)
      const inscripciones_horario = inscripciones.filter(i => i.horarios ? some(i.horarios, hi => hi.dia == h.dia && hi.hora == h.hora) : false)
      return (<>
        <P>{capitalize(h.dia)} {h.hora}</P>
        <div className='grid items-center justify-items-center gap-y-1 my-4' style={{
          gridTemplateColumns: `1fr repeat(${dias.length}, minmax(0, 1fr))`
        }}>

          {/* Header */}
          <div></div>
          {dias.map(d => <div className={isSameDay(d, new Date()) ? "rounded-3xl border border-black border-dashed p-2" : ""}><Ps>{dias_ids[d.getDay()]}</Ps><Ps>{d.getDate()}</Ps></div>)}

          {/* Grilla */}
          {inscripciones_horario.map(i => {
            const alumne = lkpAlumneInscripcion(i)
            const asistenciasAlumneMes = lkpAsistenciasAlumneTallerMes(taller, alumne, mes)
            // console.log(`Asistencias de ${alumne.nombre} a ${taller.nombre}`)
            // console.log(asistenciasAlumneMes)
            return (<>
              <Ps>{alumne.nombre}</Ps>
              {dias.map(dia => <p className="text-xs">{
                find(asistenciasAlumneMes, a => isSameDay(a.fecha, dia)) ? '✓' : ''
              }</p>)}
            </>)
          })}

        </div>
      </>)
    })


  )
}
// ✓