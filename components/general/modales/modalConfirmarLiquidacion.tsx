import { Dispatch, SetStateAction } from "react"
import { Controles } from "../display/controles"
import { Modal } from "../display/modal"
import { Boton } from "../input/boton"

interface ModalConfirmarLiquidacionProps{
  monto: number, 
  mes: string,
  profe: string,
  cerrar: () => void,
  setConfirmado: Dispatch<SetStateAction<boolean>>
}

export const ModalConfirmarLiquidacion = ({ monto, mes, profe, cerrar, setConfirmado }: ModalConfirmarLiquidacionProps) => {

  return (
    <Modal cerrar={ () => {setConfirmado(false); cerrar()} }>
      <p>Confirmar la liquidación implica el pago del monto del mes que cerró (${monto} por {mes}) a el/la profe del taller ({profe})</p>
      <Controles>
        <Boton texto="Pagar y confirmar" onClick={() => { setConfirmado(true); cerrar(); }} color="emerald" />
        <Boton texto="Cancelar" onClick={() => { setConfirmado(false); cerrar(); }} color="red" />
      </Controles>
    </Modal>
  )
}