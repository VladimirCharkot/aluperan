import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Controles } from "../display/controles"
import { Modal } from "../display/modal"
import { Boton } from "../input/boton"
import { nombres_meses } from "../../../lib/utils"
import { MedioDePago, MovimientoLiquidacionProfePost, MovimientoPost, Taller } from "../../../lib/api"
import { useBackend } from "../../context/backend"
import { startOfMonth } from "date-fns"
import { P } from "../display/p"
import { Select } from "../input/select"
import { capitalize } from "lodash"

interface ModalConfirmarLiquidacionProps {
  monto: number,
  mes: Date,
  taller: Taller,
  cerrar: () => void
}

export const ModalConfirmarLiquidacion = ({ monto, mes, taller, cerrar }: ModalConfirmarLiquidacionProps) => {
  const { crearMovimiento } = useBackend()

  const [liquidacionConfirmada, setLiquidacionConfirmada] = useState(false);

  const [liquidacion, setLiquidacion] = useState<MovimientoLiquidacionProfePost>({
    monto: -monto,
    medio: "efectivo",
    fecha: new Date(),
    razon: 'liquidacion profe',
    taller: taller._id,
    mes: startOfMonth(mes),
    detalle: `Liquidación ${taller.profe} para el mes de ${nombres_meses[mes.getMonth()]}`
  })

  const updateMedio = (m: MedioDePago) => setLiquidacion(liq => ({...liq, medio: m}))
  const medios: MedioDePago[] = ['efectivo', 'mercadopago', 'otro']
  const opts_medios = medios.map(m => ({v: m, txt: capitalize(m)}))

  const liquidar = async () => {
    console.log(`Posteando liquidación:`)
    console.log(liquidacion)
    await crearMovimiento(liquidacion)
    console.log(`Liquidación posteada!`)
  }

  useEffect(() => {
    console.log(`Hay que liquidar? ${liquidacionConfirmada}`)
    if (liquidacionConfirmada) { liquidar().then(cerrar); }
  }, [liquidacionConfirmada])

  // const updateMedio = (m: MedioDePago) => setMovimiento(mov => ({...mov, medio: m}))

  return (
    <Modal cerrar={() => { setLiquidacionConfirmada(false); cerrar() }}>
      <P>Confirmar la liquidación implica el pago del monto del mes que cerró (${monto} por {nombres_meses[mes.getMonth()]}) a el/la profe del taller ({taller.profe})</P>
      <P>Medio:</P> 
      <Select onChange={e => updateMedio(e.target.value as MedioDePago)} opts={opts_medios}/>
      <Controles>
        <Boton texto="Pagar y confirmar" onClick={() => { setLiquidacionConfirmada(true); }} color="emerald" />
        <Boton texto="Cancelar" onClick={() => { setLiquidacionConfirmada(false); cerrar(); }} color="red" />
      </Controles>
    </Modal>
  )
}