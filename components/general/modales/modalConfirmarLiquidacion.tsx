import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Controles } from "../display/controles"
import { Modal } from "../display/modal"
import { Boton } from "../input/boton"
import { nombres_meses, medios_de_pago } from "../../../lib/utils"
import { MedioDePago, MovimientoLiquidacionProfePost, MovimientoPost, Taller } from "../../../lib/api"
import { useBackend } from "../../context/backend"
import { startOfMonth } from "date-fns"
import { P } from "../display/p"
import { Select } from "../input/select"
import { capitalize } from "lodash"
import { Icon } from "@iconify/react"

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
    mes: startOfMonth(mes)
  })

  const updateMedio = (m: MedioDePago) => setLiquidacion(liq => ({...liq, medio: m}))
  
  const opts_medios = medios_de_pago.map(m => ({v: m, txt: capitalize(m)}))

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
      <p className="text-center m-4"> Confirmar la liquidación implica el pago del monto del mes que cerró (${monto} por {nombres_meses[mes.getMonth()]}) a el/la profe del taller ({taller.profe})</p>
      <div className="flex flex-col m-4">
      <p className="mt-4 font-bold text-xl">Medio de pago:</p> 
      <Select onChange={e => updateMedio(e.target.value as MedioDePago)} opts={opts_medios}/>
      <div className="flex justify-center">
        <Boton texto="Confirmar Pago" onClick={() => { setLiquidacionConfirmada(true); }} color="emerald" />
        <Boton texto="Cancelar" onClick={() => { setLiquidacionConfirmada(false); cerrar(); }} color="red" />
      </div>
      </div>
    </Modal>
  )
}