import { ChangeEventHandler, MouseEventHandler, useContext, useState } from "react";
import { Modal } from "../display/modal";
import { Boton } from "../input/boton";
import { TextInput } from "../input/textInput";
import { AlumnePost } from "../../../lib/api";
import { useBackend } from "../../context/backend";
import { P } from "../display/p";
import { Check } from "../input/checkbox";

interface ModalNuevoAlumneProps {
  cerrar: () => void
}

export type Handler = ChangeEventHandler<HTMLInputElement>
export type CheckHandler = MouseEventHandler<HTMLInputElement>

export const ModalNuevoAlumne = ({ cerrar }: ModalNuevoAlumneProps) => {

  const { crearAlumne } = useBackend();

  const [alumne, setAlumne] = useState<AlumnePost>({ nombre: '' })

  const updateNombre: Handler = e => setAlumne(a => ({ ...a, nombre: e.target.value }))
  const updateCelular: Handler = e => setAlumne(a => ({ ...a, celular: e.target.value }))
  const updateFicha: CheckHandler = e => setAlumne(a => ({ ...a, ficha: !a.ficha }))
  
  const postAlumne = () => { crearAlumne(alumne).then(cerrar) }

  const valido = !!alumne.nombre

  return (
    <Modal cerrar={ cerrar }>

        <P>Nombre:</P>
        <TextInput value={alumne.nombre} onChange={updateNombre} />

        <P>Celular:</P>
        <TextInput value={alumne.celular ?? ''} onChange={updateCelular} />

        <P>Trajo ficha médica:</P>
        <Check checked={alumne.ficha ?? false} onClick={updateFicha} />

        <Boton addons='ml-auto' texto='Agregar' color="emerald" activo={valido} onClick={postAlumne} />

    </Modal>
  )
}