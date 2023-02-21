import { MovimientoLiquidacionProfe, Taller } from "../../lib/api"
import { Id } from "../general/id"
import { dias, dias_semana } from "../../lib/utils"
import { Enumerador } from "../general/enumerador"
import { Horario } from "../../lib/api"
import { flatten, range } from "lodash"
import { CartaBalance } from "../movimientos/balance"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context"
import { addMonths, endOfMonth, isAfter, isBefore, isEqual, startOfMonth } from "date-fns"
import { Boton } from "../general/boton"
import axios from "axios";
import { Controles } from "../general/controles"

interface InfoTallerProps {
  taller: Taller
}

export const InfoTaller = ({ taller }: InfoTallerProps) => {

  const [viendoLiquidacion, setViendoLiquidacion] = useState(false)

  const { movimientos, setMovimientos, inscripciones } = useContext(AppContext);

  const inicio_mes = startOfMonth(new Date())
  const fin_mes = endOfMonth(new Date())
  const inicio_mes_pasado = startOfMonth(addMonths(new Date(), -1))
  const fin_mes_pasado = endOfMonth(addMonths(new Date(), -1))

  const liquidaciones_este_taller = movimientos.filter(m => m.razon == "liquidacion profe" && (m as any).taller && (m as any).taller == taller._id)
  const liquidacion_mes_pasado_pendiente = liquidaciones_este_taller.filter(m => isEqual(new Date((m as any).mes), inicio_mes_pasado)).length == 0

  const inscripciones_este_taller = inscripciones.filter(i => i.activa && i.taller._id == taller._id)
  const pagos_este_taller = flatten(inscripciones_este_taller.map(i => i.pagos))


  const pagos_este_mes = pagos_este_taller.filter(p => {
    const f = new Date(p.fecha);
    return (isBefore(f, fin_mes) && isAfter(f, inicio_mes)) || isEqual(f, inicio_mes)
  })
  const total_recaudado_este_mes = pagos_este_mes.reduce((s, c) => s + c.monto, 0)
  const a_liquidar_este_mes = total_recaudado_este_mes * 0.6


  const pagos_mes_pasado = pagos_este_taller.filter(p => {
    const f = new Date(p.fecha);
    return (isBefore(f, fin_mes_pasado) && isAfter(f, inicio_mes_pasado)) || isEqual(f, inicio_mes_pasado)
  })
  const total_recaudado_mes_pasado = pagos_mes_pasado.reduce((s, c) => s + c.monto, 0)
  const a_liquidar_mes_pasado = total_recaudado_mes_pasado * 0.6


  const liquidar = () => {
    const liquidacion: MovimientoLiquidacionProfe = {
      monto: -a_liquidar_mes_pasado,
      medio: "efectivo",
      fecha: new Date(),
      razon: 'liquidacion profe',
      taller: taller._id,
      mes: inicio_mes_pasado
    }
    axios.post("/api/movimientos", liquidacion).then(r => {
      setMovimientos(ms => [...ms, r.data])
    })
  }

  return (<>
    <h2 className="text-2xl">{taller.nombre} - {taller.profe}</h2>
    <hr />

    <Enumerador cabecera="Horarios:" coleccion={taller.horarios} accesor={(h: Horario) => `${dias[h.dia]} ${h.hora}`} nodata='Sin horarios' />
    <Enumerador cabecera="Precios:" coleccion={taller.precios.map((c, i) => `${dias_semana[i]}: $${c}`)} nodata='Sin precios' />
    <Enumerador cabecera="Alumnes:" coleccion={taller.inscripciones.map(i => i.alumne)} nodata='Sin alumnes' />
    <Enumerador cabecera="Inició:" coleccion={[new Date(taller.iniciado).toLocaleDateString('es-ES')]} nodata='Sin fecha de inicio' />

    <hr className="my-2" />

    <p>Estado de liquidación mes pasado: {liquidacion_mes_pasado_pendiente ? '❌ Pendiente' : '✅ Hecha'}</p>
    <div className="flex">
      <Boton texto={viendoLiquidacion ? "Ocultar" : "Ver liquidación"} color="indigo" onClick={() => setViendoLiquidacion(!viendoLiquidacion)} />
      {liquidacion_mes_pasado_pendiente && <Boton texto="Liquidar" color="emerald" onClick={liquidar}/>}
    </div>
    {viendoLiquidacion && <div className="grid grid-cols-4">
      <p>Recaudado mes pasado:</p>
      <p>Liquidación mes pasado:</p>
      <p>Recaudado este mes:</p>
      <p>Liquidación este mes</p>

      <p>${total_recaudado_mes_pasado}</p>
      <p>${a_liquidar_mes_pasado}</p>
      <p>${total_recaudado_este_mes}</p>
      <p>${a_liquidar_este_mes}</p>
    </div>}

    <Id id={taller._id} />
  </>)
}