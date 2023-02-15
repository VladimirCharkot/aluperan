import { Taller } from "../../lib/api"
import { Id } from "../general/id"
import { dias, dias_semana } from "../../lib/utils"
import { Enumerador } from "../general/enumerador"
import { Horario } from "../../lib/api"
import { range } from "lodash"

interface InfoTallerProps {
  taller: Taller
}

export const InfoTaller = ({ taller }: InfoTallerProps) => {
  return (<>
    <h2 className="text-2xl">{taller.nombre} - {taller.profe}</h2>
    <hr />

    <Enumerador cabecera="Horarios:" coleccion={taller.horarios} accesor={(h: Horario) => `${dias[h.dia]} ${h.hora}`} nodata='Sin horarios' />
    <Enumerador cabecera="Precios:" coleccion={taller.precios.map((c, i) => `${dias_semana[i]}: $${c}`)} nodata='Sin precios' />
    <Enumerador cabecera="Alumnes:" coleccion={taller.inscripciones.map(i => i.alumne)} nodata='Sin alumnes' />

    <Id id={taller._id} />
  </>)
}