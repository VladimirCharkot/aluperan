import { addMonths } from "date-fns"
import { useState } from "react"
import { isInMonth, nombres_meses } from "../../../lib/utils"
import { useBackend } from "../../context/backend"

import { P } from "../../general/display/p"
import { Boton } from "../../general/input/boton"
import { ModalConfirmarLiquidacion } from "../../general/modales/modalConfirmarLiquidacion"

import { Taller } from "../../../lib/api"

interface LiquidacionProps {
  taller: Taller,
  mes: Date
}

export const Liquidacion = ({ taller, mes }: LiquidacionProps) => {

  const { lkpPagosTaller, lkpLiquidacionesTaller } = useBackend()

  // Dado un mes, calcula ingresos, divide 60% para profe y 40% alupe, y chequea si ya existe liquidación correspondiente
  const balance_liquidacion = (mes: Date) => {

    const pagos_este_taller = lkpPagosTaller(taller)
    const total_recaudado_mes = lkpPagosTaller(taller).filter(p =>
      (p.razon == 'clase suelta' && isInMonth(p.ocasion, mes))
      || (p.razon == 'inscripcion' && isInMonth(p.mes, mes))
    ).reduce((s, c) => s + c.monto, 0)

    const liquidaciones_este_taller = lkpLiquidacionesTaller(taller)
    const liquidacion_mes_pendiente = liquidaciones_este_taller.filter(m => isInMonth(m.mes, mes)).length == 0

    return {
      total: total_recaudado_mes,
      a_liquidar_profe: total_recaudado_mes * 0.6,
      a_liquidar_alupe: total_recaudado_mes * 0.4,
      pendiente: liquidacion_mes_pendiente
    }
  }


  const { total, a_liquidar_profe, a_liquidar_alupe, pendiente } = balance_liquidacion(mes);

  const [viendoModalLiquidacion, setViendoModalLiquidacion] = useState(false);

  return (<>

    {viendoModalLiquidacion && <ModalConfirmarLiquidacion
      monto={a_liquidar_profe} mes={mes}
      taller={taller} cerrar={() => setViendoModalLiquidacion(false)} />}

    <P>Info de liquidación para el mes anterior (<strong>{nombres_meses[mes.getMonth()]}</strong>)</P>

    <div className="grid grid-cols-3 mx-5 my-2">
      <p>Recaudado:</p>
      <p>Liquidación profe:</p>
      <p>Liquidación alupe:</p>

      <p>${total}</p>
      <p>${a_liquidar_profe}</p>
      <p>${a_liquidar_alupe}</p>
    </div>

    <div className="flex items-center">
      {pendiente && <Boton texto="Liquidar" color="emerald" onClick={() => setViendoModalLiquidacion(true)} />}
      <p className="text-sm my-2 mx-5">Estado de liquidación: {pendiente ? '❌ Pendiente' : '✅ Hecha'}</p>
    </div>
    <hr />
  </>)
}