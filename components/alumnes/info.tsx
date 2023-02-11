import { Alumne } from "../../lib/api"
import { Enumerador } from "../general/enumerador"
import { Id } from "../general/id"

interface AlumneInfoProps {
  alumne: Alumne
}

export const InfoAlumne = ({ alumne }: AlumneInfoProps) => {

  return (
    <>
      <h2 className="text-2xl">{alumne.nombre}</h2>
      <hr />
      <Enumerador cabecera="Inscripciones:" coleccion={alumne.inscripciones} accesor={a => a.titulo} nodata='Sin inscripciones' />
      <Enumerador cabecera="Celular:" coleccion={alumne.celular ? [alumne.celular] : []} nodata='Sin celular' />
      <Enumerador cabecera="Mail:" coleccion={alumne.email ? [alumne.email] : []} nodata='Sin mail' />

      <Id id={alumne._id} />

    </>
  )
}


