import { Dispatch, SetStateAction, ChangeEventHandler, useState, useEffect } from "react";
import { TextInput } from "../general/input/textInput";
import { Boton } from "../general/input/boton";
import { ModalInscripcion } from "../general/modales/modalInscripcion";
import { Alumne } from "../../lib/api";
import { useBackend } from "../context/backend";
import { FlexR } from "../general/display/flexR";
import { ModalConfirmarLiquidacion } from "../general/modales/modalConfirmarLiquidacion";
import { ModalConfirmarBaja } from "../general/modales/modalConfirmarBaja";

export type Handler = ChangeEventHandler<HTMLInputElement>
interface EditarAlumneProps {
  alumne: Alumne,
  setAlum: Dispatch<SetStateAction<Alumne>>,
  setEditing: Dispatch<SetStateAction<boolean>>,
}

export const EditarAlumne = ({ alumne, setAlum, setEditing }: EditarAlumneProps) => {

  const { editarInscripcion, editarAlumne } = useBackend();

  const [inscribiendo, setInscribiendo] = useState<boolean>(false);
  const [bajando, setBajando] = useState<boolean>(false);
  const [bajaConfirmada, setBajaConfirmada] = useState<boolean>(false);

  const updateMail: Handler = e => { setAlum(a => ({ ...a, email: e.target.value })) }
  const updateCelu: Handler = e => { setAlum(a => ({ ...a, celular: e.target.value })) }
  const updateNombre: Handler = e => { setAlum(a => ({ ...a, nombre: e.target.value })) }

  const deleteInscripcion = (inscr: string) => 
    editarAlumne({_id: alumne._id, inscripciones: alumne.inscripciones.filter(i => i._id != inscr)})


  const baja = (id: string) => editarInscripcion({ _id: id, activa: false }).then(() => {
    deleteInscripcion(id) 
  });

  const update = () => {editarAlumne(alumne).then(() => {
    setEditing(false)
  } )}

  useEffect(() => {
    if (bajaConfirmada) editarAlumne({_id: alumne._id, activo: false}) 
  }, [bajaConfirmada])

  return (
    <>

      {inscribiendo && <ModalInscripcion alumne={alumne} setAlumne={setAlum} cerrar={() => setInscribiendo(false)}/>}
      {bajando && <ModalConfirmarBaja nombre={alumne.nombre} tipo="alumne" cerrar={() => setBajando(false)} setConfirmado={setBajaConfirmada}/>}

      <FlexR justify="between">
        <input className="text-2xl bg-transparent border-b outline-none" value={alumne.nombre} onChange={updateNombre} />
        <Boton texto="Dar de baja" color="red" onClick={() => setBajando(true)}/>
      </FlexR>

      <hr />

      <div className="grid grid-cols-2 gap-2 my-3">
        <p>Celular:</p>
        <TextInput value={alumne.celular ?? ''} onChange={updateCelu} />
        <p>Mail:</p>
        <TextInput value={alumne.email ?? ''} onChange={updateMail} />
      </div>

      <p className="text-xl mt-3">Inscripciones:</p>
      {alumne.inscripciones.map(i => <div key={i._id} className="flex flex-row items-center justify-between my-2">
        <p>{`${i.taller.nombre} (${i.dias})`}</p>
        <Boton color="red" texto="Baja" onClick={() => baja(i._id)} />
      </div>)}

      <Boton color="emerald" texto="Agregar inscripcion" onClick={() => {
        setInscribiendo(true);
      }} />

      <hr />

      <div className="flex flex-row-reverse">
        <Boton color="indigo" texto="Listo" onClick={update} />
      </div>

    </>)
}