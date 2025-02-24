import { Dispatch, SetStateAction, ChangeEventHandler, useState, useEffect, MouseEventHandler } from "react";
import { TextInput } from "../general/input/textInput";
import { Boton } from "../general/input/boton";
import { ModalInscripcion } from "../general/modales/modalInscripcion";
import { Alumne, Inscripcion } from "../../lib/api";
import { useBackend } from "../context/backend";
import { FlexR } from "../general/display/flexR";
import { ModalConfirmarLiquidacion } from "../general/modales/modalConfirmarLiquidacion";
import { ModalConfirmarBaja } from "../general/modales/modalConfirmarBaja";
import { capitalize } from "lodash";
import { formatearHorarios } from "../../lib/utils"; 
import { ModalHorarioInscripcion } from "../general/modales/modalHorarioInscripcion";
import { Check } from "../general/input/checkbox";

export type Handler = ChangeEventHandler<HTMLInputElement>
interface EditarAlumneProps {
  alumne: Alumne,
  setAlum: Dispatch<SetStateAction<Alumne>>,
  setEditing: Dispatch<SetStateAction<boolean>>,
}

export const EditarAlumne = ({ alumne, setAlum, setEditing }: EditarAlumneProps) => {

  const { editarInscripcion, editarAlumne, lkpInscripcionesAlumne, lkpTallerInscripcion } = useBackend();
  const inscripciones_alum = lkpInscripcionesAlumne(alumne).filter(i => i.activa);

  const [inscribiendo, setInscribiendo] = useState<boolean>(false);
  const [estableciendoHorarios, setEstableciendoHorarios] = useState<Inscripcion | undefined>();
  const [bajando, setBajando] = useState<boolean>(false);
  const [bajaConfirmada, setBajaConfirmada] = useState<boolean>(false);

  const updateFicha: MouseEventHandler<HTMLInputElement> = e => { setAlum(a => ({ ...a, ficha: !a.ficha })) }
  const updateCelu: Handler = e => { setAlum(a => ({ ...a, celular: e.target.value })) }
  const updateNombre: Handler = e => { setAlum(a => ({ ...a, nombre: e.target.value })) }

  const baja = (id: string) => editarInscripcion({ _id: id, activa: false })
  const update = () => {editarAlumne(alumne).then(cerrar)}
  const cerrar = () => setEditing(false)

  useEffect(() => {
    if (bajaConfirmada) editarAlumne({_id: alumne._id, activo: false}) 
  }, [bajaConfirmada])

  return (
    <>

      {inscribiendo && <ModalInscripcion alumne={alumne} setAlumne={setAlum} cerrar={() => setInscribiendo(false)}/>}
      {bajando && <ModalConfirmarBaja nombre={alumne.nombre} tipo="alumne" cerrar={() => setBajando(false)} setConfirmado={setBajaConfirmada}/>}
      {estableciendoHorarios && <ModalHorarioInscripcion inscripcion={estableciendoHorarios} cerrar={() => setEstableciendoHorarios(undefined)}/>}

      <FlexR justify="between">
        <input className="text-2xl bg-transparent border-b outline-none" value={alumne.nombre} onChange={updateNombre} />
        <Boton texto="Dar de baja" color="red" onClick={() => setBajando(true)}/>
      </FlexR>

      <hr />

      <div className="grid grid-cols-2 gap-2 my-3">
        <p>Celular:</p>
        <TextInput value={alumne.celular ?? ''} onChange={updateCelu} />
        <p>Ficha médica:</p>
        <Check checked={alumne.ficha ?? false} onClick={updateFicha} />
      </div>

      <p className="text-xl mt-3">Inscripciones:</p>
      {inscripciones_alum.map(i => <div key={i._id} className="flex flex-row items-center my-2">
        <p>{lkpTallerInscripcion(i) ? `${lkpTallerInscripcion(i).nombre} (${ i.horarios ? formatearHorarios(i.horarios) : 'SIN HORARIOS'})` : 'Taller borrado'}</p>
        <Boton addons="ml-auto" color="indigo" texto="Establecer horarios" onClick={() => {setEstableciendoHorarios(i)}} />
        <Boton color="red" texto="Baja" onClick={() => baja(i._id)} />
      </div>)}

      <Boton color="emerald" texto="Agregar inscripcion" onClick={() => { setInscribiendo(true); }} />

      <hr />

      <div className="flex flex-row-reverse">
        <Boton color="indigo" texto="Listo" onClick={update} />
      </div>

    </>)
}