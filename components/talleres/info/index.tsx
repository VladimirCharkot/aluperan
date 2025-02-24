import { useState } from "react"

import { Taller } from "../../../lib/api"
import { dias, dias_semana } from "../../../lib/utils"
import { Enumerador } from "../../general/display/enumerador"
import { Horario } from "../../../lib/api"
import { addMonths } from "date-fns"
import { Boton } from "../../general/input/boton"

import { Pagos } from "./pagos"
import { Liquidacion } from "./liquidacion"
import { Asistencias } from "./asistencias"
import { MesSelector } from "../../general/input/mes"
import { FlexR } from "../../general/display/flexR"
import { useBackend } from "../../context/backend"
import { groupBy } from "lodash"

interface InfoTallerProps {
  taller: Taller
  // mes: Date
}

export const InfoTaller = ({ taller }: InfoTallerProps) => {

  // const alumnes_con_info_de_pago = alumnes_con_info_pago(inscripciones, movimientos, taller._id)
  const [mes, setMes] = useState(new Date())

  const { lkpInscripcionesTaller } = useBackend();

  // Inscripciones para este taller, cada una con una lista de horarios
  const inscripciones_taller = lkpInscripcionesTaller(taller).filter(i => i.activa)

  // Inscripciones por horario
  const inscripciones_por_horario_diferenciado = inscripciones_taller
    .flatMap(i => i.horarios?.map(h => ({...i, horario: h}))).filter(x => x)
    
  // Agrupadas
  const inscripciones_por_horario = groupBy(inscripciones_por_horario_diferenciado, i => i.horario.dia + i.horario.hora)

  const [viendoPagos, setViendoPagos] = useState(false)
  const toggleVerPagos = () => setViendoPagos(!viendoPagos)

  const [viendoAsistencias, setViendoAsistencias] = useState(false)
  const toggleVerAsistencias = () => setViendoAsistencias(!viendoAsistencias)

  const [viendoLiquidaciones, setViendoLiquidaciones] = useState(false)
  const toggleVerLiquidaciones = () => setViendoLiquidaciones(!viendoLiquidaciones)


  return (<>
    <FlexR justify="between">
      <h2 className="text-2xl">{taller.nombre} - {taller.profe}</h2>
      <MesSelector mes={mes} setMes={setMes}/>
    </FlexR>
    <hr />

    <Enumerador vertical={true} cabecera="Horarios:" coleccion={taller.horarios} accesor={(h: Horario) => `${dias[h.dia]} ${h.hora} (${inscripciones_por_horario[h.dia+h.hora]?.length ?? 0} inscripciones)`} nodata='Sin horarios' />
    {/* <Enumerador cabecera="Precios:" coleccion={taller.precios.map((c, i) => `${dias_semana[i]}: $${c}`)} nodata='Sin precios' /> */}
    {/* <Enumerador cabecera="Alumnes:" coleccion={alumnes_con_info_de_pago} accesor={a => a.nombre} nodata='Sin alumnes' decorador={a => a.mes_pago ? 'border-emerald-300' : 'border-red-300'} /> */}
    {/* <Enumerador cabecera="Inició:" coleccion={[taller.iniciado.toLocaleDateString('es-ES')]} nodata='Sin fecha de inicio' /> */}

    <hr className="my-2" />

    <div className="flex">
      <Boton texto="Alumnes" color="indigo" onClick={toggleVerPagos} />
      <Boton texto="Asistencias" color="indigo" onClick={toggleVerAsistencias} />
      <Boton texto="Liquidaciones" color="indigo" onClick={toggleVerLiquidaciones} />
    </div>

    {viendoPagos && <Pagos taller={taller} mes={mes} />}

    {viendoLiquidaciones && <Liquidacion taller={taller} mes={addMonths(mes, -1)} />}

    {viendoAsistencias && <Asistencias taller={taller} mes={mes} />}

    {/* <Id id={taller._id} /> */}
  </>)
}

