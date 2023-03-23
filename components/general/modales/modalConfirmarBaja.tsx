import { Dispatch, SetStateAction } from "react";
import { Controles } from "../display/controles";
import { Modal } from "../display/modal"
import { Boton } from "../input/boton";

interface ModalConfirmarBajaProps{
  nombre: string,
  tipo: string,
  cerrar: () => void,
  setConfirmado: Dispatch<SetStateAction<boolean>>
}

export const ModalConfirmarBaja = ({nombre, tipo, cerrar, setConfirmado} : ModalConfirmarBajaProps) => {

  return (<Modal cerrar={cerrar}>
    <p>Confirmás que das de baja el {tipo} {nombre}?</p>
      <Controles>
        <Boton texto="Confirmar" onClick={() => { setConfirmado(true); cerrar(); }} color="emerald" />
        <Boton texto="Cancelar" onClick={() => { setConfirmado(false); cerrar(); }} color="red" />
      </Controles>
  </Modal>)
}