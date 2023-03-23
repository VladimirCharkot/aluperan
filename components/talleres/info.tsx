import { useContext, useEffect, useState } from "react"
import { capitalize, find, flatten } from "lodash"

import { Alumne, Asistencia, Inscripcion, MovimientoLiquidacionProfePost, Pago, Taller } from "../../lib/api"
import { Id } from "../general/display/id"
import { dias, dias_semana, nombres_meses } from "../../lib/utils"
import { Enumerador } from "../general/display/enumerador"
import { Horario } from "../../lib/api"
import { AppContext } from "../context"
import { addMonths, endOfMonth, isAfter, isBefore, isEqual, isSameMonth, startOfMonth } from "date-fns"
import { Boton } from "../general/input/boton"

import axios from "axios";
import { ModalConfirmarLiquidacion } from "../general/modales/modalConfirmarLiquidacion"
import { ModalPasarLista } from "../general/modales/modalPasarLista"

import { FlexR } from "../general/display/flexR"
import { GrillaAsistencias } from "./asistencias"
import { useBackend } from "../context/backend"

interface InfoTallerProps {
  taller: Taller
}

export const InfoTaller = ({ taller }: InfoTallerProps) => {

  const { inscripciones } = useContext(AppContext);
  const alumnes_con_info_de_pago = alumnes_con_info_pago(inscripciones, taller._id)


  return (<>
    <h2 className="text-2xl">{taller.nombre} - {taller.profe}</h2>
    <hr />

    <Enumerador cabecera="Horarios:" coleccion={taller.horarios} accesor={(h: Horario) => `${dias[h.dia]} ${h.hora}`} nodata='Sin horarios' />
    <Enumerador cabecera="Precios:" coleccion={taller.precios.map((c, i) => `${dias_semana[i]}: $${c}`)} nodata='Sin precios' />
    <Enumerador cabecera="Alumnes:" coleccion={alumnes_con_info_de_pago} accesor={a => a.nombre} nodata='Sin alumnes' decorador={a => a.mes_pago ? 'border-emerald-300' : 'border-red-300'} />
    <Enumerador cabecera="Inició:" coleccion={[new Date(taller.iniciado).toLocaleDateString('es-ES')]} nodata='Sin fecha de inicio' />

    <hr className="my-2" />

    <PagosEsteMes alumnes={alumnes_con_info_de_pago} />

    <hr className="my-2" />

    <LiquidacionMesPasado taller={taller} />

    <hr className="my-2" />

    <Asistencias taller={taller} />

    <Id id={taller._id} />
  </>)
}



interface PagosEsteMesProps {
  alumnes: { nombre: string, mes_pago: boolean, pago?: Pago }[]
}

const PagosEsteMes = ({ alumnes }: PagosEsteMesProps) => {

  const [viendoPagos, setViendoPagos] = useState(false)
  const toggleVerPagos = () => setViendoPagos(!viendoPagos)

  return (
    <>
    <FlexR>
      <Boton texto={viendoPagos ? "Ocultar pagos" : "Ver pagos"}
        color="indigo" onClick={toggleVerPagos} />
    </FlexR>
      {viendoPagos && <div className="grid grid-cols-4 my-4">
        <p>Alumne</p>
        <p>Pago</p>
        <p>Medio</p>
        <p>Fecha</p>
        {alumnes.map(a => <>
          <p className="text-sm">{a.nombre}</p>
          <p className="text-sm">{a.pago ? `$${a.pago.monto}` : "$0"}</p>
          <p className="text-sm">{a.pago ? capitalize(a.pago.medio) : "-"}</p>
          <p className="text-sm">{a.pago ? new Date(a.pago.fecha).toLocaleDateString("es-ES") : "-"}</p>
        </>)}
      </div>}
    </>
  )
}




interface AsistenciasProps {
  taller: Taller
}

const Asistencias = ({ taller }: AsistenciasProps) => {
  const { asistencias, traerAsistencias } = useBackend();

  useEffect(() => { traerAsistencias(taller._id, new Date()) }, [])

  const [pasandoLista, setPasandoLista] = useState(false);
  const [viendoAsistencias, setViendoAsistencias] = useState(false);

  const abrirLista = () => setPasandoLista(true)
  const cerrarLista = () => setPasandoLista(false)
  const toggleAsistencias = () => setViendoAsistencias(!viendoAsistencias)

  return <>
    {pasandoLista && <ModalPasarLista taller={taller} cerrar={cerrarLista} />}
    <FlexR>
      <Boton texto={viendoAsistencias ? "Ocultar asistencias" : "Ver asistencias"}
        color="indigo" onClick={toggleAsistencias} />
      <Boton texto="Pasar lista" color="emerald" onClick={abrirLista} />
    </FlexR>
    {viendoAsistencias && <GrillaAsistencias taller={taller} asistencias={asistencias} />}
  </>
}




