import { useState } from "react"
import { isInMonth, nombres_meses } from "../../../lib/utils"
import { useBackend } from "../../context/backend"
import { Boton } from "../../general/input/boton"
import { ModalConfirmarLiquidacion } from "../../general/modales/modalConfirmarLiquidacion"
import { Taller } from "../../../lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LiquidacionProps {
  taller: Taller,
  mes: Date
}

export const Liquidacion = ({ taller, mes }: LiquidacionProps) => {
  const { lkpPagosTaller, lkpLiquidacionesTaller } = useBackend()

  // Dado un mes, calcula ingresos, divide 60% para profe y 40% alupe, y chequea si ya existe liquidación correspondiente
  const balance_liquidacion = (mes: Date) => {
    const total_recaudado_mes = lkpPagosTaller(taller).filter(p =>
      (p.razon == 'clase suelta' && isInMonth(p.ocasion, mes))
      || (p.razon == 'inscripcion' && isInMonth(p.mes, mes))
    ).reduce((s, c) => s + c.monto, 0)

    const liquidaciones_este_taller = lkpLiquidacionesTaller(taller)
    const liquidacion_mes_pendiente = liquidaciones_este_taller.filter(m => isInMonth(m.mes, mes)).length == 0
    const porcentaje_profe = (taller.porcentaje_profe ?? 60) / 100

    return {
      total: total_recaudado_mes,
      a_liquidar_profe: total_recaudado_mes * porcentaje_profe,
      a_liquidar_alupe: total_recaudado_mes * (1 - porcentaje_profe),
      pendiente: liquidacion_mes_pendiente
    }
  }

  const { total, a_liquidar_profe, a_liquidar_alupe, pendiente } = balance_liquidacion(mes)
  const [viendoModalLiquidacion, setViendoModalLiquidacion] = useState(false)

  return (
    <>
      {viendoModalLiquidacion && (
        <ModalConfirmarLiquidacion
          monto={a_liquidar_profe}
          mes={mes}
          taller={taller}
          cerrar={() => setViendoModalLiquidacion(false)}
        />
      )}
<div className=" bg-indigo-50/90 p-4 my-10 rounded-xl">
      <p className="text-2xl bg-indigo-200/90 p-2 w-fit rounded">
        Info de liquidación para el mes anterior (<strong>{nombres_meses[mes.getMonth()]}</strong>)
      </p>

      <Table className="my-4">
        <TableHeader>
          <TableRow className="text-lg">
            <TableHead>Recaudado</TableHead>
            <TableHead>Liquidación Profe</TableHead>
            <TableHead>Liquidación Alupe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>${total}</TableCell>
            <TableCell>${a_liquidar_profe}</TableCell>
            <TableCell>${a_liquidar_alupe}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex flex-col justify-center items-center mt-4">
        <p className={`text-sm mx-5 font-bold`}>
          Estado de liquidación: <span className={`${pendiente? 'text-rose-500':'text-emerald-500'}`}>{pendiente ? '❌ Pendiente' : '✅ Hecha'}</span>
        </p>
        {pendiente && (
          <Boton texto="Liquidar" color="indigo" onClick={() => setViendoModalLiquidacion(true)} />
        )}
      </div>

      </div>
    </>
  )
}