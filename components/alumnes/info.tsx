import { useState } from "react"
import { Alumne } from "../../lib/api"
import { formatearHorarios } from "../../lib/utils"
import { useBackend } from "../context/backend"
import { Enumerador } from "../general/display/enumerador"
import { Boton } from "../general/input/boton"
import AsistenciasAlum from "./asistenciasAlum"
import { PagosAlumne } from "./pagosAlum"

interface AlumneInfoProps {
  alumne: Alumne
}

export const InfoAlumne = ({ alumne }: AlumneInfoProps) => {
  const { lkpInscripcionesAlumne, lkpTallerInscripcion, lkpAsistenciasAlumneTallerMes, traerAsistencias } = useBackend()
  const inscripciones = lkpInscripcionesAlumne(alumne)

  const [viendoPagos, setViendoPagos] = useState(false)
  const toggleVerPagos = () => setViendoPagos(!viendoPagos)

  const [viendoAsistencias, setViendoAsistencias] = useState(false)
  const toggleVerAsistencias = () => setViendoAsistencias(!viendoAsistencias)

  return (
    <>
      <h2 className="text-2xl">{alumne.nombre}</h2>
      <hr />
      <Enumerador cabecera="Inscripciones:" coleccion={inscripciones.filter(i => i.activa)} accesor={i => lkpTallerInscripcion(i) ? `${lkpTallerInscripcion(i).nombre} (${i.horarios ? formatearHorarios(i.horarios) : 'SIN HORARIOS'})` : 'Taller borrado'} nodata='Sin inscripciones' />
      <Enumerador cabecera="Celular:" coleccion={alumne.celular ? [alumne.celular] : []} nodata='Sin celular' />
      <Enumerador cabecera="Ficha médica:" coleccion={alumne.ficha ? ['✓'] : ['✗']} nodata='Sin ficha médica' />
 
      <div className="flex gap-4">
        <Boton texto="Asistencias" color="indigo" onClick={toggleVerAsistencias} />
        <Boton texto="Pagos" color="indigo" onClick={toggleVerPagos} />
      </div>

      {viendoPagos && <PagosAlumne alumne={alumne}/>}
      { viendoAsistencias && <AsistenciasAlum alumne={alumne} /> }
      {/* <Id id={alumne._id} /> */}

    </>
  )
}