interface LiquidacionMesPasadoProps {
  taller: Taller
}

const LiquidacionMesPasado = ({ taller }: LiquidacionMesPasadoProps) => {

  const { inscripciones, movimientos, crearMovimiento } = useBackend()

  const balance_liquidacion = (mes: Date) => {
    const inicio_mes = startOfMonth(mes)
    const fin_mes = endOfMonth(mes)
    console.log(`Calculando balance entre ${inicio_mes.toLocaleDateString('es-ES')} y ${fin_mes.toLocaleDateString('es-ES')}...`)

    const inscripciones_este_taller = inscripciones.filter(i => i.activa && i.taller._id == taller._id)
    const pagos_este_taller = flatten(inscripciones_este_taller.map(i => i.pagos))

    const pagos_mes = pagos_este_taller.filter(p => {
      const f = new Date(p.fecha);
      return (isBefore(f, fin_mes) && isAfter(f, inicio_mes)) || isEqual(f, inicio_mes)
    })
    const total_recaudado_mes = pagos_mes.reduce((s, c) => s + c.monto, 0)

    //@ts-ignore
    const liquidaciones_este_taller = movimientos.filter(m => m.razon == "liquidacion profe" && m.taller == taller._id)
    const liquidacion_mes_pendiente = liquidaciones_este_taller.filter(m => m.razon == "liquidacion profe" && isSameMonth(new Date(m.mes), inicio_mes_pasado)).length == 0
    console.log(`Liquidaciones para ${taller.nombre}...`)
    console.log(liquidaciones_este_taller)

    console.log(`Pendiente? ${liquidacion_mes_pendiente}`)

    return {
      total: total_recaudado_mes,
      a_liquidar_profe: total_recaudado_mes * 0.6,
      a_liquidar_alupe: total_recaudado_mes * 0.4,
      pendiente: liquidacion_mes_pendiente
    }
  }


  const liquidar = () => {
    console.log(`Liquidando...`)
    const liquidacion: MovimientoLiquidacionProfePost = {
      monto: -a_liquidar_profe,
      medio: "efectivo",
      fecha: new Date(),
      razon: 'liquidacion profe',
      taller: taller._id,
      mes: inicio_mes_pasado,
      detalle: `Liquidación ${taller.profe}`
    }
    crearMovimiento(liquidacion)
  }


  const inicio_mes_pasado = startOfMonth(addMonths(new Date(), -1))
  const { total, a_liquidar_profe, a_liquidar_alupe, pendiente } = balance_liquidacion(inicio_mes_pasado);

  const [viendoLiquidacion, setViendoLiquidacion] = useState(false);
  const [viendoModalLiquidacion, setViendoModalLiquidacion] = useState(false);
  const [liquidacionConfirmada, setLiquidacionConfirmada] = useState(false);

  useEffect(() => {
    if (liquidacionConfirmada) liquidar();
  }, [liquidacionConfirmada])


  return (<>
    {viendoModalLiquidacion && <ModalConfirmarLiquidacion
      monto={a_liquidar_profe} mes={nombres_meses[inicio_mes_pasado.getMonth()]}
      profe={taller.profe} cerrar={() => setViendoModalLiquidacion(false)}
      setConfirmado={setLiquidacionConfirmada} />}
    <p className="text-sm">Estado de liquidación mes pasado: {pendiente ? '❌ Pendiente' : '✅ Hecha'}</p>
    <div className="flex">
      <Boton texto={viendoLiquidacion ? "Ocultar liquidación" : "Ver liquidación"} color="indigo" onClick={() => setViendoLiquidacion(!viendoLiquidacion)} />
      {pendiente && <Boton texto="Liquidar" color="emerald" onClick={() => setViendoModalLiquidacion(true)} />}
    </div>
    {viendoLiquidacion && <div className="grid grid-cols-3">
      <p>Recaudado mes pasado:</p>
      <p>Liquidación profe mes pasado:</p>
      <p>Liquidación alupe mes pasado:</p>

      <p>${total}</p>
      <p>${a_liquidar_profe}</p>
      <p>${a_liquidar_alupe}</p>

    </div>}
  </>)
}





const alumnes_con_info_pago = (inscripciones: Inscripcion[], id_taller: string) => {
  const inicio_mes = startOfMonth(new Date())
  const fin_mes = endOfMonth(new Date())

  const inscripciones_este_taller = inscripciones.filter(i => i.taller._id == id_taller)
  const alumnes_con_info_de_pago =
    inscripciones_este_taller.map(i => {
      const pago = find(i.pagos, p => {
        const f = new Date(p.fecha)
        return isBefore(f, fin_mes) && isAfter(f, inicio_mes) || isEqual(f, inicio_mes)
      })
      return { ...i.alumne, mes_pago: !!pago, pago }
    })

  return alumnes_con_info_de_pago
}