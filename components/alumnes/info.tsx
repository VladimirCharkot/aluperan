import { Alumne } from "../../lib/api"
import { useBackend } from "../context/backend"
import { Enumerador } from "../general/display/enumerador"
import { Id } from "../general/display/id"
import { formatearHorarios } from "../../lib/utils"
import { useState } from "react"
import { PagosAlumne } from "./pagosAlum"
import { Boton } from "../general/input/boton"

interface AlumneInfoProps {
  alumne: Alumne
}

export const InfoAlumne = ({ alumne }: AlumneInfoProps) => {
  const { lkpInscripcionesAlumne, lkpTallerInscripcion } = useBackend()
  const inscripciones = lkpInscripcionesAlumne(alumne)

  const [viendoPagos, setViendoPagos] = useState(false)
  const toggleVerPagos = () => setViendoPagos(!viendoPagos)

  return (
    <>
      <h2 className="text-2xl">{alumne.nombre}</h2>
      <hr />
      <Enumerador cabecera="Inscripciones:" coleccion={inscripciones.filter(i => i.activa)} accesor={i => lkpTallerInscripcion(i) ? `${lkpTallerInscripcion(i).nombre} (${i.horarios ? formatearHorarios(i.horarios) : 'SIN HORARIOS'})` : 'Taller borrado'} nodata='Sin inscripciones' />
      <Enumerador cabecera="Celular:" coleccion={alumne.celular ? [alumne.celular] : []} nodata='Sin celular' />
      <Enumerador cabecera="Ficha médica:" coleccion={alumne.email ? [alumne.email] : []} nodata='Sin ficha médica' />
      {/* Nota 20/4/2024: Están usando el campo mail para ficha médica */}

      <Boton texto="Pagos" color="indigo" onClick={toggleVerPagos} />

      {viendoPagos && <PagosAlumne alumne={alumne}/>}
      {/* <Id id={alumne._id} /> */}

    </>
  )
}


