import { Alumne } from "../../lib/api"
import { useBackend } from "../context/backend"
import { Enumerador } from "../general/display/enumerador"
import { Id } from "../general/display/id"

interface AlumneInfoProps {
  alumne: Alumne
}

export const InfoAlumne = ({ alumne }: AlumneInfoProps) => {
  const { lkpInscripcionesAlumne, lkpTallerInscripcion } = useBackend()
  return (
    <>
      <h2 className="text-2xl">{alumne.nombre}</h2>
      <hr />
      <Enumerador cabecera="Inscripciones:" coleccion={lkpInscripcionesAlumne(alumne)} accesor={i => `${lkpTallerInscripcion(i).nombre} (${i.dias})`} nodata='Sin inscripciones' />
      <Enumerador cabecera="Celular:" coleccion={alumne.celular ? [alumne.celular] : []} nodata='Sin celular' />
      <Enumerador cabecera="Mail:" coleccion={alumne.email ? [alumne.email] : []} nodata='Sin mail' />

      <Id id={alumne._id} />

    </>
  )
}


